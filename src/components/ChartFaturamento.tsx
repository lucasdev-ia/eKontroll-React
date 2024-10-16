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

const SimpleChartComponent: React.FC<ChartProps> = ({
  faturamento,
  empresa,
}) => {
  const percentage = calculatePercentage(faturamento);

  const formatarParaBRL = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

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
    labels: ['Sublimite'],
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
      <h3 className="flex items-center justify-center font-sans"></h3>
      <span className="mr-2 font-bold">Faturamento:</span>
      <span>{formatarParaBRL(faturamento)}</span>
    </div>
  );
};

export default SimpleChartComponent;
