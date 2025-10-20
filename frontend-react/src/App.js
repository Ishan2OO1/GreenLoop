import React, { useState, useEffect } from 'react';
import PredictionForm from './components/PredictionForm';
import axios from 'axios';

function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Check if the Flask API is running
    const checkApiStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/');
        if (response.data.status) {
          setApiStatus('connected');
        }
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Machine Learning Prediction App</h1>
        <p>Enter your data below to get a prediction from our trained model</p>
        
        {apiStatus === 'checking' && (
          <div style={{ color: '#ffc107' }}>
            ⏳ Checking API connection...
          </div>
        )}
        
        {apiStatus === 'connected' && (
          <div style={{ color: '#28a745' }}>
            ✅ Connected to Flask API
          </div>
        )}
        
        {apiStatus === 'disconnected' && (
          <div style={{ color: '#dc3545' }}>
            ❌ Cannot connect to Flask API. Make sure it's running on http://localhost:5000
          </div>
        )}
      </header>

      <main>
        <PredictionForm apiConnected={apiStatus === 'connected'} />
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
        <p>College ML Project - React + Flask Architecture</p>
      </footer>
    </div>
  );
}

export default App;