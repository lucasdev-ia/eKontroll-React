import { title } from 'process';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { text } from 'stream/consumers';
import ValidarDarkMode from './ValidarDarkMode';

interface MedidasDoPieChart{
  valoratual: number;
  valormaximo: number;

}

const MyChart: React.FC<MedidasDoPieChart> = ({ valoratual, valormaximo }) => {
  const [data, setData] = useState([
    ['Task', 'Value'],
    ['Completed', valoratual],
    ['Remaining', valormaximo - valoratual],
    
  ]);
  let teste = "dark"
  

useEffect(() => {
  setData([
    ['Task', 'Value'],
    ['Gastos', valoratual],
    ['Faltam', valormaximo - valoratual],
  ]);
}, [valoratual, valormaximo]);

  const options = {
    pieHole: 0.3,
    backgroundColor: (teste == "dark" ? "" : "white"),
    legend: {
      position: 'none', 
      textStyle: {color: 'black', fontSize: 16},
      alignment: '',
      
    },
    
    slices: {
      0: { color: 'red' },
      1: { color: 'blue' },
      
    

    },
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        width="190px"
        height="180px"
        
        data={data}
        options={options}
      />
      <p className='text-center'>Nome da empresa</p>
    </div>
  );
};



export default MyChart;