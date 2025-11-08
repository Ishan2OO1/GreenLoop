import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaCogs, 
  FaDatabase, 
  FaChartLine, 
  FaPaperPlane, 
  FaLeaf,
  FaTrophy,
  FaGlobe
} from 'react-icons/fa';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.4); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const StatsWrapper = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(16, 185, 129, 0.05),
      transparent
    );
    pointer-events: none;
  }

  h3 {
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
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      border-radius: 2px;
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.6);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #10b981, #3b82f6)'};
  }
  
  &:hover {
    border-color: #10b981;
    transform: translateY(-8px);
    animation: ${pulseGlow} 2s ease-in-out infinite;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 1s; }
  &:nth-child(3) { animation-delay: 2s; }
  &:nth-child(4) { animation-delay: 3s; }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.gradient || 'linear-gradient(135deg, #10b981, #059669)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
`;

const StatValue = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${props => props.gradient || 'linear-gradient(135deg, #10b981, #059669)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  position: relative;
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: var(--neutral-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: var(--neutral-500);
  line-height: 1.5;
  font-style: italic;
`;

const StatsGrid = ({ modelCount = 2, modelNames = [] }) => {
  const [animatedValues, setAnimatedValues] = useState({
    models: 0,
    dataPoints: 0,
    predictions: 0
  });

  useEffect(() => {
    const targets = {
      models: modelCount,
      dataPoints: 242, // From your training data
      predictions: 1000
    };

    const duration = 2000;
    const steps = 60;
    
    Object.keys(targets).forEach(key => {
      const increment = targets[key] / steps;
      let currentValue = 0;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        currentValue += increment;
        
        if (step >= steps || currentValue >= targets[key]) {
          setAnimatedValues(prev => ({ ...prev, [key]: targets[key] }));
          clearInterval(timer);
        } else {
          setAnimatedValues(prev => ({ ...prev, [key]: currentValue }));
        }
      }, duration / steps);
    });
  }, [modelCount]);

    const stats = [
    { 
      icon: FaCogs,
      value: Math.round(animatedValues.models),
      label: 'AI Models Active',
      description: 'Advanced ML ensemble for predictions',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    { 
      icon: FaChartLine,
      value: 'Advanced',
      label: 'AI Ensemble Method',
      description: 'Dynamic weighted predictions',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    { 
      icon: FaDatabase,
      value: Math.round(animatedValues.dataPoints),
      label: 'Training Data Points',
      description: '28 features across 12 process types',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
      { 
      icon: FaPaperPlane,
      value: `${Math.round(animatedValues.predictions)}+`,
      label: 'AI Predictions Generated',
      description: 'Intelligent real-time emission forecasts',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ];

  return (
    <StatsWrapper
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FaTrophy style={{ color: '#10b981' }} />
        AI Platform Analytics
      </motion.h3>
      
      <StatsContainer>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <StatCard
              key={index}
              gradient={stat.gradient}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1, type: "spring" }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)"
              }}
            >
              <IconWrapper gradient={stat.gradient}>
                <IconComponent />
              </IconWrapper>
              
              <StatValue 
                gradient={stat.gradient}
                key={stat.value}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
              >
                {stat.value}
              </StatValue>
              
              <StatLabel>{stat.label}</StatLabel>
              <StatDescription>{stat.description}</StatDescription>
            </StatCard>
          );
        })}
      </StatsContainer>
    </StatsWrapper>
  );
};

export default StatsGrid;
