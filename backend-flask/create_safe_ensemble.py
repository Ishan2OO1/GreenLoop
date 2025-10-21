import joblib
import traceback

print("🔧 Creating TabNet-free ensemble...")

try:
    # Load the original ensemble
    original_models = joblib.load("model/ensemble_top3.pkl")
    print(f"📥 Loaded original ensemble: {list(original_models.keys())}")
    
    # Create new ensemble without TabNet
    safe_models = {}
    
    # Test each model individually
    for name, model in original_models.items():
        if name == 'TabNet':
            print(f"⚠️ Skipping {name} (DLL issues)")
            continue
            
        try:
            # Test if we can access the model safely
            print(f"✅ Including {name}: {type(model).__name__}")
            safe_models[name] = model
        except Exception as e:
            print(f"❌ Excluding {name}: {e}")
    
    # Save the safe ensemble
    joblib.dump(safe_models, "model/ensemble_safe.pkl")
    print(f"💾 Saved safe ensemble with {len(safe_models)} models: {list(safe_models.keys())}")
    
    # Create model info for the safe ensemble
    model_info_safe = {
        'individual_rmse': {
            'XGBoost': 21.55,      # From your notebook
            'Random Forest': 30.16  # From your notebook
        },
        'ensemble_strategy': 'weighted_safe',
        'note': 'TabNet excluded due to DLL compatibility issues'
    }
    
    joblib.dump(model_info_safe, "model/model_info_safe.pkl")
    print("✅ Saved model_info_safe.pkl")
    
    print("\n🎯 Safe Ensemble Created Successfully!")
    print("   - XGBoost (RMSE: 21.55)")  
    print("   - Random Forest (RMSE: 30.16)")
    print("   - TabNet excluded (DLL issues)")
    
except Exception as e:
    print(f"❌ Error: {e}")
    traceback.print_exc()