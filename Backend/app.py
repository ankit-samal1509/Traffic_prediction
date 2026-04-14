from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

BASE     = os.path.join(os.path.dirname(__file__), 'models')
model    = joblib.load(os.path.join(BASE, 'best_model.pkl'))
scaler   = joblib.load(os.path.join(BASE, 'scaler.pkl'))
le_area  = joblib.load(os.path.join(BASE, 'le_area.pkl'))
le_weather = joblib.load(os.path.join(BASE, 'le_weather.pkl'))
le_road  = joblib.load(os.path.join(BASE, 'le_road.pkl'))
FEATURES = joblib.load(os.path.join(BASE, 'feature_names.pkl'))

AREAS    = le_area.classes_.tolist()
WEATHERS = le_weather.classes_.tolist()
ROADS    = le_road.classes_.tolist()

print("Models loaded successfully")

@app.route('/')
def home():
    return render_template('index.html', areas=AREAS,
                           weathers=WEATHERS, roads=ROADS)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        area = le_area.transform([data['area']])[0] if data['area'] in le_area.classes_ else 0
        weather = le_weather.transform([data['weather']])[0]
        road    = le_road.transform([data['roadwork']])[0]

        day_of_week = int(data['day_of_week'])

        input_df = pd.DataFrame([{
            'Area Name'                          : area,
            'Average Speed'                      : float(data['average_speed']),
            'Incident Reports'                   : int(data['incident_reports']),
            'Public Transport Usage'             : float(data['public_transport_usage']),
            'Traffic Signal Compliance'          : float(data['traffic_signal_compliance']),
            'Parking Usage'                      : float(data['parking_usage']),
            'Pedestrian and Cyclist Count'       : int(data['pedestrian_count']),
            'Weather Conditions'                 : weather,
            'Roadwork and Construction Activity' : road,
            'month'                              : int(data['month']),
            'day_of_week'                        : day_of_week,
            'day'                                : int(data['day']),
            'is_weekend'                         : 1 if day_of_week >= 5 else 0,
            'quarter'                            : (int(data['month']) - 1) // 3 + 1
        }])

        input_df = input_df.reindex(columns=FEATURES, fill_value=0)
        scaled     = scaler.transform(input_df[FEATURES])
        prediction = model.predict(scaled)

        return jsonify({
            'success'       : True,
            'traffic_volume': int(prediction[0])
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/areas', methods=['GET'])
def get_areas():
    return jsonify({'areas': le_area.classes_.tolist()})

@app.route('/weathers', methods=['GET'])
def get_weathers():
    return jsonify({'weathers': le_weather.classes_.tolist()})

@app.route('/roads', methods=['GET'])
def get_roads():
    return jsonify({'roads': le_road.classes_.tolist()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)