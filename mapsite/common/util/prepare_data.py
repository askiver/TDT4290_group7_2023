import numpy as np
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
import json

categories = [['Residential', 'Commercial', 'Industrial']]
building_types = pd.DataFrame({'building_type': ['Residential', 'Commercial', 'Industrial']})
def prepare_data(data):
    # Initialize OneHotEncoder with predefined categories
    encoder = OneHotEncoder(categories=categories, handle_unknown='error')

    # Make dataframe from json file
    df = pd.DataFrame(data["data"])
    # Transform building_type column into one-hot encoded columns
    building_type_encoded = encoder.fit(building_types)

    # Getting feature names
    feature_names = encoder.get_feature_names_out(input_features=building_types.columns)

    # Transform building_type column into one-hot encoded columns
    building_type_encoded_df = pd.DataFrame(building_type_encoded.transform(df[['building_type']]).toarray(), columns=feature_names)

    # Drop building_type column from original dataframe
    df = df.drop(columns=['building_type'])

    # Concatenate original dataframe with one-hot encoded columns
    df = pd.concat([df, building_type_encoded_df], axis=1)

    return df


with open('train.json', 'r') as file:
    data = json.load(file)
    df = pd.DataFrame(data["data"])

print(prepare_data(data))


