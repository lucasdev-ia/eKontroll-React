import React from "react";
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import '../css/satoshi.css';

const LucroChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    series: [41, 41],
    labels: ['Contas a Pagar', 'Contas a Receber'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 500
        },
        legend: {
          position: 'bottom'
        },
      }
    }],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              color: '#ffffff', 
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
            },
          }
        }
      }
    },
    legend: {
      labels: {
        colors: ['#ffffff'],  
        useSeriesColors:true 
      }
    }
  };

  const series = [30, 60];

  return (
    <div className="lucro-chart">
      <ReactApexChart options={options} series={series} type="donut" />
    </div>
  );
};

export default LucroChart;
