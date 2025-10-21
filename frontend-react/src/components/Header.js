import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaLeaf, FaChartLine, FaRocket, FaGlobe } from 'react-icons/fa';

const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  color: white;
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.2);
  animation: ${floatingAnimation} 3s ease-in-out infinite;
  
  &:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 60%; right: 15%; animation-delay: 1s; }
  &:nth-child(3) { top: 40%; left: 80%; animation-delay: 2s; }
  &:nth-child(4) { bottom: 20%; left: 20%; animation-delay: 1.5s; }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 50%, #ffffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${glowAnimation} 2s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0 4px 8px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    gap: 0.5rem;
  }
`;

const LogoIcon = styled(motion.div)`
  font-size: 4rem;
  color: #10b981;
  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

const FeatureTags = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const FeatureTag = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <BackgroundElements>
        <FloatingIcon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <FaLeaf />
        </FloatingIcon>
        <FloatingIcon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <FaChartLine />
        </FloatingIcon>
        <FloatingIcon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <FaRocket />
        </FloatingIcon>
        <FloatingIcon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <FaGlobe />
        </FloatingIcon>
      </BackgroundElements>

      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <LogoIcon
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <FaLeaf />
        </LogoIcon>
        GreenLoop AI
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        Intelligent Carbon Emission Prediction Platform
        <br />
        <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>
          Powered by advanced machine learning to predict environmental impact with precision
        </span>
      </Subtitle>

      <FeatureTags
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <FeatureTag
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChartLine />
          AI-Powered Modeling
        </FeatureTag>
        <FeatureTag
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaLeaf />
          Smart Sustainability
        </FeatureTag>
        <FeatureTag
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRocket />
          Instant AI Predictions
        </FeatureTag>
        <FeatureTag
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGlobe />
          Intelligent Analytics
        </FeatureTag>
      </FeatureTags>
    </HeaderContainer>
  );
};

export default Header;
