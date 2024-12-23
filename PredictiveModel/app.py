from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd
from flask_cors import CORS

import joblib

# Load the pre-trained model
model = joblib.load("sustainability_score_model.pkl")
joblib.dump(model, 'sustainability_score_model.pkl', compress=3)

# Initialize Flask app
app = Flask(__name__)
CORS(app)


# Define the predict route
@app.route("/predict", methods=["POST"])
def predict():
    # Extract data from the form
    input_data = {
        "region": [request.form["region"]],
        "energy_type": [request.form["energy_type"]],
        "material_sourcing": [request.form["material_sourcing"]],
        "production_volume": [int(request.form["production_volume"])],
        "product_type": [request.form["product_type"]],
        "transport_mode": [request.form["transport_mode"]],
        "distance_km": [int(request.form["distance_km"])],
        "storage_type": [request.form["storage_type"]],
        "shelf_days": [int(request.form["shelf_days"])]
    }
    
    # Create a DataFrame for the input
    input_df = pd.DataFrame(input_data)
    # print(input_df);
    
    # Predict using the model
    prediction = model.predict(input_df)[0]  # Get the first (and likely only) prediction 
    prediction = float(prediction) 

    return jsonify({'prediction': prediction}) 

if __name__ == "__main__":
    app.run(debug=True)