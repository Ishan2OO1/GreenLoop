import joblib
import sys
import traceback

print("🔍 Inspecting ensemble_top3.pkl...")

try:
    models = joblib.load("model/ensemble_top3.pkl")
    print(f"✅ Successfully loaded ensemble file")
    print(f"📊 Models found: {list(models.keys())}")
    
    for name, model in models.items():
        print(f"\n🔍 {name}:")
        print(f"   Type: {type(model)}")
        try:
            # Try to access the model without executing it
            print(f"   Model class: {model.__class__.__name__}")
        except:
            print(f"   Could not access model class")
            
except Exception as e:
    print(f"❌ Error loading ensemble: {e}")
    traceback.print_exc()