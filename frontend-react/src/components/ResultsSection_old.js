import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChartLine, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const ResultsContainer = styled.div`
  h2 {
    color: var(--neutral-800);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ResultCard = styled(motion.div)`
  background: var(--neutral-100);
  border: 2px solid var(--neutral-300);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const ValidationCard = styled(motion.div)`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid var(--primary-green);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ResultValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-green);
  margin-bottom: 0.5rem;
`;

const ResultLabel = styled.div`
  font-size: 1.125rem;
  color: var(--neutral-600);
  margin-bottom: 1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-sm);
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-green);
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MappingInfo = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
`;

const MappingTitle = styled.div`
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MappingList = styled.div`
  font-size: 0.875rem;
  color: var(--neutral-600);
  
  div {
    margin-bottom: 0.25rem;
  }
`;

const ResultsSection = ({ prediction }) => {
  // Check if prediction is a validation result (has metrics object)
  const isValidation = prediction && typeof prediction === 'object' && prediction.metrics;
  
  if (isValidation) {
    const { metrics, feature_mapping, target_column, validation } = prediction;
    
    return (
      <ResultsContainer>
        <h2>
          <FaCheckCircle />
          Validation Results
        </h2>
        
        <ValidationCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MetricsGrid>
            <MetricCard>
              <MetricValue>{metrics.r2.toFixed(3)}</MetricValue>
              <MetricLabel>R² Score</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{metrics.rmse.toFixed(2)}</MetricValue>
              <MetricLabel>RMSE</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{metrics.mae.toFixed(2)}</MetricValue>
              <MetricLabel>MAE</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{metrics.samples}</MetricValue>
              <MetricLabel>Samples</MetricLabel>
            </MetricCard>
          </MetricsGrid>
          
          <MappingInfo>
            <MappingTitle>
              <FaMapMarkerAlt />
              Feature Mapping
            </MappingTitle>
            <MappingList>
              {Object.entries(feature_mapping).map(([expected, actual]) => (
                <div key={expected}>
                  <strong>{expected}:</strong> {actual}
                </div>
              ))}
              <div>
                <strong>Target Column:</strong> {target_column}
              </div>
            </MappingList>
          </MappingInfo>
        </ValidationCard>
      </ResultsContainer>
    );
  }
  
  return (
    <ResultsContainer>
      <h2>
        <FaChartLine />
        Prediction Results
      </h2>
      
      <ResultCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ResultValue>
          {prediction ? `${prediction.prediction.toFixed(2)} kg CO₂e/ton` : "-- --"}
        </ResultValue>
        
        <ResultLabel>
          {prediction ? 'GHG Emissions Prediction' : 'Enter parameters to get prediction'}
        </ResultLabel>
        
        {prediction && prediction.modelInfo && (
          <MappingInfo>
            <MappingTitle>
              <FaCheckCircle />
              Model Information
            </MappingTitle>
            <MappingList>
              <div><strong>Model:</strong> {prediction.modelInfo}</div>
              <div><strong>Prediction Text:</strong> {prediction.predictionText}</div>
              <div><strong>Timestamp:</strong> {new Date(prediction.timestamp).toLocaleString()}</div>
            </MappingList>
          </MappingInfo>
        )}
      </ResultCard>
    </ResultsContainer>
  );
};

export default ResultsSection;