import styled from 'styled-components';
import React from 'react'
const MiniLoader = () => {
  return (
    <LoaderWrapper>
      <LoadingIndicator />
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingIndicator = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #f0f0f0; /* Light grey */
  border-bottom-color: #3498db; /* Muted blue */
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default MiniLoader;
