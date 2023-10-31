import json
from datetime import datetime

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import OneHotEncoder


def get_target_columns():
    # Load json file
    column_names = []
    with open('waste_report_template.json', 'r') as file:
        data = json.load(file)

        for key, item in data['ordinaryWaste'].items():
            column_names.append(key + '_waste_amount')
            column_names.append(key + '_recycled_amount')

        for key, item in data['dangerousWaste'].items():
            column_names.append(key + '_waste_amount')
            column_names.append(key + '_recycled_amount')

    return column_names


def predict_materials(data):
    bst = xgb.Booster()  # init model
    bst.load_model(
        '/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/model.json')  # load model
    # prepare data
    df = prepare_data(data)
    # Get id column
    osmid = df['osmid']
    # Drop id column
    df = df.drop(columns=['osmid'])
    # Convert dataframe to DMatrix
    df = xgb.DMatrix(df)
    # Make prediction
    prediction = bst.predict(df)
    # Add id column to prediction
    prediction = pd.DataFrame(prediction)
    # Add column names
    prediction.columns = get_target_columns()
    # Prepare new dataframe
    new_df = pd.DataFrame()
    # Add osmid column
    #new_df['osmid'] = osmid
    # Combine values of related target columns
    for i in range(0, len(prediction.columns), 2):
        # Find prefix of column name
        prefix = prediction.columns[i].split('_')[0]
        # Add values of related columns
        new_df[prefix] = prediction[prediction.columns[i]] + prediction[prediction.columns[i + 1]]
    # Return new dataframe
    return new_df


def predict_waste_report(data):
    bst = xgb.Booster()  # init model
    bst.load_model('model.json')  # load model
    # prepare data
    df = prepare_data_waste_report(data)
    # Get id column
    osmid = df['osmid']
    # Drop id column before prediction
    df = df.drop(columns=['osmid'])
    # Convert dataframe to DMatrix
    df = xgb.DMatrix(df)
    # Make prediction
    prediction = bst.predict(df)
    # Add id column to prediction
    prediction = pd.concat([osmid, pd.DataFrame(prediction)], axis=1)
    print(prediction)
    # Find target columns
    target_columns = [col for col in prediction.columns if 'amount' in col]
    targets = prediction[target_columns]
    return prediction

def prepare_data(data):
    # create dataframe from from list of dictionaries
    data = pd.DataFrame(data)
    # cast code column to int
    data['bnr'] = data['bnr'].astype(int)
    # if bnr is 0, set it to 111
    data['bnr'] = data['bnr'].replace(0, 111)
    import chardet
    # Find all possible categories based on content of csv file
    with open('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/building_codes.csv',
              'rb') as file:
        rawdata = file.read()
        result = chardet.detect(rawdata)
        charenc = result['encoding']
    building_codes = pd.read_csv(
        '/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/building_codes.csv',
        sep=';',
        encoding=charenc, )
    # Only use third level building codes
    building_codes = building_codes[building_codes['level'] == 3]
    # Possible categories
    categories = building_codes['code'].to_list()
    building_types = pd.DataFrame({'bnr': building_codes['code'].to_list()})
    # Initialize OneHotEncoder with predefined categories
    encoder = OneHotEncoder(categories=[categories], handle_unknown='error')

    # Transform bnr column into one-hot encoded columns
    building_type_encoded = encoder.fit(building_types[['bnr']])

    # Getting feature names
    feature_names = encoder.get_feature_names_out(input_features=building_types.columns)

    # Transform building_type column into one-hot encoded columns
    building_type_encoded_df = pd.DataFrame(building_type_encoded.transform(data[['bnr']]).toarray(),
                                            columns=feature_names)

    # Drop building_type column from original dataframe
    data = data.drop(columns=['bnr'])

    # Concatenate original dataframe with one-hot encoded columns
    data = pd.concat([data, building_type_encoded_df], axis=1)

    return data

def prepare_data_waste_report(data):
    import chardet
    # Find all possible categories based on content of csv file
    with open('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/building_codes.csv', 'rb') as file:
        rawdata = file.read()
        result = chardet.detect(rawdata)
        charenc = result['encoding']
    building_codes = pd.read_csv('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/building_codes.csv',
                                sep=';',
                                 encoding=charenc,)
    # Only use third level building codes
    building_codes = building_codes[building_codes['level'] == 3]
    # Possible categories
    categories = building_codes['code'].to_list()
    building_types = pd.DataFrame({'bnr': building_codes['code'].to_list()})
    # Initialize OneHotEncoder with predefined categories
    encoder = OneHotEncoder(categories=[categories], handle_unknown='error')

    column_names = []
    column_values = []
    # Get relevant data from json file
    #data = json.load(data)

    column_names.append('bnr')
    column_values.append(int(data['property']['bnr']))

    for key, item in data['ordinaryWaste'].items():
        column_names.append(key + '_waste_amount')
        column_values.append(item['waste']['amount'])
        column_names.append(key + '_recycled_amount')
        column_values.append(item['recycled']['amount'])

    for key, item in data['dangerousWaste'].items():
        column_names.append(key + '_waste_amount')
        column_values.append(item['waste']['amount'])
        column_names.append(key + '_recycled_amount')
        column_values.append(item['recycled']['amount'])

    # Make dataframe from json file
    df = pd.DataFrame([column_values], columns=column_names)
    # Transform bnr column into one-hot encoded columns
    building_type_encoded = encoder.fit(building_types[['bnr']])

    # Getting feature names
    feature_names = encoder.get_feature_names_out(input_features=building_types.columns)

    # Transform building_type column into one-hot encoded columns
    building_type_encoded_df = pd.DataFrame(building_type_encoded.transform(df[['bnr']]).toarray(),
                                            columns=feature_names)

    # Drop building_type column from original dataframe
    df = df.drop(columns=['bnr'])

    # Concatenate original dataframe with one-hot encoded columns
    df = pd.concat([df, building_type_encoded_df], axis=1)

    return df


def train_waste_report(data):
    # Prepare data
    # data is a list of dictionaries
    df = prepare_data_waste_report(data[0])
    for i in range(1, len(data)):
        row = prepare_data_waste_report(data[i])
        df = pd.concat([df, row], axis=0)

    # Find all column names that contain 'amount'
    target_columns = [col for col in df.columns if 'amount' in col]

    # Split data into features and targets
    X = df.drop(columns=target_columns)
    targets = df[target_columns]

    reg = xgb.XGBRegressor()

    reg.fit(X, targets)

    prediction = reg.predict(X)

    reg.save_model('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/model.json')


def handle_float32(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    raise TypeError(f"Object of type '{obj.__class__.__name__}' is not JSON serializable")


def save_predicted_material_usage():
    # First load relevant data from mapdata.json
    buildings = []
    with open('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/frontend/src/assets/mapData1.json',
              'r') as file:
        data = json.load(file)
        for entry in data:
            # Get date string
            date_str = entry['date']
            if not date_str:
                year = 0
            else:
                # Parse the date string using datetime
                parsed_date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S%z')
                # Extract the year and convert to int
                year = int(parsed_date.year)

            building = {
                'osmid': entry['osmid'],
                'bnr': entry['buildingcode'],
                # Transform building year into int
                'building_year': year ,
                'area': entry['area'],
                'stories': entry['stories'],
            }
            buildings.append(building)

    # Then add predicted material usage to each building
    predicted_buildings = predict_materials(buildings)

    # Add predicted material values
    # change values of material values of buildings in json file
    for i in range(len(data)):
        for col in predicted_buildings.columns:
            data[i][col] = predicted_buildings[col][i]

    print(data)
    # Then save the data to mapdata.json
    with open('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/frontend/src/assets/testmapData.json',
              'w') as file:
        json.dump(data, file, default=handle_float32, indent=4)
