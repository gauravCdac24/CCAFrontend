import { Box } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const CustomBarChart = ({ 
  series, 
  categories, 
  colors, 
  id,
  legend = false,
  horizontal = false,
  toolbar = false,
  stacked = false,
  height = 400,
  rotateAlways = false,
  rotationDegree = 0,
  zoomEnabled = false,
  distributed = false,
  filltype = "gradient",
  columnWidth = '70%'
}) => {

  const isDarkMode = useSelector((state) => state.colorMode.isDarkMode);
  const nonce = useSelector((state) => state.customNonce.nonce);

  const mainChartBar = {
    series: series,
    options: {
      chart: {
        id: `mainchart${id}`,
        type: 'bar',
        height: height,
        stacked: stacked,
        toolbar: {
          show: toolbar,
          autoSelected: 'pan'
        },
        zoom: {
          enabled: zoomEnabled,
        },
        nonce: nonce,
      },

      plotOptions: {
        bar: {
          horizontal: horizontal,
          distributed: distributed,
          columnWidth: columnWidth,
        },
      },
      xaxis: {
        type: 'category',
        categories: categories,
        labels: {
          style: {
            colors: isDarkMode ? '#FFFFFF' : '#000000',
            fontSize: '12px',
          },
          rotate: rotationDegree, 
          rotateAlways: rotateAlways, 
        },
      },
      legend: {
        position: 'bottom',
        offsetY: 10,
        show: legend,
      },
      fill: {
        opacity: 1,
        type: filltype,
        colors: colors,
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode ? '#FFFFFF' : '#000000',
            fontSize: '12px',
          },
        },
      },
    },
  };

  return (
    <>
      <Box>
        <Chart
          options={mainChartBar.options}
          series={mainChartBar.series}
          type="bar"
          height={height}
        />
      </Box>
    </>
  );
};

export default CustomBarChart;
