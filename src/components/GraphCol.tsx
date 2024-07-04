import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartComponent: React.FC = () => {
  const options = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#99C2A2', '#C5EDAC', '#66C7F4'],
    stroke: {
      width: [4, 4, 4, 4],
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
      },
    },
    xaxis: {
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    },
    yaxis: [
      {
        seriesName: 'Column A',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Columns',
        },
      },
      {
        seriesName: 'Column A',
        show: false,
      },
      {
        opposite: true,
        seriesName: 'Line C',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Line',
        },
      },
    ],
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  const series = [
    {
      name: 'Column A',
      type: 'column',
      data: [21.1, 23, 33.1, 34, 44.1, 44.9, 56.5, 58.5],
    },
    {
      name: 'Column B',
      type: 'column',
      data: [10, 19, 27, 26, 34, 35, 40, 38],
    },
    {
      name: 'Column C',
      type: 'column',
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ChartComponent;