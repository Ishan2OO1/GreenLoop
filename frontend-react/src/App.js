import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultsSection from './components/ResultsSection';
import StatsGrid from './components/StatsGrid';
import { predictionService } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
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
  padding: 0;
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const StatusIndicator = styled(motion.div)`
  background: ${props => props.connected 
    ? 'linear-gradient(135deg, #10B981, #059669)' 
    : 'linear-gradient(135deg, #EF4444, #DC2626)'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  box-shadow: ${props => props.connected 
    ? '0 8px 25px rgba(16, 185, 129, 0.3)' 
    : '0 8px 25px rgba(239, 68, 68, 0.3)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  
  &:before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
    animation: ${props => props.connected ? 'pulse 2s ease-in-out infinite' : 'none'};
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
  }
`;

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [formData, setFormData] = useState({
    process_type: '',
    energy_consumption_kwh_per_ton: '',
    ambient_temperature_c: '',
    humidity_percent: ''
  });

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await predictionService.getStatus();
        setApiStatus(status);
        if (status.models_loaded) {
          toast.success('AI models loaded successfully!');
        }
      } catch (error) {
        console.error('API status check failed:', error);
        toast.error('Failed to connect to AI prediction server');
      }
    };

    checkApiStatus();
  }, []);

  const handlePrediction = async (data) => {
    setLoading(true);
    try {
      console.log('Submitting prediction data:', data);
      const result = await predictionService.predict(data);
      console.log('Prediction result:', result);
      setPrediction(result);
      toast.success(`AI analysis complete: ${result.prediction} ${result.unit}`);
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(`AI prediction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AppContainer>
      <Container>
        <Header />
        
        {/* API Status */}
        {apiStatus && (
          <StatusIndicator 
            connected={apiStatus.models_loaded}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            {apiStatus.models_loaded 
              ? `✅ ${apiStatus.model_count || 2} AI Models Ready • ${apiStatus.strategy || 'Ensemble'} Method Active`
              : '🔄 Models Loading...'
            }
          </StatusIndicator>
        )}
        
        <MainContent>
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
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
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResultsSection result={prediction} />
          </Card>
        </MainContent>

        {/* Statistics Grid */}
        {apiStatus && (
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StatsGrid 
              modelCount={apiStatus.available_models?.length || 0}
              modelNames={apiStatus.available_models || []}
            />
          </Card>
        )}
      </Container>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </AppContainer>
  );
}

export default App;