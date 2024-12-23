import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load the dataset
df = pd.read_csv("enhanced_sustainability_data.csv")

# Derive sustainability score
df["sustainability_score"] = 100 * (1 - df["carbon_footprint"] / df["carbon_footprint"].max())

# Separate features and target
X = df.drop(columns=["carbon_footprint", "sustainability_score"])
y = df["sustainability_score"]

# Identify categorical and numerical features
categorical_features = ["region", "energy_type", "material_sourcing", "product_type", "transport_mode", "storage_type"]
numerical_features = ["distance_km", "production_volume", "shelf_days"]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(drop="first"), categorical_features)
    ]
)

# Build the model pipeline
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

# Train the model
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model Performance:")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"R² Score: {r2:.2f}")

# Save the model for future use
import joblib
joblib.dump(model, "sustainability_score_model.pkl")

# Example: Predict sustainability score for a new sample
sample_data = pd.DataFrame({
    "region": ["urban"],
    "energy_type": ["renewable"],
    "material_sourcing": ["local"],
    "production_volume": [3000],
    "product_type": ["perishable"],
    "transport_mode": ["road"],
    "distance_km": [500],
    "storage_type": ["refrigerated"],
    "shelf_days": [20]
})

# Predict for new sample
predicted_score = model.predict(sample_data)
print(f"Predicted Sustainability Score: {predicted_score[0]:.2f}")