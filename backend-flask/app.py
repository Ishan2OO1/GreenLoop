from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import warnings

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Global variables
models = None
preprocessing = None
model_info = None

def load_models():
    """Load ensemble model and preprocessing components"""
    global models, preprocessing, model_info
    try:
        print("🚀 Loading Ensemble Model...")
        
        # Load safe ensemble models (without TabNet DLL issues)
        models = joblib.load("model/ensemble_safe.pkl")
        
        # Try to load preprocessing and model_info from the same directory
        try:
            preprocessing = joblib.load("model/preprocessing.pkl")
            print("✅ Loaded preprocessing.pkl")
        except:
            print("⚠️ preprocessing.pkl not found, will use basic preprocessing")
            preprocessing = None
            
        try:
            model_info = joblib.load("model/model_info_safe.pkl")
            print("✅ Loaded model_info_safe.pkl")
        except:
            print("⚠️ model_info_safe.pkl not found, using default info")
            model_info = {
                'individual_rmse': {
                    'XGBoost': 21.55,
                    'Random Forest': 30.16
                }
            }
        
        print(f"✅ Loaded ensemble models: {list(models.keys())}")
        if model_info and 'individual_rmse' in model_info:
            print(f"🎯 RMSE scores:")
            for name, score in model_info['individual_rmse'].items():
                if name in models:
                    print(f"   {name}: {score:.4f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

def predict_ensemble(data):
    """Make prediction using the loaded ensemble models"""
    try:
        # Prepare input data
        input_df = pd.DataFrame([data])
        
        # Apply preprocessing if available
        if preprocessing and 'standard_preprocessor' in preprocessing:
            # Add index column if needed
            if 'Unnamed: 0' not in input_df.columns:
                input_df['Unnamed: 0'] = 0
            X_processed = preprocessing['standard_preprocessor'].transform(input_df)
        else:
            # Basic preprocessing without full pipeline
            print("⚠️ Using basic preprocessing")
            
            # Simple categorical encoding for process_type
            process_type_map = {
                'cement': 0,
                'steel': 1, 
                'aluminum': 2,
                'plastic': 3,
                'glass': 4
            }
            
            # Convert process_type to numeric if it's a string
            if 'process_type' in input_df.columns:
                process_val = input_df['process_type'].iloc[0]
                if isinstance(process_val, str):
                    process_val = process_val.lower()
                    if process_val in process_type_map:
                        input_df.loc[0, 'process_type'] = process_type_map[process_val]
                    else:
                        print(f"⚠️ Unknown process type '{process_val}', using default (0)")
                        input_df.loc[0, 'process_type'] = 0
                else:
                    # Already numeric, ensure it's an integer
                    input_df.loc[0, 'process_type'] = int(float(process_val))
            
            # Ensure we have the expected columns in correct order
            expected_cols = ['process_type', 'energy_consumption_kwh_per_ton', 'ambient_temperature_c', 'humidity_percent']
            
            # Add missing columns with defaults
            for col in expected_cols:
                if col not in input_df.columns:
                    print(f"Warning: Missing column {col}, using default value")
                    input_df[col] = 0.0
            
            # Convert all columns to proper numeric types
            for col in expected_cols:
                input_df[col] = pd.to_numeric(input_df[col], errors='coerce').fillna(0.0)
            
            # Add Unnamed: 0 column (seems to be needed based on original error)
            input_df['Unnamed: 0'] = 0
            
            # Reorder columns to match training
            column_order = ['Unnamed: 0'] + expected_cols
            input_df = input_df[column_order]
            
            # Convert to float64 numpy array
            X_processed = input_df.astype('float64').values
            print(f"✅ Processed data shape: {X_processed.shape}, dtype: {X_processed.dtype}")
        
        # Get predictions from available models
        predictions = {}
        for model_name, model in models.items():
            try:
                pred = float(model.predict(X_processed)[0])
                predictions[model_name] = pred
                print(f"✅ {model_name} prediction: {pred:.2f}")
            except Exception as e:
                print(f"❌ Error with {model_name}: {e}")
                continue
        
        if not predictions:
            raise Exception("No models could make predictions")
        
        # Calculate weighted ensemble based on model performance
        # XGBoost gets highest weight, Random Forest medium, others lower
        weights = {}
        total_weight = 0
        
        for model_name in predictions.keys():
            if 'XGBoost' in model_name:
                weights[model_name] = 0.5
            elif 'Random Forest' in model_name:
                weights[model_name] = 0.3
            else:
                weights[model_name] = 0.2
            total_weight += weights[model_name]
        
        # Normalize weights
        for model_name in weights:
            weights[model_name] = weights[model_name] / total_weight
        
        # Calculate ensemble prediction
        ensemble_pred = sum(predictions[name] * weights[name] for name in predictions.keys())
        
        return {
            'ensemble_prediction': round(float(ensemble_pred), 2),
            'individual_predictions': predictions,
            'weights_used': weights,
            'strategy': 'weighted_ensemble',
            'models_used': list(predictions.keys())
        }
        
    except Exception as e:
        raise Exception(f"Prediction failed: {str(e)}")

@app.route('/api/status')
def status():
    return jsonify({
        'status': 'running',
        'models_loaded': models is not None,
        'available_models': list(models.keys()) if models else [],
        'model_count': len(models) if models else 0,
        'strategy': 'ensemble_top3',
        'preprocessing_loaded': preprocessing is not None,
        'individual_rmse': model_info.get('individual_rmse', {}) if model_info else {}
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if not models:
            return jsonify({'success': False, 'error': 'Models not loaded'}), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Required fields
        required = ['process_type', 'energy_consumption_kwh_per_ton', 'ambient_temperature_c', 'humidity_percent']
        missing = [field for field in required if field not in data]
        if missing:
            return jsonify({'success': False, 'error': f'Missing fields: {missing}'}), 400
        
        # Get prediction
        result = predict_ensemble(data)
        
        return jsonify({
            'success': True,
            'prediction': result['ensemble_prediction'],
            'individual_predictions': result['individual_predictions'],
            'weights_used': result['weights_used'],
            'strategy': result['strategy'],
            'unit': 'kg CO2e per ton',
            'input_data': data,
            'model_count': len(result['individual_predictions'])
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/model-info')
def model_info_route():
    if not models:
        return jsonify({'success': False, 'error': 'Models not loaded'}), 500
    
    return jsonify({
        'success': True,
        'available_models': list(models.keys()),
        'model_count': len(models),
        'individual_rmse': model_info.get('individual_rmse', {}) if model_info else {},
        'strategy': 'weighted_ensemble_top3',
        'default_weights': {
            'XGBoost': 0.5,
            'Random Forest': 0.3, 
            'Others': 0.2
        },
        'note': 'Using ensemble of top performing models with dynamic weighting',
        'preprocessing_available': preprocessing is not None
    })

if __name__ == '__main__':
    print("🚀 Starting GreenLoop Flask API (Ensemble Model)...")
    if load_models():
        print("✅ Server ready on http://127.0.0.1:5000")
        print(f"🎯 Using ensemble of {len(models)} models with dynamic weighting")
        print(f"📊 Available models: {list(models.keys())}")
        app.run(host='127.0.0.1', port=5000, debug=True)
    else:
        print("❌ Failed to start - models not loaded")