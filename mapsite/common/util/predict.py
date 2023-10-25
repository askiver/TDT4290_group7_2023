import xgboost as xgb

def predict(data):
    bst = xgb.Booster()  # init model
    bst.load_model('model.json')  # load model
    dtest = xgb.DMatrix(data)
    prediction = bst.predict(dtest)
    return prediction


