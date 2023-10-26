import xgboost as xgb
from mapsite.common.util.prepare_data import prepare_data


def predict(data):
    bst = xgb.Booster()  # init model
    bst.load_model('model.json')  # load model
    # prepare data
    df = prepare_data(data)
    prediction = bst.predict(df)
    return prediction


