import json
import pandas as pd
import xgboost as xgb
import sklearn
from mapsite.common.util.prepare_data import prepare_data


def train(data):
    # Prepare data
    df = prepare_data(data)

    # Split data into features and targets
    X = df.drop(columns=['wood', 'steel', 'osmid'])
    y_wood = df['wood']
    y_metals = df['steel']

    reg = xgb.XGBRegressor()

    reg.fit(X, [y_wood, y_metals])

    prediction = reg.predict(X)

    reg.save_model('model.json')

    print(prediction)


# Load JSON data
with open('train.json', 'r') as file:
    data = json.load(file)
    train(data)
