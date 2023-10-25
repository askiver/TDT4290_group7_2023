import json
import pandas as pd
import xgboost as xgb
import sklearn

# Load JSON data
with open('train.json', 'r') as file:
    data = json.load(file)
    df = pd.DataFrame(data["data"])


df = pd.get_dummies(df, columns=['building_type'], drop_first=True)

# Split data into features and targets
X = df.drop(columns=['wood', 'metals'])
y_wood = df['wood']
y_metals = df['metals']

reg = xgb.XGBRegressor()

reg.fit(X, [y_wood, y_metals])

prediction = reg.predict(X)

reg.save_model('model.json', format='json')

print(prediction)
