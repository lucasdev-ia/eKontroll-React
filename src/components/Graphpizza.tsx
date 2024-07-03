import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RadialChart: React.FC = () => {
  const chartOptions: ApexOptions = {
    
          
            series: [44, 55],
            chart: {
              height: 350,
              type: 'radialBar',
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    fontSize: '22px',
                  },
                  value: {
                    fontSize: '16px',
                  },
                  total: {
                    show: true,
                    label: 'Eventos',
                    formatter: function (w) {
                      // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                      return ""
                    },
                  },
                },
              },
            },
            labels: ['EVENTO 379', 'EVENTO 380'],
          };

  return (
    <div className="radial-chart">
       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Empresa fulano de tal</h2>
      <ReactApexChart options={chartOptions} series={chartOptions.series} type="radialBar" height={350} />
    </div>
  );
};

export default RadialChart;