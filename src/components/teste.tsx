import React from 'react';
import { ColorModeProvider } from '../hooks/ColorModeContext.tsx';
import DarkModeSwitcher from './DarkModeSwitcher';
import AnotherComponent from './testecomponent';
import { useColorModeteste } from '../hooks/ColorModeContext';
const Testedodark: React.FC = () => {
  const teste = useColorModeteste();
    console.log(teste)
    return (
        
      <ColorModeProvider>
        <DarkModeSwitcher />
        <AnotherComponent/>
      </ColorModeProvider>
      
    );
  };
  
  export default Testedodark;