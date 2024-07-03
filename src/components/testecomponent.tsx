import React from 'react';
import { useColorModeteste } from '../hooks/ColorModeContext';

const AnotherComponent: React.FC = () => {
  const { colorMode } = useColorModeteste();

  return (
    <div>
      <h1>Current Mode: {colorMode}</h1>
    </div>
  );
};

export default AnotherComponent;