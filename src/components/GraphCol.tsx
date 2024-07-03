import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import '../css/satoshi.css'
import useColorMode from "../hooks/useColorMode";
import { useColorModeteste } from '../hooks/ColorModeContext';

const ComboChart: React.FC = () => {
  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    const data = [
      ['Month', '2022', '2023', '2024','MÉDIA'],
      ['Funcionário 1', 165, 938, 522],
      ['Funcionário 2', 135, 1120, 599],
      ['Funcionário 3', 157, 1167, 587],
      ['Funcionário 4', 139, 1110, 615],
      ['Funcionário 5', 136, 691, 629]
    ];

    
    for (let i = 1; i <= 5; i++) {
      const media = (Number(data[i][1]) + Number(data[i][2]) + Number(data[i][3])) / 3;
      data[i].push(media);
    }
    
    
    const options = {
        title: '',
        fontName: "Satoshi",
        backgroundColor: "none",
        hAxis: { 
          title: 'Ano 2024',
          
        },
        seriesType: 'bars',
        series: { 3: { type: 'line' } },
        animation: {
          startup: true,  // Habilita a animação de inicialização
          duration: 1000, // Duração da animação em milissegundos (opcional)
          easing: 'out',  // Tipo de easing da animação (opcional)
        },
       
      };
      
    return (
      <Chart 
        width={'600px'}
        height={'300px'}
        chartType="ComboChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={options}
      />
    );
  };
    return <div>{drawChart()}</div>;
};

export default ComboChart;
