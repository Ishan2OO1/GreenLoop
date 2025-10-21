import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const predictionService = {
  async predict(data) {
    try {
      // Create form data that matches Flask app expectations
      const formData = new FormData();
      formData.append('process_type', data.process_type);
      formData.append('energy', data.energy);
      formData.append('temperature', data.temperature);
      formData.append('humidity', data.humidity);

      const response = await api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the Flask response format
      if (response.data.success) {
        return {
          prediction: response.data.value,
          predictionText: response.data.prediction,
          modelInfo: response.data.model_info,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.data.error || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to get prediction. Please try again.');
    }
  },

  async validate(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Now expecting JSON response with full validation data
      if (response.data.success) {
        // Return the full response data for detailed validation results
        return response.data;
      } else {
        throw new Error(response.data.error || 'Validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to validate model. Please try again.');
    }
  }
};

export default api;
