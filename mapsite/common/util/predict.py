import json

import pandas as pd
import xgboost as xgb
from mapsite.common.util.prepare_data import prepare_data


def predict(data):
    bst = xgb.Booster()  # init model
    bst.load_model('model.json')  # load model
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
    prediction = pd.concat([osmid, pd.DataFrame(prediction)], axis=1)
    print(type(prediction))
    return prediction


with open('predict.json', 'r') as file:
    data = json.load(file)


print(predict(data))

