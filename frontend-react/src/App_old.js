import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultsSection from './components/ResultsSection';
import ValidationSection from './components/ValidationSection';
import StatsGrid from './components/StatsGrid';
import ProcessChart from './components/ProcessChart';
import { predictionService } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    process_type: '',
    energy: 250,
    temperature: 25,
    humidity: 50
  });

  const handlePrediction = async (data) => {
    setLoading(true);
    try {
      const result = await predictionService.predict(data);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (file) => {
    setLoading(true);
    try {
      const result = await predictionService.validate(file);
      setPrediction(result);
      toast.success('Model validation completed successfully!');
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(`Validation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Container>
        <Header />
        
        <MainContent>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PredictionForm
              formData={formData}
              setFormData={setFormData}
              onPredict={handlePrediction}
              loading={loading}
            />
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ResultsSection prediction={prediction} />
            <ProcessChart />
          </Card>
        </MainContent>

        <ValidationSection onValidate={handleValidation} loading={loading} />
        <StatsGrid />
      </Container>
    </AppContainer>
  );
}

export default App;
