import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartProps {
  faturamento: number;
  empresa: string;
  faturamentoCompartilhado: any;
}

function parseValue(value: number): number {
  return Math.round(value);
}

function calculatePercentage(faturamento: number): number {
  return parseValue((faturamento / 3600000) * 100);
}

function calculatePercentage2(faturamentoCompartilhado: number): number {
  return parseValue((faturamentoCompartilhado / 4800000) * 100);
}


const formatarParaBRL = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

const SimpleChartComponent: React.FC<ChartProps> = ({
  faturamento,
  faturamentoCompartilhado,
  empresa,
}) => {
  const percentage = calculatePercentage(faturamento);
  const percentageShare = calculatePercentage2(faturamentoCompartilhado)
  console.log("oiiiiiiii", faturamentoCompartilhado)


  const options: ApexOptions = {
    series: [percentage, percentageShare],
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
    labels: ['Sublimite', 'Sublimite 2'],
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
      <h3 className='flex items-center justify-center font-sans'></h3>
      <span className='mr-2 font-sans'>Faturamento:</span>
      <span>{formatarParaBRL(faturamento)}</span>
      <h3 className='flex items-center justify-center font-sans'></h3>
      <span className='mr-2 font-sans'>Faturamento 2:</span>
      <span>{formatarParaBRL(faturamentoCompartilhado)}</span>
      </div>
  );
};

export default SimpleChartComponent;
