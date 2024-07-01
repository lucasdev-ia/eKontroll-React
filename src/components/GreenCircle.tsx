import React from 'react';

const BolinhaPiscando = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-4 h-4 bg-green-500 rounded-full animate-piscar"></div>
    </div>
  );
};

export default BolinhaPiscando;