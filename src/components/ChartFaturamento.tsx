import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartProps {
  faturamento: number;
  empresa: string;
}

function parseValue(value: number): number {
  return Math.round(value);
}

function calculatePercentage(faturamento: number): number {
  return parseValue((faturamento / 3600000) * 100);
}

const SimpleChartComponent: React.FC<ChartProps> = ({ faturamento, empresa }) => {
  const percentage = calculatePercentage(faturamento);

  const options: ApexOptions = {
    series: [percentage],
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        track: {
          background: '#f2f2f2',
          strokeWidth: '80%',
          opacity: 0.5,
          margin: 2,
          dropShadow: {
            enabled: true,
            blur: 7,
            opacity: 0.5,
          },
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            show: true,
          },
          value: {
            fontSize: '16px',
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    labels: ['Faturamento'],
    colors: ['#271b79'],
  };

  return (
    <div>
      <h2 className="text-center">{empresa}</h2>
      <ReactApexChart
        options={options}
        series={options.series}
        type="radialBar"
        height={350}
      />
    </div>
  );
};

export default SimpleChartComponent;