import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


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

    
    const media1 = (Number(data[1][1]) + Number(data[1][2]) + Number(data[1][3])) / 3;
    const media2 = (Number(data[2][1]) + Number(data[2][2]) + Number(data[2][3])) / 3;
    const media3 = (Number(data[3][1]) + Number(data[3][2]) + Number(data[3][3])) / 3;
    const media4 = (Number(data[4][1]) + Number(data[4][2]) + Number(data[4][3])) / 3;
    const media5 = (Number(data[5][1]) + Number(data[5][2]) + Number(data[5][3])) / 3;
    data[1].push(media1)
    data[2].push(media2)
    data[3].push(media3)
    data[4].push(media4)
    data[5].push(media5)
    
    const options = {
        title: '',
        
        hAxis: { title: 'Ano 2024' },
        seriesType: 'bars',
        series: { 3: { type: 'line' } },
        
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
