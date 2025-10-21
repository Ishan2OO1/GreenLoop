import requests
import json

# Test the API
print("🧪 Testing Flask API...")

# Test status endpoint
try:
    response = requests.get("http://127.0.0.1:5000/api/status")
    print(f"✅ Status endpoint: {response.status_code}")
    print(f"📊 Response: {response.json()}")
except Exception as e:
    print(f"❌ Status test failed: {e}")

print("\n" + "="*50)

# Test prediction endpoint  
test_cases = [
    {
        "process_type": "cement", 
        "energy_consumption_kwh_per_ton": 500,
        "ambient_temperature_c": 25, 
        "humidity_percent": 60
    },
    {
        "process_type": "steel",
        "energy_consumption_kwh_per_ton": 400,
        "ambient_temperature_c": 20,
        "humidity_percent": 55  
    },
    {
        "process_type": "aluminum",
        "energy_consumption_kwh_per_ton": 300,
        "ambient_temperature_c": 30,
        "humidity_percent": 70
    }
]

for i, test_data in enumerate(test_cases, 1):
    print(f"\n🧪 Test Case {i}: {test_data['process_type']}")
    try:
        response = requests.post(
            "http://127.0.0.1:5000/api/predict",
            json=test_data
        )
        
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"🎯 Success: {result.get('success')}")
            print(f"   Prediction: {result.get('prediction')} kg CO2e per ton")
            if result.get('individual_predictions'):
                print(f"   Individual predictions: {result.get('individual_predictions')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        
print(f"\n✅ API testing completed!")