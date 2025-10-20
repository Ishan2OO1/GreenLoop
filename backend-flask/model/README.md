# Model Directory

This directory contains the pre-trained machine learning model.

## Files:
- `model.pkl` or `model.joblib` - The saved, trained ML model
- Place your trained model file here before running the Flask application

## Usage:
The Flask app will automatically load the model from this directory when it starts.

## Supported Formats:
- Pickle files (.pkl)
- Joblib files (.joblib)

## Example:
```python
# To save a model here:
import pickle
# ... train your model ...
with open('model/model.pkl', 'wb') as f:
    pickle.dump(trained_model, f)
```