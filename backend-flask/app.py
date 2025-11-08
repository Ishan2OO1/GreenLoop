from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import warnings
import os
from datetime import datetime

# TabNet availability check - imports are deferred to avoid DLL issues
TABNET_AVAILABLE = False
TabNetRegressor = None

def check_tabnet_availability():
    """Check if TabNet is available and import it safely"""
    global TABNET_AVAILABLE, TabNetRegressor
    try:
        from pytorch_tabnet.tab_model import TabNetRegressor as TabNetRegressorClass
        import torch
        TabNetRegressor = TabNetRegressorClass
        TABNET_AVAILABLE = True
        print("✅ TabNet libraries imported successfully")
        return True
    except ImportError as e:
        print(f"⚠️ TabNet not available (ImportError): {e}")
        print("   Install with: pip install pytorch-tabnet")
        return False
    except OSError as e:
        print(f"⚠️ TabNet not available (DLL Error): {e}")
        print("   This is usually due to PyTorch DLL issues on Windows")
        print("   The server will work without TabNet using other models")
        return False
    except Exception as e:
        print(f"⚠️ TabNet not available (Unexpected Error): {e}")
        return False

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Global variables
models = None
preprocessing = None
model_info = None
ensemble_weights = None

def load_models():
    """Load ensemble model and preprocessing components"""
    global models, preprocessing, model_info, ensemble_weights, TABNET_AVAILABLE
    try:
        print("🚀 Loading Ensemble Models...")
        
        # Check TabNet availability only when needed
        TABNET_AVAILABLE = check_tabnet_availability()
        
        # Try to load the 2-model ensemble first (XGBoost + Random Forest only)
        model_files = [
            "model/ensemble_xgb_rf_only.pkl",     # NEW: Only XGBoost + Random Forest
            "model/ensemble_models_improved.pkl", # Fallback: Improved models from Prototype3 (RMSE ~21-30)
            "model/ensemble_with_tabnet.pkl",     # Models with TabNet
            "model/ensemble_models.pkl",          # Comprehensive models
            "model/ensemble_safe.pkl",            # Fallback safe models
            "model/ensemble_top3.pkl"             # Another fallback
        ]
        
        models_loaded = False
        tabnet_loaded = False
        
        for model_file in model_files:
            if os.path.exists(model_file):
                try:
                    loaded_models = joblib.load(model_file)
                    
                    # Handle TabNet separately since it can't be pickled normally
                    models = {}
                    for name, model in loaded_models.items():
                        if name == 'TabNet' and TABNET_AVAILABLE and TabNetRegressor:
                            # Load TabNet from separate file
                            tabnet_path = "model/tabnet_model.zip"
                            if os.path.exists(tabnet_path):
                                try:
                                    tabnet_model = TabNetRegressor()
                                    tabnet_model.load_model(tabnet_path)
                                    models[name] = tabnet_model
                                    tabnet_loaded = True
                                    print(f"✅ Loaded TabNet from: {tabnet_path}")
                                except Exception as e:
                                    print(f"⚠️ Failed to load TabNet: {e}")
                            else:
                                print(f"⚠️ TabNet file not found: {tabnet_path}")
                        else:
                            models[name] = model
                    
                    print(f"✅ Loaded base models from: {model_file}")
                    models_loaded = True
                    break
                    
                except Exception as e:
                    print(f"⚠️ Failed to load {model_file}: {e}")
                    continue
        
        # If no ensemble file found, try to load individual models
        if not models_loaded:
            print("⚠️ No ensemble file found, trying individual models...")
            models = {}
            
            # Load individual model files
            individual_models = {
                'Random Forest': 'model/random_forest_model.pkl',
                'XGBoost': 'model/xgboost_model.pkl'
            }
            
            for name, filepath in individual_models.items():
                if os.path.exists(filepath):
                    try:
                        model = joblib.load(filepath)
                        models[name] = model
                        print(f"✅ Loaded {name} from: {filepath}")
                        models_loaded = True
                    except Exception as e:
                        print(f"⚠️ Failed to load {name}: {e}")
            
            # Try to load TabNet separately
            if TABNET_AVAILABLE and TabNetRegressor:
                tabnet_path = "model/tabnet_model.zip"
                if os.path.exists(tabnet_path):
                    try:
                        tabnet_model = TabNetRegressor()
                        tabnet_model.load_model(tabnet_path)
                        models['TabNet'] = tabnet_model
                        tabnet_loaded = True
                        models_loaded = True
                        print(f"✅ Loaded TabNet from: {tabnet_path}")
                    except Exception as e:
                        print(f"⚠️ Failed to load TabNet: {e}")
        
        if not models_loaded:
            print("❌ No model files found!")
            return False
        
        if tabnet_loaded:
            print("🧠 TabNet successfully loaded and integrated!")
        
        # Load preprocessing components (prioritize Prototype3)
        preprocessing_files = [
            "preprocessing_info_3_prototype3.pkl",  # BEST: Complete Prototype3 preprocessing
            "model/preprocessing_improved.pkl",     # Improved preprocessing from Prototype3
            "model/preprocessing.pkl",
            "model/preprocessing_safe.pkl"
        ]
        
        for prep_file in preprocessing_files:
            if os.path.exists(prep_file):
                try:
                    preprocessing = joblib.load(prep_file)
                    print(f"✅ Loaded preprocessing from: {prep_file}")
                    break
                except Exception as e:
                    print(f"⚠️ Failed to load {prep_file}: {e}")
                    continue
        
        if preprocessing is None:
            print("⚠️ No preprocessing file found, will use basic preprocessing")
        
        # Load model info (including TabNet info if available)
        info_files = [
            "model/model_info_improved.pkl",     # NEW: Improved model info from Prototype3
            "model/model_info_with_tabnet.pkl",  # Enhanced info with TabNet
            "model/model_info.pkl",              # Standard info
            "model/model_info_safe.pkl"          # Fallback info
        ]
        
        for info_file in info_files:
            if os.path.exists(info_file):
                try:
                    model_info = joblib.load(info_file)
                    print(f"✅ Loaded model info from: {info_file}")
                    if model_info.get('tabnet_included', False):
                        print("🧠 Model info includes TabNet performance data")
                    break
                except Exception as e:
                    print(f"⚠️ Failed to load {info_file}: {e}")
                    continue
        
        if model_info is None:
            print("⚠️ No model info found, using default values")
            model_info = {
                'individual_rmse': {name: 25.0 for name in models.keys()},
                'feature_names': ['process_type', 'energy_consumption_kwh_per_ton', 
                                'ambient_temperature_c', 'humidity_percent']
            }
        
        # Calculate ensemble weights based on performance
        ensemble_weights = calculate_ensemble_weights()
        
        print(f"✅ Loaded ensemble models: {list(models.keys())}")
        if model_info and 'individual_rmse' in model_info:
            print(f"🎯 Model Performance (RMSE):")
            for name, score in model_info['individual_rmse'].items():
                if name in models:
                    print(f"   {name}: {score:.4f}")
        
        print(f"⚖️ Ensemble weights: {ensemble_weights}")
        return True
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

def calculate_ensemble_weights():
    """Use only XGBoost and Random Forest with equal weights (50% each)"""
    weights = {}
    
    # Only use XGBoost and Random Forest with equal weights
    target_models = ['XGBoost', 'Random Forest']
    available_target_models = [name for name in models.keys() if name in target_models]
    
    if len(available_target_models) == 0:
        # Fallback to all available models with equal weights if neither XGBoost nor RF available
        print("⚠️ Neither XGBoost nor Random Forest available, using all models equally")
        return {name: 1.0 / len(models) for name in models.keys()}
    
    # Give equal weight to available target models, zero to others
    equal_weight = 1.0 / len(available_target_models)
    
    for name in models.keys():
        if name in available_target_models:
            weights[name] = equal_weight
        else:
            weights[name] = 0.0  # Exclude other models
    
    print(f"🎯 Using equal weights for: {available_target_models}")
    print(f"⚖️ Weights: {[(name, weights[name]) for name in weights if weights[name] > 0]}")
    
    return weights

def predict_ensemble(data):
    """Make prediction using the loaded ensemble models"""
    try:
        print(f"🔄 Processing prediction request: {data}")
        
        # Prepare input data
        input_df = pd.DataFrame([data])
        
        # Apply preprocessing if available
        if preprocessing and isinstance(preprocessing, dict):
            print("✅ Using Prototype3 preprocessing pipeline")
            
            # Check if we have the new Prototype3 preprocessing structure
            if 'standard_preprocessor' in preprocessing:
                print("🎯 Using complete Prototype3 preprocessing")
                
                # Required columns for Prototype3
                required_cols = ['Unnamed: 0', 'energy_consumption_kwh_per_ton', 'ambient_temperature_c', 'humidity_percent', 'process_type']
                
                # Ensure all required columns are present with defaults
                if 'Unnamed: 0' not in input_df.columns:
                    input_df['Unnamed: 0'] = 0  # Index column
                if 'energy_consumption_kwh_per_ton' not in input_df.columns:
                    input_df['energy_consumption_kwh_per_ton'] = data.get('energy_consumption_kwh_per_ton', 100.0)
                if 'ambient_temperature_c' not in input_df.columns:
                    input_df['ambient_temperature_c'] = data.get('ambient_temperature_c', 25.0)
                if 'humidity_percent' not in input_df.columns:
                    input_df['humidity_percent'] = data.get('humidity_percent', 50.0)
                if 'process_type' not in input_df.columns:
                    input_df['process_type'] = data.get('process_type', 'production')
                
                # *** CRITICAL FIX: Map frontend process types to preprocessing pipeline categories ***
                if 'process_type' in input_df.columns:
                    process_type_map = {
                        'shredding': 'shredding',
                        'separation': 'separation',
                        'melting': 'melting',
                        'pyrolysis': 'pyrolysis',
                        'chemical': 'chemical',
                        'recycling': 'recycling',
                        'composting': 'composting',
                        'production': 'production',
                        'recovery': 'metal_recovery',  # Map recovery to metal_recovery
                        'treatment': 'c-si_treatment',  # Map treatment to c-si_treatment
                        'incineration': 'incineration',
                        'landfill': 'landfill',
                        # Legacy mappings
                        'cement': 'production',
                        'steel': 'production', 
                        'aluminum': 'recycling',
                        'plastic': 'plastic_recovery_processing',
                        'glass': 'glass_recovery'
                    }
                    
                    original_process = input_df['process_type'].iloc[0]
                    if isinstance(original_process, str):
                        mapped_process = process_type_map.get(original_process.lower(), 'production')
                        input_df['process_type'] = mapped_process
                        print(f"🔄 Mapped process type: '{original_process}' -> '{mapped_process}'")
                
                # Reorder columns to match training
                input_df = input_df[required_cols]
                print(f"📊 Input data shape: {input_df.shape}, columns: {list(input_df.columns)}")
                
                # Apply the complete preprocessing pipeline
                X_processed = preprocessing['standard_preprocessor'].transform(input_df)
                print(f"✅ Preprocessing completed. Output shape: {X_processed.shape}")
                
            # Fallback to old preprocessing logic
            elif 'scaler' in preprocessing:
                print("⚠️ Using fallback preprocessing")
                feature_names = preprocessing.get('feature_names', input_df.columns.tolist())
                
                # Ensure all required features are present
                for col in feature_names:
                    if col not in input_df.columns:
                        if col == 'process_type':
                            input_df[col] = 0  # Default process type
                        elif 'temperature' in col.lower():
                            input_df[col] = 25.0  # Default temperature
                        elif 'humidity' in col.lower():
                            input_df[col] = 50.0  # Default humidity
                        elif 'energy' in col.lower():
                            input_df[col] = 100.0  # Default energy
                        else:
                            input_df[col] = 0.0  # Generic default
                        print(f"⚠️ Added missing feature '{col}' with default value")
                
                # Reorder columns to match training
                input_df = input_df[feature_names]
                
                # Apply scaling to numerical columns
                categorical_cols = ['process_type']
                numerical_cols = [col for col in feature_names if col not in categorical_cols]
                
                if numerical_cols:
                    scaled_values = preprocessing['scaler'].transform(input_df[numerical_cols])
                    for i, col in enumerate(numerical_cols):
                        input_df[col] = scaled_values[0][i]
                
                X_processed = input_df.values
            else:
                X_processed = input_df.values
                
        else:
            # Fallback to basic preprocessing
            print("⚠️ Using basic preprocessing (no pipeline found)")
            
            # Handle basic categorical encoding for process_type
            if 'process_type' in input_df.columns:
                # Map frontend process types to actual categories expected by preprocessing pipeline
                # Based on the categories found in preprocessing_info_3_prototype3.pkl
                process_type_map = {
                    'shredding': 'shredding',
                    'separation': 'separation',
                    'melting': 'melting',
                    'pyrolysis': 'pyrolysis',
                    'chemical': 'chemical',
                    'recycling': 'recycling',
                    'composting': 'composting',
                    'production': 'production',
                    'recovery': 'metal_recovery',  # Map to available recovery category
                    'treatment': 'c-si_treatment',  # Map to available treatment category
                    'incineration': 'incineration',
                    'landfill': 'landfill',
                    # Legacy mappings for backward compatibility
                    'cement': 'production',
                    'steel': 'production', 
                    'aluminum': 'recycling',
                    'plastic': 'plastic_recovery_processing',
                    'glass': 'glass_recovery'
                }
                
                process_val = input_df['process_type'].iloc[0]
                if isinstance(process_val, str):
                    process_val = process_val.lower()
                    mapped_val = process_type_map.get(process_val, 'production')  # default to production
                    input_df['process_type'] = mapped_val
            
            # Ensure basic required columns exist
            required_cols = ['process_type', 'energy_consumption_kwh_per_ton', 
                           'ambient_temperature_c', 'humidity_percent']
            
            for col in required_cols:
                if col not in input_df.columns:
                    input_df[col] = 0.0
                    print(f"⚠️ Added missing column '{col}' with default value")
            
            # Convert to numeric
            for col in required_cols:
                input_df[col] = pd.to_numeric(input_df[col], errors='coerce').fillna(0.0)
            
            X_processed = input_df[required_cols].values
        
        print(f"✅ Processed input shape: {X_processed.shape}")
        print(f"✅ Processed values: {X_processed}")
        
        # Get predictions from available models
        predictions = {}
        for model_name, model in models.items():
            try:
                if model_name == 'TabNet' and TABNET_AVAILABLE and TabNetRegressor:
                    # Special handling for TabNet
                    X_tabnet = X_processed.reshape(1, -1).astype(np.float32)
                    pred = float(model.predict(X_tabnet)[0])
                    predictions[model_name] = pred
                    print(f"✅ {model_name} (TabNet) prediction: {pred:.2f} kg CO₂e/ton")
                else:
                    # Standard sklearn-compatible models
                    pred = float(model.predict(X_processed.reshape(1, -1))[0])
                    predictions[model_name] = pred
                    print(f"✅ {model_name} prediction: {pred:.2f} kg CO₂e/ton")
            except Exception as e:
                print(f"❌ Error with {model_name}: {e}")
                continue
        
        if not predictions:
            raise Exception("No models could make predictions - check input format and model compatibility")
        
        # Use dynamic ensemble weights
        weights = ensemble_weights if ensemble_weights else {
            name: 1.0/len(predictions) for name in predictions.keys()
        }
        
        # Ensure weights exist for all prediction models
        active_weights = {}
        total_weight = 0
        for name in predictions.keys():
            if name in weights:
                active_weights[name] = weights[name]
            else:
                active_weights[name] = 1.0 / len(predictions)
            total_weight += active_weights[name]
        
        # Normalize weights
        if total_weight > 0:
            for name in active_weights:
                active_weights[name] = active_weights[name] / total_weight
        
        # Calculate ensemble prediction
        ensemble_pred = sum(predictions[name] * active_weights[name] 
                          for name in predictions.keys())
        
        # Calculate confidence based on model agreement
        pred_values = list(predictions.values())
        confidence = 1.0 - (np.std(pred_values) / max(np.mean(pred_values), 1.0))
        confidence = max(0.0, min(1.0, confidence))  # Clamp to [0, 1]
        
        return {
            'ensemble_prediction': round(float(ensemble_pred), 2),
            'individual_predictions': {k: round(v, 2) for k, v in predictions.items()},
            'weights_used': {k: round(v, 3) for k, v in active_weights.items()},
            'confidence': round(confidence, 3),
            'strategy': '2_model_ensemble_xgb_rf',
            'models_used': list(predictions.keys()),
            'input_processed': True
        }
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        raise Exception(f"Prediction failed: {str(e)}")

@app.route('/api/status')
def status():
    tabnet_in_models = models and 'TabNet' in models if models else False
    
    return jsonify({
        'status': 'running',
        'models_loaded': models is not None,
        'available_models': list(models.keys()) if models else [],
        'model_count': len(models) if models else 0,
        'strategy': 'enhanced_ensemble_with_tabnet' if tabnet_in_models else 'weighted_ensemble',
        'preprocessing_loaded': preprocessing is not None,
        'tabnet_available': TABNET_AVAILABLE,
        'tabnet_loaded': tabnet_in_models,
        'individual_rmse': model_info.get('individual_rmse', {}) if model_info else {},
        'api_version': '2.1',
        'deep_learning_enabled': tabnet_in_models
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if not models:
            return jsonify({'success': False, 'error': 'Models not loaded'}), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Basic required fields (flexible handling for different input formats)
        core_required = ['process_type', 'energy_consumption_kwh_per_ton', 
                        'ambient_temperature_c', 'humidity_percent']
        
        # Check if we have at least the core fields
        missing_core = [field for field in core_required if field not in data]
        
        # If missing core fields, check if data has alternative formats
        if missing_core:
            # Check for legacy format (features array)
            if 'features' in data and isinstance(data['features'], list):
                if len(data['features']) >= 4:
                    # Convert array format to named format
                    feature_names = core_required
                    converted_data = {}
                    for i, name in enumerate(feature_names):
                        if i < len(data['features']):
                            converted_data[name] = data['features'][i]
                    data = converted_data
                    missing_core = []
                else:
                    return jsonify({
                        'success': False, 
                        'error': f'Features array must have at least 4 elements, got {len(data["features"])}'
                    }), 400
            else:
                return jsonify({
                    'success': False, 
                    'error': f'Missing required fields: {missing_core}. Please provide: {core_required}'
                }), 400
        
        # Get prediction
        result = predict_ensemble(data)
        
        # Interpret prediction level
        prediction_value = result['ensemble_prediction']
        if prediction_value < 150:
            impact_level = "Low"
            impact_color = "#28a745"
        elif prediction_value < 300:
            impact_level = "Moderate" 
            impact_color = "#ffc107"
        else:
            impact_level = "High"
            impact_color = "#dc3545"
        
        return jsonify({
            'success': True,
            'prediction': result['ensemble_prediction'],
            'individual_predictions': result['individual_predictions'],
            'weights_used': result['weights_used'],
            'confidence': result.get('confidence', 0.8),
            'strategy': result['strategy'],
            'unit': 'kg CO₂e per ton',
            'impact_level': impact_level,
            'impact_color': impact_color,
            'input_data': data,
            'model_count': len(result['individual_predictions']),
            'timestamp': datetime.now().isoformat(),
            'models_used': result['models_used']
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/model-info')
def model_info_route():
    if not models:
        return jsonify({'success': False, 'error': 'Models not loaded'}), 500
    
    # Get feature information
    feature_info = {}
    if model_info and 'feature_names' in model_info:
        feature_info = {
            'feature_names': model_info['feature_names'],
            'feature_count': len(model_info['feature_names'])
        }
    elif preprocessing and 'feature_names' in preprocessing:
        feature_info = {
            'feature_names': preprocessing['feature_names'],
            'feature_count': len(preprocessing['feature_names'])
        }
    
    return jsonify({
        'success': True,
        'available_models': list(models.keys()),
        'model_count': len(models),
        'individual_rmse': model_info.get('individual_rmse', {}) if model_info else {},
        'individual_r2': model_info.get('individual_r2', {}) if model_info else {},
        'individual_mae': model_info.get('individual_mae', {}) if model_info else {},
        'ensemble_weights': ensemble_weights if ensemble_weights else {},
        'strategy': 'dynamic_weighted_ensemble',
        'feature_info': feature_info,
        'training_date': model_info.get('training_date') if model_info else None,
        'preprocessing_available': preprocessing is not None,
        'api_version': '2.0',
        'note': '2-model ensemble: XGBoost + Random Forest with equal weights (50%-50%)'
    })

@app.route('/api/train-models', methods=['POST'])
def train_models_endpoint():
    """Endpoint to trigger model training (if needed)"""
    try:
        # This could trigger the model training script
        return jsonify({
            'success': False,
            'message': 'Model training should be done offline. Run: python model_training.py',
            'instructions': [
                'Navigate to the backend-flask directory',
                'Run: python model_training.py',
                'Restart the Flask server to load new models'
            ]
        }), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/feature-info')
def feature_info():
    """Get information about expected input features"""
    
    if preprocessing and 'feature_names' in preprocessing:
        features = preprocessing['feature_names']
    elif model_info and 'feature_names' in model_info:
        features = model_info['feature_names'] 
    else:
        features = ['process_type', 'energy_consumption_kwh_per_ton', 
                   'ambient_temperature_c', 'humidity_percent']
    
    feature_descriptions = {
        'process_type': {
            'type': 'categorical',
            'description': 'Type of manufacturing process',
            'options': ['cement', 'steel', 'aluminum', 'plastic', 'glass'],
            'example': 'cement'
        },
        'energy_consumption_kwh_per_ton': {
            'type': 'numerical',
            'description': 'Energy consumption in kWh per ton of product',
            'range': [50, 500],
            'example': 150.5
        },
        'ambient_temperature_c': {
            'type': 'numerical', 
            'description': 'Ambient temperature in Celsius',
            'range': [15, 35],
            'example': 25.0
        },
        'humidity_percent': {
            'type': 'numerical',
            'description': 'Relative humidity percentage',
            'range': [30, 90],
            'example': 60.0
        },
        'equipment_age_years': {
            'type': 'numerical',
            'description': 'Age of equipment in years',
            'range': [1, 20],
            'example': 8.5
        },
        'production_rate_tons_per_hour': {
            'type': 'numerical',
            'description': 'Production rate in tons per hour',
            'range': [0.5, 5.0], 
            'example': 2.5
        },
        'renewable_energy_percent': {
            'type': 'numerical',
            'description': 'Percentage of energy from renewable sources',
            'range': [0, 100],
            'example': 30.0
        },
        'waste_recycling_percent': {
            'type': 'numerical',
            'description': 'Percentage of waste that is recycled',
            'range': [0, 100],
            'example': 75.0
        }
    }
    
    feature_info_list = []
    for feature in features:
        if feature in feature_descriptions:
            info = feature_descriptions[feature].copy()
            info['name'] = feature
            info['required'] = feature in ['process_type', 'energy_consumption_kwh_per_ton', 
                                         'ambient_temperature_c', 'humidity_percent']
            feature_info_list.append(info)
    
    return jsonify({
        'success': True,
        'features': feature_info_list,
        'required_features': ['process_type', 'energy_consumption_kwh_per_ton', 
                            'ambient_temperature_c', 'humidity_percent'],
        'optional_features': [f for f in features if f not in ['process_type', 'energy_consumption_kwh_per_ton', 'ambient_temperature_c', 'humidity_percent']],
        'prediction_target': 'carbon_footprint_kg_co2e_per_ton'
    })

@app.route('/api/tabnet-info')
def tabnet_info():
    """Get information about TabNet model specifically"""
    
    tabnet_in_models = models and 'TabNet' in models if models else False
    tabnet_performance = {}
    
    if model_info and 'TabNet' in model_info.get('individual_rmse', {}):
        tabnet_performance = {
            'rmse': model_info['individual_rmse']['TabNet'],
            'r2': model_info.get('individual_r2', {}).get('TabNet'),
            'mae': model_info.get('individual_mae', {}).get('TabNet')
        }
    
    return jsonify({
        'success': True,
        'tabnet_available': TABNET_AVAILABLE,
        'tabnet_loaded': tabnet_in_models,
        'model_type': 'Deep Learning - Attentive Interpretable Tabular Learning',
        'performance': tabnet_performance,
        'advantages': [
            'Automatic feature selection through attention mechanism',
            'High performance on tabular data',
            'Interpretable predictions with feature importance',
            'End-to-end deep learning approach'
        ],
        'ensemble_weight': ensemble_weights.get('TabNet', 0) if ensemble_weights and tabnet_in_models else 0,
        'pytorch_backend': True,
        'description': 'TabNet is a deep learning architecture specifically designed for tabular data, using sequential attention to select features at each decision step.'
    })

if __name__ == '__main__':
    print("🚀 Starting GreenLoop Flask API (Ensemble Model)...")
    if load_models():
        print("✅ Server ready on http://localhost:5000")
        print(f"🎯 Using 2-model ensemble: XGBoost (50%) + Random Forest (50%)")
        print(f"📊 Loaded models: {list(models.keys())}")
        print(f"⚖️ Active models: {len([name for name in models.keys() if name in ['XGBoost', 'Random Forest']])} models")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("❌ Failed to start - models not loaded")