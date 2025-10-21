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
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const predictionService = {
  async predict(data) {
    try {
      console.log('Sending prediction request:', data);
      
      // Map the data to match our Flask API expectations
      const payload = {
        process_type: data.processType || data.process_type,
        energy_consumption_kwh_per_ton: parseFloat(data.energy || data.energy_consumption_kwh_per_ton),
        ambient_temperature_c: parseFloat(data.temperature || data.ambient_temperature_c),
        humidity_percent: parseFloat(data.humidity || data.humidity_percent)
      };

      const response = await api.post('/api/predict', payload);
      
      if (response.data.success) {
        return {
          prediction: response.data.prediction,
          individual_predictions: response.data.individual_predictions,
          unit: response.data.unit,
          timestamp: new Date().toISOString(),
          input_data: response.data.input_data
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

  async getStatus() {
    try {
      const response = await api.get('/api/status');
      return response.data;
    } catch (error) {
      console.error('Status error:', error);
      throw error;
    }
  }
};

export default api;