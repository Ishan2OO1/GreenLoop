import requests
import json

print("🧪 Testing with numeric-only data...")

# Test with minimal data that should work
test_data = {
    "process_type": 0,  # Use numeric directly
    "energy_consumption_kwh_per_ton": 500.0,
    "ambient_temperature_c": 25.0,
    "humidity_percent": 60.0
}

try:
    response = requests.post(
        "http://127.0.0.1:5000/api/predict",
        json=test_data
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n🎯 SUCCESS!")
        print(f"Prediction: {result.get('prediction')} kg CO2e per ton")
        print(f"Individual predictions: {result.get('individual_predictions')}")
    
except Exception as e:
    print(f"Error: {e}")