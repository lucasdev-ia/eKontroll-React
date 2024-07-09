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
              color: '#3F83F8', 
              fontSize: '20px',
              fontFamily: 'Arial, sans-serif',
            },
          }
        }
      }
    },
    legend: {
    position: 'top',
    fontSize: '19 px',
      labels: {
        colors: ['#3F83F8'],  
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
