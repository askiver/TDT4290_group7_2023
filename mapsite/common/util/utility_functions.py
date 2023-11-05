import json
from datetime import datetime
import chardet
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import OneHotEncoder


def get_target_columns():
    # Load json file
    column_names = []
    with open('common/util/waste_report_template.json','r') as file:
        data = json.load(file)

        for key, item in data['ordinaryWaste'].items():
            column_names.append('ordinaryWaste_' + key + '_waste_amount')
            column_names.append('ordinaryWaste_' + key + '_recycled_amount')

        for key, item in data['dangerousWaste'].items():
            column_names.append('dangerousWaste_' + key + '_waste_amount')
            column_names.append('dangerousWaste_' + key + '_recycled_amount')

    return column_names


def handle_features(data):
    # cast code column to int
    data['bnr'] = data['bnr'].astype(int)
    data['stories'] = data['stories'].astype(int)
    data['area'] = data['area'].astype(int)
    data['building_year'] = data['building_year'].astype(int)
    # if bnr is 0, set it to 111
    data['bnr'] = data['bnr'].replace(0, 111)
    return data


# Encodes building category into three one-hot encoded columns based on the building code
def encode_building_category(data):
    # Load file containing all building codes
    with open('common/util/building_codes.csv',
              'rb') as file:
        rawdata = file.read()
        result = chardet.detect(rawdata)
        charenc = result['encoding']
    building_codes = pd.read_csv(
        'common/util/building_codes.csv',
        sep=';',
        encoding=charenc,)
    building_codes['level_1'] = building_codes['code'] // 100
    building_codes['level_2'] = (building_codes['code'] % 100) // 10
    building_codes['level_3'] = building_codes['code'] % 10

    data['bnr_level_1'] = data['bnr'] // 100
    data['bnr_level_2'] = (data['bnr'] % 100) // 10
    data['bnr_level_3'] = data['bnr'] % 10

    for i in range(1, 4):
        # Possible categories
        categories = sorted(list(set(building_codes['level_' + str(i)].to_list())))
        # building_types = pd.DataFrame({'bnr': building_codes['code'].to_list()})
        building_types = pd.DataFrame({'bnr_level_' + str(i): categories})
        # Initialize OneHotEncoder with predefined categories
        encoder = OneHotEncoder(categories=[categories], handle_unknown='error')

        # Transform bnr column into one-hot encoded columns
        building_type_encoded = encoder.fit(building_types[['bnr_level_' + str(i)]])

        # Getting feature names
        feature_names = encoder.get_feature_names_out(input_features=building_types.columns)

        # Transform building_type column into one-hot encoded columns
        building_type_encoded_df = pd.DataFrame(
            building_type_encoded.transform(data[['bnr_level_' + str(i)]]).toarray(),
            columns=feature_names)
        # Concatenate original dataframe with one-hot encoded columns
        data = pd.concat([data, building_type_encoded_df], axis=1)

    # Drop bnr columns
    data = data.drop(columns=['bnr', 'bnr_level_1', 'bnr_level_2', 'bnr_level_3'])

    return data


# Method that uses waste report prediction for a given building to give material usage
def predict_materials(data):
    prediction = predict_waste_report(data)
    # Prepare new dataframe
    new_df = pd.DataFrame()
    # Combine values of related target columns
    for i in range(0, len(prediction.columns), 2):
        # Find prefix of column name
        prefix = prediction.columns[i].split('_')[1]
        # Add values of related columns
        new_df[prefix] = prediction[prediction.columns[i]] + prediction[prediction.columns[i + 1]]
    # Return new dataframe
    return new_df


# Method for predicting all relevant waste report values for a given building
def predict_waste_report(data):
    bst = xgb.Booster()  # init model
    # load model
    bst.load_model('common/util/model.json')
    # prepare data
    df = prepare_data_prediction(data)
    # Drop id column before prediction
    #df = df.drop(columns=['osmid'])
    # Convert dataframe to DMatrix
    df_xgb = xgb.DMatrix(df.copy())
    # Make prediction
    prediction = bst.predict(df_xgb)
    # Convert prediction to dataframe
    df_predictions = pd.DataFrame(prediction, columns=get_target_columns())
    # Concatenate prediction with original dataframe
    #df_predictions = pd.concat([df, df_predictions], axis=1)
    return df_predictions


def prepare_data_prediction(data):
    # create dataframe from list of dictionaries
    data = pd.DataFrame(data, index=[0])

    # handle features
    data = handle_features(data)

    # encode building category
    data = encode_building_category(data)

    return data


def prepare_data_waste_report(data_list):
    dfs = [pd.json_normalize(data) for data in data_list]

    # Concatenate all dataframes together
    df = pd.concat(dfs, ignore_index=True)
    # Rename columns for consistency
    df.columns = (df.columns.str.replace('property.', '', regex=False)
                  #.str.replace('dangerousWaste.', '', regex=False)
                  #.str.replace('ordinaryWaste.', '', regex=False)
                  .str.replace('.', '_', regex=False))

    # Only keep relevant columns
    df = df[['bnr', 'area', 'stories', 'building_year'] + get_target_columns()]

    df = handle_features(df)

    # Transform bnr column into one-hot encoded columns
    df = encode_building_category(df)

    return df


def train_waste_report(data):
    # Prepare data
    # data is a list of dictionaries
    df = prepare_data_waste_report(data)

    # Split data into features and targets
    X = df.drop(columns=get_target_columns())
    targets = df[get_target_columns()]

    reg = xgb.XGBRegressor()

    reg.fit(X, targets)

    reg.save_model('common/util/model.json')


def handle_float32(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    raise TypeError(f"Object of type '{obj.__class__.__name__}' is not JSON serializable")


def save_predicted_material_usage():
    # First load relevant data from mapdata.json
    buildings = []
    with open('frontend/src/assets/mapData1.json',
              'r') as file:
        data = json.load(file)
        for entry in data:
            # Get date string
            date_str = entry['date']
            if not date_str:
                # Let's just assume a probable year if there is no date
                year = 1970
            else:
                # Parse the date string using datetime
                parsed_date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S%z')
                # Extract the year and convert to int
                year = int(parsed_date.year)

            building = {
                'osmid': entry['osmid'],
                'bnr': entry['buildingcode'],
                # Transform building year into int
                'area': entry['area'],
                'stories': entry['stories'],
                'building_year': year,
            }
            buildings.append(building)

    # Then add predicted material usage to each building
    predicted_buildings = predict_materials(buildings)

    # Add predicted material values
    # change values of material values of buildings in json file
    for i in range(len(data)):
        for col in predicted_buildings.columns:
            data[i][col] = predicted_buildings[col][i]

    # Then save the data to mapdata.json
    with open('frontend/src/assets/mapData1.json',
              'w') as file:
        json.dump(data, file, default=handle_float32, indent=4)
