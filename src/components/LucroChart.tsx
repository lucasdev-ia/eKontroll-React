import React from "react";
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import '../css/satoshi.css';

const LucroChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    series: [41, 41],
    labels: ['Contas a Pagar', 'Contas a Receber'],
    colors: ['#271b79', '#FD5201'],
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
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      labels: {
        colors: ['#FFFFFF',]
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      },
      y: {
        formatter: function(val) {
          return `R$ ${val}`;
        }
      }
    }
  };
  const series = [2000, 3000];

  return (
    <div className="lucro-chart">
      <ReactApexChart options={options} series={series} type="donut" />
      <div className="flex space-x-5 mt-0 ">
          <p className="font-bold mr-0">Contas a receber: R$3000,00</p><br />
          <p className="font-bold mr-0">Contas a pagar: R$2000,00</p><br />
      </div>
    </div>
  );
};

export default LucroChart;
