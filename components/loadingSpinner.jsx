// components/LoadingSpinner.js
import React from 'react';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const SpinnerWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.8)',
  zIndex: 9999,
});

const LoadingSpinner = () => {
  return (
    <SpinnerWrapper>
      <CircularProgress />
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
