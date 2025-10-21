import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaLeaf, 
  FaIndustry, 
  FaClock, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaBalanceScale,
  FaCogs,
  FaTrophy,
  FaRocket
} from 'react-icons/fa';

const countAnimation = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 50px rgba(16, 185, 129, 0.6); }
`;

const particleAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
`;

const ResultsContainer = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;

  h2 {
    color: var(--neutral-800);
    margin-bottom: 2rem;
    font-size: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    z-index: 1;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      border-radius: 2px;
    }
  }
`;

const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #10b981, #3b82f6);
  border-radius: 50%;
  animation: ${particleAnimation} 3s linear infinite;
  
  &:nth-child(1) { left: 10%; animation-delay: 0s; }
  &:nth-child(2) { left: 20%; animation-delay: 0.5s; }
  &:nth-child(3) { left: 30%; animation-delay: 1s; }
  &:nth-child(4) { left: 40%; animation-delay: 1.5s; }
  &:nth-child(5) { left: 50%; animation-delay: 2s; }
  &:nth-child(6) { left: 60%; animation-delay: 2.5s; }
`;

const ResultCard = styled(motion.div)`
  background: linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%);
  border: 3px solid #10b981;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${glowAnimation} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #10b981, #3b82f6, #10b981);
    border-radius: 20px;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    animation: ${countAnimation} 0.6s ease-out;
  }
`;

const MainResultValue = styled(motion.div)`
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    border-radius: 2px;
  }
`;

const ResultUnit = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--neutral-600);
  margin-left: 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`;

const ResultLabel = styled.div`
  font-size: 1.25rem;
  color: var(--neutral-700);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const SustainabilityBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  margin-top: 1rem;
  
  ${props => {
    if (props.level === 'excellent') return `
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    `;
    if (props.level === 'good') return `
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    `;
    if (props.level === 'moderate') return `
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    `;
    return `
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    `;
  }}
`;

const ModelResults = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const ModelCard = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.6);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
  }
  
  &:hover {
    border-color: #10b981;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ModelName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ModelBadge = styled.div`
  background: ${props => props.isPrimary ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #4b5563)'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ModelValue = styled(motion.div)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-green);
  margin: 0.5rem 0;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--neutral-200);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ConfidenceFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
`;

const InputSummary = styled.div`
  background: var(--neutral-50);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const InputTitle = styled.div`
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const InputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--neutral-200);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InputLabel = styled.span`
  font-size: 0.875rem;
  color: var(--neutral-600);
`;

const InputValue = styled.span`
  font-weight: 600;
  color: var(--neutral-800);
`;

const Timestamp = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: var(--neutral-500);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ResultsSection = ({ result }) => {
  const [countingComplete, setCountingComplete] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (result?.prediction) {
      setCountingComplete(false);
      setDisplayValue(0);
      
      const targetValue = result.prediction;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = targetValue / steps;
      
      let currentValue = 0;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        currentValue += increment;
        
        if (step >= steps || currentValue >= targetValue) {
          setDisplayValue(targetValue);
          setCountingComplete(true);
          clearInterval(timer);
        } else {
          setDisplayValue(currentValue);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [result]);

  if (!result) {
    return (
      <ResultsContainer
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaCogs style={{ color: '#10b981' }} />
          Prediction Center
        </motion.h2>
        
        <motion.div 
          style={{ 
            textAlign: 'center', 
            color: 'var(--neutral-500)', 
            padding: '4rem 0' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaRocket size={64} style={{ marginBottom: '2rem', opacity: 0.3, color: '#10b981' }} />
          </motion.div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Ready to Generate Carbon Emission Estimates
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.7 }}>
            Configure your industrial process parameters and generate GHG predictions
          </div>
        </motion.div>
      </ResultsContainer>
    );
  }

  const formatProcessType = (processType) => {
    return processType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSustainabilityLevel = (value) => {
    if (value < 30) return { level: 'excellent', icon: FaThumbsUp, text: 'Excellent Sustainability' };
    if (value < 50) return { level: 'good', icon: FaCheckCircle, text: 'Good Environmental Impact' };
    if (value < 80) return { level: 'moderate', icon: FaBalanceScale, text: 'Moderate Emissions' };
    return { level: 'high', icon: FaExclamationTriangle, text: 'High Carbon Impact' };
  };

  const sustainability = getSustainabilityLevel(result.prediction);
  const SustainabilityIcon = sustainability.icon;

  return (
    <ResultsContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Particles>
        {[...Array(6)].map((_, i) => (
          <Particle key={i} />
        ))}
      </Particles>

      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FaTrophy style={{ color: '#10b981' }} />
        AI Analysis Complete
      </motion.h2>

      <ResultCard
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      >
        <MainResultValue
          key={result.prediction}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {displayValue.toFixed(2)}
          <ResultUnit>{result.unit}</ResultUnit>
        </MainResultValue>
        
  <ResultLabel>AI-Generated Carbon Emission Prediction</ResultLabel>
        
        <SustainabilityBadge
          level={sustainability.level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <SustainabilityIcon />
          {sustainability.text}
        </SustainabilityBadge>
      </ResultCard>

      <ModelResults>
        {Object.entries(result.individual_predictions || {}).map(([modelName, value], index) => {
          const isPrimary = ['XGBoost', 'Random Forest'].includes(modelName);
          return (
            <ModelCard 
              key={modelName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)"
              }}
            >
                  <ModelHeader>
                    <ModelName>
                      <FaCogs style={{ color: '#10b981' }} />
                      {modelName}
                    </ModelName>
                    <ModelBadge isPrimary={isPrimary}>
                      {isPrimary ? 'Primary' : 'Support'}
                    </ModelBadge>
                  </ModelHeader>
              
              <ModelValue
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + index * 0.1, type: "spring" }}
              >
                {value.toFixed(2)}
              </ModelValue>
              
              <ConfidenceBar>
                <ConfidenceFill
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((100 - Math.abs(value - result.prediction) / result.prediction * 100), 100)}%` }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                />
              </ConfidenceBar>
              
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--neutral-500)', 
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                Accuracy: {Math.min((100 - Math.abs(value - result.prediction) / result.prediction * 100), 100).toFixed(1)}%
              </div>
            </ModelCard>
          );
        })}
      </ModelResults>

      <InputSummary>
        <InputTitle>
          <FaIndustry style={{ color: '#10b981' }} />
          Analysis Parameters
        </InputTitle>
        <InputGrid>
          <InputItem>
            <InputLabel>🏭 Process Type:</InputLabel>
            <InputValue>{formatProcessType(result.input_data?.process_type || 'N/A')}</InputValue>
          </InputItem>
          <InputItem>
            <InputLabel>⚡ Energy Consumption:</InputLabel>
            <InputValue>{result.input_data?.energy_consumption_kwh_per_ton || 'N/A'} kWh/ton</InputValue>
          </InputItem>
          <InputItem>
            <InputLabel>🌡️ Temperature:</InputLabel>
            <InputValue>{result.input_data?.ambient_temperature_c || 'N/A'}°C</InputValue>
          </InputItem>
          <InputItem>
            <InputLabel>💧 Humidity:</InputLabel>
            <InputValue>{result.input_data?.humidity_percent || 'N/A'}%</InputValue>
          </InputItem>
        </InputGrid>
        
        {result.timestamp && (
          <Timestamp>
            <FaClock />
            🕐 Predicted at: {formatTimestamp(result.timestamp)}
          </Timestamp>
        )}
      </InputSummary>
    </ResultsContainer>
  );
};

export default ResultsSection;