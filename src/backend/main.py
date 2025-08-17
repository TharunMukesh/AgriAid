from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
# import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier
import joblib
from flask import Flask,request,jsonify
from flask_cors import CORS
import pandas as pd
# import numpy as np

df = pd.read_csv('Crop_recommendation.csv')

X = df[['temperature','humidity','ph','rainfall']]

location_encoder = LabelEncoder()

y = location_encoder.fit_transform(df['label'])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

clf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    min_samples_split=5,
    min_samples_leaf=2
)

clf.fit(X_train,y_train)

print("Test accuracy:", clf.score(X_test,y_test))



joblib.dump({
    'model' : clf,
    'le' : location_encoder
}, 'crop_env_model.pkl')

app = Flask(__name__)
CORS(app)
obj = joblib.load('crop_env_model.pkl')
model,label_enc=obj['model'],obj['le']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        features = [data.get(k) for k in ['temperature','humidity','ph', 'rainfall']]

        pred = model.predict([features])
        recommended_crop = label_enc.inverse_transform(pred)[0]
        return jsonify({
            'crop': recommended_crop,
        })

    except Exception as e:
        return jsonify({'error': str(e)}),400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)