import requests
import numpy as np

print("🧪 Direct Model Test (bypassing preprocessing)")

# Test with a properly formatted numpy array that matches what the models expect
test_data = {
    "process_type": 0,
    "energy_consumption_kwh_per_ton": 500.0,
    "ambient_temperature_c": 25.0,
    "humidity_percent": 60.0
}

print(f"📤 Sending: {test_data}")

try:
    response = requests.post(
        "http://127.0.0.1:5000/api/predict",
        json=test_data,
        timeout=10
    )
    
    print(f"📨 Status: {response.status_code}")
    print(f"📨 Response: {response.text}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n🎯 SUCCESS!")
        print(f"✅ Prediction: {result.get('prediction')} kg CO2e per ton")
        print(f"📊 Individual predictions: {result.get('individual_predictions')}")
        print(f"⚖️ Weights used: {result.get('weights_used')}")
        print(f"🔧 Strategy: {result.get('strategy')}")
        print(f"🤖 Models used: {result.get('models_used')}")
    else:
        print(f"\n❌ FAILED")
        try:
            error_data = response.json()
            print(f"Error: {error_data.get('error', 'Unknown error')}")
        except:
            print(f"Raw response: {response.text}")
            
except Exception as e:
    print(f"❌ Connection error: {e}")

print("\n" + "="*50)
print("🏁 Test completed")