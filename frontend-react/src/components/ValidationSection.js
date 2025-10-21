import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFileCsv, FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ValidationContainer = styled.div`
  background: var(--neutral-50);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 2px dashed var(--neutral-300);

  h2 {
    color: var(--neutral-800);
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
    color: var(--neutral-600);
  }
`;

const FileUpload = styled(motion.div)`
  border: 2px dashed var(--neutral-300);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isDragOver ? 'rgba(16, 185, 129, 0.1)' : 'transparent'};
  border-color: ${props => props.isDragOver ? 'var(--primary-green)' : 'var(--neutral-300)'};

  &:hover {
    border-color: var(--primary-green);
    background: rgba(16, 185, 129, 0.05);
  }

  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.hasFile ? 'var(--primary-green)' : 'var(--neutral-400)'};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: 1rem;
  color: var(--neutral-700);
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: var(--neutral-500);
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
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-md);
  width: 100%;

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

const ValidationSection = ({ onValidate, loading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onValidate(selectedFile);
    } else {
      toast.error('Please select a CSV file first');
    }
  };

  return (
    <ValidationContainer>
      <h2>
        <FaFileCsv />
        Model Validation
      </h2>
      <p>
        Upload a CSV file with test data to validate the model performance
      </p>
      
      <form onSubmit={handleSubmit}>
        <FileUpload
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
          />
          <UploadIcon hasFile={selectedFile}>
            {selectedFile ? <FaFileCsv /> : <FaCloudUploadAlt />}
          </UploadIcon>
          {selectedFile ? (
            <>
              <UploadText>
                <strong>{selectedFile.name}</strong>
              </UploadText>
              <UploadSubtext>Click to change file</UploadSubtext>
            </>
          ) : (
            <>
              <UploadText>Drag & drop your CSV file here or click to browse</UploadText>
            </>
          )}
        </FileUpload>
        
        <Button
          type="submit"
          disabled={loading || !selectedFile}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <FaCheckCircle />
          Validate Model
        </Button>
      </form>
    </ValidationContainer>
  );
};

export default ValidationSection;
