import requests
import json

def test_server():
    print("🧪 COMPREHENSIVE API SERVER TEST")
    print("=" * 50)
    
    base_url = "http://127.0.0.1:5000"
    
    # Test 1: Status endpoint
    print("1️⃣ Testing Status Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/status")
        print(f"   Status: {response.status_code} ✅")
        if response.status_code == 200:
            data = response.json()
            print(f"   Models loaded: {data.get('models_loaded')} ✅")
            print(f"   Available models: {data.get('available_models')} ✅")
            print(f"   Model count: {data.get('model_count')} ✅")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "-" * 30)
    
    # Test 2: Model info endpoint
    print("2️⃣ Testing Model Info Endpoint...")
    try:
        response = requests.get(f"{base_url}/api/model-info")
        print(f"   Status: {response.status_code} ✅")
        if response.status_code == 200:
            data = response.json()
            print(f"   Success: {data.get('success')} ✅")
            print(f"   Top 3 models: {data.get('top3_models')} ✅")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "-" * 30)
    
    # Test 3: Prediction endpoint with different data types
    print("3️⃣ Testing Prediction Endpoint...")
    
    test_cases = [
        {
            "name": "Numeric process_type",
            "data": {
                "process_type": 0,
                "energy_consumption_kwh_per_ton": 500,
                "ambient_temperature_c": 25,
                "humidity_percent": 60
            }
        },
        {
            "name": "String process_type (cement)",
            "data": {
                "process_type": "cement",
                "energy_consumption_kwh_per_ton": 400,
                "ambient_temperature_c": 22,
                "humidity_percent": 55
            }
        },
        {
            "name": "Float values",
            "data": {
                "process_type": 1,
                "energy_consumption_kwh_per_ton": 350.5,
                "ambient_temperature_c": 28.7,
                "humidity_percent": 65.2
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n   Test 3.{i}: {test_case['name']}")
        try:
            response = requests.post(
                f"{base_url}/api/predict",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Success: {result.get('success')}")
                print(f"   🎯 Prediction: {result.get('prediction')} kg CO2e per ton")
                
                if result.get('individual_predictions'):
                    print(f"   📊 Individual predictions:")
                    for model, pred in result.get('individual_predictions', {}).items():
                        print(f"      - {model}: {pred:.2f}")
                        
                if result.get('weights_used'):
                    print(f"   ⚖️ Weights: {result.get('weights_used')}")
                    
            else:
                print(f"   ❌ Error ({response.status_code}): {response.text[:200]}...")
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 SERVER TEST COMPLETED!")

if __name__ == "__main__":
    test_server()