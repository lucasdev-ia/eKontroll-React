import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import '../css/satoshi.css'

const total = 250;
const valor1 = 200;
const valor2 = 140;
const nomeEmpresa = "Empresa nome para teste"
function valueToPercent (value1, value2) {
  return [Math.round((value1 * 100) / total),Math.round((value2 * 100) / total)]
} 
const ChartEvento379e380: React.FC = () => {
  const chartOptions: ApexOptions = {
    series: valueToPercent(valor1, valor2),

    chart: {
      height: 350,
      type: "radialBar",
    },

    plotOptions: {
      radialBar: {
        track: {
          show: true,
          startAngle: undefined,
          endAngle: undefined,
          background: "#f2f2f2",
          strokeWidth: "80%",
          opacity: 0.5,
          margin: 2,
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 7,
            opacity: 0.5,
          },
        },

        dataLabels: {
          name: {
            fontSize: "14px",
          },
          value: {
            fontSize: "16px",
          },

          total: {
            show: true,
            label: "Eventos",
            fontSize: "14px",
            fontFamily: "IMPACT",
            fontWeight: 600,

            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return "";
            },
          },
        },
      },
    },
    labels: ["EVENTO 379", "EVENTO 380"],
    colors: ["#271b79", "#FD5201"],
  };

  return (
    <div className="">
      <h2 className="mt-5 text-center">{nomeEmpresa}</h2>
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="radialBar"
        height={350}
      />
      <h3 className="flex items-center justify-center font-satoshi">
        <p className="mr-2 font-bold">380</p> Faltam: R$:1000,00
      </h3>
      <h4 className="flex items-center justify-center font-satoshi">
        <p className="mr-2 font-bold">379</p> Faltam: R$:1000,00
      </h4>
    </div>
  );
};

export default ChartEvento379e380;