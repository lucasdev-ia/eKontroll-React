import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = () => {
  const chartContainer = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'],
            datasets: [{
              label: 'Vendas',
              data: [12500, 10000, 3000, 5000, 8000],
            }]
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed !== null) {
                      label += ' R$ ' + context.parsed.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    }
                    return label;
                  }
                }
              },
              legend: {
                position: 'left',
                labels: {
                  font: { size: 18 }
                },
              },
              title: {
                display: true,
                text: 'Total de Vendas por Produto',
                font: { size: 24 },
                padding: { bottom: 30 }
              }
            },
            responsive: false,
            maintainAspectRatio: true
          }
        });
      }
    }
  }, []);

  return (
    <div>
      <canvas ref={chartContainer} id="myChart"></canvas>
    </div>
  );
};

export default PieChart;