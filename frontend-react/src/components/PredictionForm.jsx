import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = ({ apiConnected }) => {
  const [formData, setFormData] = useState({
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiConnected) {
      setError('API is not connected. Please ensure the Flask server is running.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Convert form data to array of numbers for the ML model
      const features = [
        parseFloat(formData.feature1),
        parseFloat(formData.feature2),
        parseFloat(formData.feature3),
        parseFloat(formData.feature4)
      ];

      // Validate that all features are numbers
      if (features.some(isNaN)) {
        throw new Error('Please enter valid numbers for all features');
      }

      const response = await axios.post('http://localhost:5000/predict', {
        features: features
      });

      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      feature1: '',
      feature2: '',
      feature3: '',
      feature4: ''
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="prediction-form">
        <h2>Enter Features for Prediction</h2>
        
        <div className="form-group">
          <label htmlFor="feature1">Feature 1:</label>
          <input
            type="number"
            id="feature1"
            name="feature1"
            value={formData.feature1}
            onChange={handleInputChange}
            placeholder="Enter numeric value"
            step="any"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="feature2">Feature 2:</label>
          <input
            type="number"
            id="feature2"
            name="feature2"
            value={formData.feature2}
            onChange={handleInputChange}
            placeholder="Enter numeric value"
            step="any"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="feature3">Feature 3:</label>
          <input
            type="number"
            id="feature3"
            name="feature3"
            value={formData.feature3}
            onChange={handleInputChange}
            placeholder="Enter numeric value"
            step="any"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="feature4">Feature 4:</label>
          <input
            type="number"
            id="feature4"
            name="feature4"
            value={formData.feature4}
            onChange={handleInputChange}
            placeholder="Enter numeric value"
            step="any"
            required
          />
        </div>

        <button 
          type="submit" 
          className="predict-button"
          disabled={loading || !apiConnected}
        >
          {loading ? 'Making Prediction...' : 'Get Prediction'}
        </button>

        {(prediction || error) && (
          <button 
            type="button" 
            onClick={resetForm}
            style={{ 
              marginTop: '10px', 
              background: '#6c757d', 
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Form
          </button>
        )}
      </form>

      {loading && (
        <div className="loading">
          <p>🔮 Making prediction...</p>
        </div>
      )}

      {prediction && (
        <div className="result success">
          <h3>Prediction Result</h3>
          <p><strong>Predicted Value:</strong> {Array.isArray(prediction.prediction) ? prediction.prediction[0] : prediction.prediction}</p>
          <p><strong>Status:</strong> {prediction.status}</p>
        </div>
      )}

      {error && (
        <div className="result error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;