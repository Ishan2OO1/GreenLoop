import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaIndustry, FaBolt, FaThermometerHalf, FaTint, FaSpinner, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const pulseAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
`;

const FormContainer = styled(motion.div)`
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
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(16, 185, 129, 0.1),
      transparent
    );
    animation: ${shimmerAnimation} 3s ease-in-out infinite;
  }

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
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      border-radius: 2px;
    }
  }
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 2rem;
  position: relative;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--neutral-700);
  font-size: 0.95rem;
  gap: 0.5rem;
  text-transform: capitalize;
  letter-spacing: 0.02em;
`;

const InputContainer = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:focus-within::after {
    width: 100%;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--neutral-200);
  border-radius: 16px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--neutral-200);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  position: relative;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: var(--neutral-400);
    font-style: italic;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 
    0 10px 30px rgba(16, 185, 129, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 
      0 20px 40px rgba(16, 185, 129, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);
    animation: ${pulseAnimation} 2s ease-in-out infinite;
    
    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  animation: spin 1s linear infinite;
`;

const ProcessInfo = styled(motion.div)`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #10b981;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--neutral-700);
  position: relative;
  
  &::before {
    content: '💡';
    position: absolute;
    top: -8px;
    left: 16px;
    background: white;
    padding: 0 8px;
    font-size: 1rem;
  }
`;

const IconWrapper = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.875rem;
`;

const processOptions = [
  { value: 'melting', label: 'Melting Process' },
  { value: 'chemical', label: 'Chemical Processing' },
  { value: 'pyrolysis', label: 'Pyrolysis' },
  { value: 'separation', label: 'Separation Process' },
  { value: 'recycling', label: 'Recycling' },
  { value: 'shredding', label: 'Shredding' },
  { value: 'incineration', label: 'Incineration' },
  { value: 'composting', label: 'Composting' },
  { value: 'landfill', label: 'Landfill' },
  { value: 'production', label: 'Production' }
];

const processDescriptions = {
  'melting': 'Thermal process that converts solid materials to liquid state through heat application.',
  'chemical': 'Chemical transformation processes involving reactions using chemical agents.',
  'pyrolysis': 'Thermal decomposition process in the absence of oxygen.',
  'separation': 'Process of dividing mixed materials into different components.',
  'recycling': 'Process of converting waste materials into reusable materials.',
  'shredding': 'Mechanical size reduction process that breaks down materials.',
  'incineration': 'Controlled combustion process for waste disposal with energy recovery.',
  'composting': 'Biological decomposition process that converts organic waste.',
  'landfill': 'Waste disposal method involving burial in designated sites.',
  'production': 'General manufacturing and production processes.'
};

const PredictionForm = ({ formData, setFormData, onPredict, loading }) => {
  const [completedFields, setCompletedFields] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Mark field as completed when it has a value
    setCompletedFields(prev => ({
      ...prev,
      [field]: !!value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['process_type', 'energy_consumption_kwh_per_ton', 'ambient_temperature_c', 'humidity_percent'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all fields: ${missingFields.join(', ')}`);
      return;
    }

    onPredict(formData);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <FormContainer
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <IconWrapper
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <FaCalculator />
        </IconWrapper>
        Smart AI Emission Calculator
      </motion.h2>
      
      <motion.form 
        onSubmit={handleSubmit}
        variants={formVariants}
      >
        <FormGroup
          variants={fieldVariants}
        >
          <Label htmlFor="process_type">
            <IconWrapper>
              <FaIndustry />
            </IconWrapper>
            Industrial Process Type
            {completedFields.process_type && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ marginLeft: '0.5rem', color: '#10b981' }}
              >
                <FaCheckCircle />
              </motion.span>
            )}
          </Label>
          <InputContainer>
            <Select
              id="process_type"
              value={formData.process_type || ''}
              onChange={(e) => handleInputChange('process_type', e.target.value)}
              required
            >
              <option value="">🏭 Choose your industrial process...</option>
              {processOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </InputContainer>
          <AnimatePresence>
            {formData.process_type && processDescriptions[formData.process_type] && (
              <ProcessInfo
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {processDescriptions[formData.process_type]}
              </ProcessInfo>
            )}
          </AnimatePresence>
        </FormGroup>

        <FormGroup
          variants={fieldVariants}
        >
          <Label htmlFor="energy">
            <IconWrapper>
              <FaBolt />
            </IconWrapper>
            Energy Consumption (kWh/ton)
            {completedFields.energy_consumption_kwh_per_ton && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ marginLeft: '0.5rem', color: '#10b981' }}
              >
                <FaCheckCircle />
              </motion.span>
            )}
          </Label>
          <InputContainer>
            <Input
              type="number"
              id="energy"
              value={formData.energy_consumption_kwh_per_ton || ''}
              onChange={(e) => handleInputChange('energy_consumption_kwh_per_ton', e.target.value)}
              placeholder="⚡ Enter energy consumption (e.g., 150.5)"
              step="0.1"
              min="0"
              required
            />
          </InputContainer>
        </FormGroup>

        <FormGroup
          variants={fieldVariants}
        >
          <Label htmlFor="temperature">
            <IconWrapper>
              <FaThermometerHalf />
            </IconWrapper>
            Ambient Temperature (°C)
            {completedFields.ambient_temperature_c && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ marginLeft: '0.5rem', color: '#10b981' }}
              >
                <FaCheckCircle />
              </motion.span>
            )}
          </Label>
          <InputContainer>
            <Input
              type="number"
              id="temperature"
              value={formData.ambient_temperature_c || ''}
              onChange={(e) => handleInputChange('ambient_temperature_c', e.target.value)}
              placeholder="🌡️ Operating temperature (e.g., 25.0)"
              step="0.1"
              required
            />
          </InputContainer>
        </FormGroup>

        <FormGroup
          variants={fieldVariants}
        >
          <Label htmlFor="humidity">
            <IconWrapper>
              <FaTint />
            </IconWrapper>
            Humidity Level (%)
            {completedFields.humidity_percent && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ marginLeft: '0.5rem', color: '#10b981' }}
              >
                <FaCheckCircle />
              </motion.span>
            )}
          </Label>
          <InputContainer>
            <Input
              type="number"
              id="humidity"
              value={formData.humidity_percent || ''}
              onChange={(e) => handleInputChange('humidity_percent', e.target.value)}
              placeholder="💧 Humidity percentage (e.g., 60.0)"
              step="0.1"
              min="0"
              max="100"
              required
            />
          </InputContainer>
        </FormGroup>

        <motion.div
          variants={fieldVariants}
        >
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            animate={loading ? { 
              background: [
                'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                'linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)',
                'linear-gradient(135deg, #047857 0%, #10b981 50%, #059669 100%)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
          >
            {loading ? (
              <>
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                AI is analyzing...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Get AI Prediction
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </FormContainer>
  );
};

export default PredictionForm;