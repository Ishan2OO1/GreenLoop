import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalculator, FaIndustry, FaBolt, FaThermometerHalf, FaTint, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const FormContainer = styled.div`
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--neutral-700);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--neutral-400);
`;

const RangeSlider = styled.div`
  margin-top: 0.5rem;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--neutral-200);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-green);
    cursor: pointer;
    box-shadow: var(--shadow-md);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-green);
    cursor: pointer;
    border: none;
    box-shadow: var(--shadow-md);
  }
`;

const RangeValue = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 600;
  color: var(--primary-green);
`;

const ProcessInfo = styled.div`
  background: var(--neutral-50);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--neutral-600);
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-md);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const processDescriptions = {
  'shredding': 'Mechanical size reduction process that breaks down materials into smaller pieces, commonly used in waste management and recycling.',
  'pyrolysis': 'Thermal decomposition process in the absence of oxygen, used for converting organic materials into useful products like bio-oil and char.',
  'chemical': 'Chemical transformation processes involving reactions, treatments, or modifications using chemical agents for material processing.',
  'melting': 'Thermal process that converts solid materials to liquid state through heat application, used in metal processing and material recovery.',
  'recycling': 'Process of converting waste materials into reusable materials, reducing the need for raw material extraction.',
  'separation': 'Process of dividing mixed materials into different components based on physical or chemical properties.',
  'pv_production': 'Manufacturing process for photovoltaic solar panels, involving silicon processing and module assembly.',
  'composting': 'Biological decomposition process that converts organic waste into nutrient-rich soil amendment.',
  'incineration': 'Controlled combustion process for waste disposal with energy recovery, reducing waste volume by 80-90%.',
  'landfill': 'Waste disposal method involving burial in designated sites with environmental protection measures.',
  'plastic_recovery_processing': 'Specialized process for recovering and processing plastic materials from waste streams.',
  'glass_recovery': 'Process of collecting and processing waste glass for reuse in new glass products.',
  'metal_recovery': 'Process of extracting and purifying metals from waste materials for reuse in manufacturing.',
  'production': 'General manufacturing and production processes for various industrial products.',
  'pv_module_recycling': 'Specialized recycling process for end-of-life photovoltaic solar panels.',
  'pv_module_treatment': 'Treatment and processing of photovoltaic modules for material recovery.',
  'csi_pv_recycling': 'Crystalline silicon photovoltaic module recycling process.',
  'csi_pv_treatment': 'Treatment process specifically for crystalline silicon PV modules.',
  'cdte_pv_recycling': 'Cadmium telluride photovoltaic module recycling process.',
  'cdte_pv_treatment': 'Treatment process for cadmium telluride PV modules.'
};

const PredictionForm = ({ formData, setFormData, onPredict, loading }) => {
  const [selectedProcess, setSelectedProcess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProcessChange = (process) => {
    setSelectedProcess(process);
    handleInputChange('process_type', process);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.process_type) {
      toast.error('Please select a process type');
      return;
    }
    onPredict(formData);
  };

  return (
    <FormContainer>
      <h2>
        <FaCalculator />
        Emission Prediction
      </h2>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="process_type">Process Type</Label>
          <InputWrapper>
            <Select
              id="process_type"
              value={formData.process_type}
              onChange={(e) => handleProcessChange(e.target.value)}
              required
            >
              <option value="">Select Process Type</option>
              {/* Most common process types from our trained model */}
              <option value="shredding">Shredding</option>
              <option value="pyrolysis">Pyrolysis</option>
              <option value="chemical">Chemical Processing</option>
              <option value="melting">Melting</option>
              <option value="recycling">Recycling</option>
              <option value="separation">Separation</option>
              <option value="pv_production">PV Module Production</option>
              <option value="composting">Composting</option>
              <option value="incineration">Incineration</option>
              <option value="landfill">Landfill</option>
              <option value="plastic_recovery_processing">Plastic Recovery Processing</option>
              <option value="glass_recovery">Glass Recovery</option>
              <option value="metal_recovery">Metal Recovery</option>
              <option value="production">Production</option>
              <option value="pv_module_recycling">PV Module Recycling</option>
              <option value="pv_module_treatment">PV Module Treatment</option>
              <option value="csi_pv_recycling">CSI PV Recycling</option>
              <option value="csi_pv_treatment">CSI PV Treatment</option>
              <option value="cdte_pv_recycling">CdTe PV Recycling</option>
              <option value="cdte_pv_treatment">CdTe PV Treatment</option>
            </Select>
            <InputIcon>
              <FaIndustry />
            </InputIcon>
          </InputWrapper>
          {selectedProcess && processDescriptions[selectedProcess] && (
            <ProcessInfo>
              <strong>Process Description:</strong> {processDescriptions[selectedProcess]}
            </ProcessInfo>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="energy">Energy Consumption (kWh/ton)</Label>
          <InputWrapper>
            <Input
              type="number"
              step="0.1"
              id="energy"
              value={formData.energy}
              onChange={(e) => handleInputChange('energy', parseFloat(e.target.value))}
              required
              min="0"
              max="1000"
            />
            <InputIcon>
              <FaBolt />
            </InputIcon>
          </InputWrapper>
          <RangeSlider>
            <RangeInput
              type="range"
              min="0"
              max="1000"
              step="1"
              value={formData.energy}
              onChange={(e) => handleInputChange('energy', parseFloat(e.target.value))}
            />
            <RangeValue>{formData.energy} kWh/ton</RangeValue>
          </RangeSlider>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <InputWrapper>
            <Input
              type="number"
              step="0.1"
              id="temperature"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
              required
              min="-50"
              max="100"
            />
            <InputIcon>
              <FaThermometerHalf />
            </InputIcon>
          </InputWrapper>
          <RangeSlider>
            <RangeInput
              type="range"
              min="-50"
              max="100"
              step="1"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
            />
            <RangeValue>{formData.temperature}°C</RangeValue>
          </RangeSlider>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="humidity">Humidity (%)</Label>
          <InputWrapper>
            <Input
              type="number"
              step="0.1"
              id="humidity"
              value={formData.humidity}
              onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
              required
              min="0"
              max="100"
            />
            <InputIcon>
              <FaTint />
            </InputIcon>
          </InputWrapper>
          <RangeSlider>
            <RangeInput
              type="range"
              min="0"
              max="100"
              step="1"
              value={formData.humidity}
              onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
            />
            <RangeValue>{formData.humidity}%</RangeValue>
          </RangeSlider>
        </FormGroup>

        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Analyzing...
            </>
          ) : (
            'Predict Emissions'
          )}
        </Button>
      </form>
    </FormContainer>
  );
};

export default PredictionForm;
