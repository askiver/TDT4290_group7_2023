import json
import random

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import OneHotEncoder


def predict_materials(data):
    bst = xgb.Booster()  # init model
    bst.load_model('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/common/util/model.json')  # load model
    # prepare data
    df = prepare_data_waste_report(data)
    # Get id column
    osmid = df['osmid']
    # Drop id column
    df = df.drop(columns=['osmid'])
    # Convert dataframe to DMatrix
    df = xgb.DMatrix(df)
    # Make prediction
    prediction = bst.predict(df)
    # Add id column to prediction
    prediction = pd.concat([osmid, pd.DataFrame(prediction)], axis=1)
    # Add column names
    prediction.columns = ['osmid', 'wood', 'steel']
    type(prediction)
    return prediction

def predict_waste_report(data):
    bst = xgb.Booster()  # init model
    bst.load_model('model.json')  # load model
    # prepare data
    df = prepare_data_waste_report(data)
    # Get id column
    osmid = df['osmid']
    # Drop id column
    df = df.drop(columns=['osmid'])
    # Convert dataframe to DMatrix
    df = xgb.DMatrix(df)
    # Make prediction
    prediction = bst.predict(df)
    # Add id column to prediction
    prediction = pd.concat([osmid, pd.DataFrame(prediction)], axis=1)
    print(type(prediction))
    return prediction


def prepare_data_waste_report(data):
    categories = [['Residential', 'Commercial', 'Industrial']]
    building_types = pd.DataFrame({'building_type': ['Residential', 'Commercial', 'Industrial']})
    # Initialize OneHotEncoder with predefined categories
    encoder = OneHotEncoder(categories=categories, handle_unknown='error')

    # Make dataframe from json file
    df = pd.DataFrame(data)
    # Transform building_type column into one-hot encoded columns
    building_type_encoded = encoder.fit(building_types)

    # Getting feature names
    feature_names = encoder.get_feature_names_out(input_features=building_types.columns)

    # Transform building_type column into one-hot encoded columns
    building_type_encoded_df = pd.DataFrame(building_type_encoded.transform(df[['building_type']]).toarray(),
                                            columns=feature_names)

    # Drop building_type column from original dataframe
    df = df.drop(columns=['building_type'])

    # Concatenate original dataframe with one-hot encoded columns
    df = pd.concat([df, building_type_encoded_df], axis=1)

    return df


def train_waste_report(data):
    # Prepare data
    df = prepare_data_waste_report(data)

    # Split data into features and targets
    X = df.drop(columns=['wood', 'metals', 'osmid'])
    y_wood = df['wood']
    y_metals = df['metals']

    reg = xgb.XGBRegressor()

    reg.fit(X, [y_wood, y_metals])

    prediction = reg.predict(X)

    reg.save_model('model.json')


def handle_float32(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    raise TypeError(f"Object of type '{obj.__class__.__name__}' is not JSON serializable")

def save_predicted_material_usage(predictions):
    categories = ['Residential', 'Commercial', 'Industrial']
    # First load relevant data from mapdata.json
    buildings = []
    with open('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/frontend/src/assets/mapData1.json', 'r') as file:
        data = json.load(file)
        for entry in data:
            building = {
            'osmid': entry['osmid'],
            'building_type': random.choice(categories),
            #'building_type': waste_report['building_code'],
            'building_year': random.randint(1900, 2020),
            'area': entry['area'],
            'stories': entry['stories'],
            }
            buildings.append(building)

    # Then add predicted material usage to each building
    predicted_buildings = predict_materials(buildings)
    # change values of material values of buildings in json file
    for i in range(len(data)):
        data[i]['wood'] = predicted_buildings['wood'][i]
        data[i]['steel'] = predicted_buildings['steel'][i]

    print(data)
    # Then save the data to mapdata.json
    with open('/Users/askiversylte/PycharmProjects/TDT4290_group7_2023/mapsite/frontend/src/assets/testmapData.json', 'w') as file:
        json.dump(data, file, default=handle_float32, indent=4)



