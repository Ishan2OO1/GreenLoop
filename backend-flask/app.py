from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store the loaded model
model = None

def load_model():
    """Load the ML model from the model directory"""
    global model
    model_path = os.path.join('model', 'model.pkl')
    
    if os.path.exists(model_path):
        try:
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None
    else:
        print(f"Model file not found at {model_path}")
        model = None

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "Flask API is running",
        "model_loaded": model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                "error": "Model not loaded. Please ensure model.pkl exists in the model/ directory"
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Extract features from the request
        # Modify this based on your specific model's expected input format
        features = data.get('features', [])
        
        if not features:
            return jsonify({"error": "No features provided"}), 400
        
        # Convert to numpy array for prediction
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features_array)
        
        # Return prediction result
        return jsonify({
            "prediction": prediction.tolist(),
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route('/model-info')
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({"error": "No model loaded"}), 404
    
    model_info = {
        "model_type": type(model).__name__,
        "model_loaded": True
    }
    
    # Try to get additional model information if available
    try:
        if hasattr(model, 'feature_names_in_'):
            model_info['feature_names'] = model.feature_names_in_.tolist()
        if hasattr(model, 'n_features_in_'):
            model_info['n_features'] = model.n_features_in_
    except:
        pass
    
    return jsonify(model_info)

if __name__ == '__main__':
    # Load the model when the application starts
    load_model()
    
    # Run the Flask development server
    app.run(debug=True, host='localhost', port=5000)