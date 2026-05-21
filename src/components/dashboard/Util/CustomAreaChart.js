import { Box } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const CustomAreaChart = ({ 
  series, 
  categories, 
  colors, 
  id,
  legend = false,
  toolbar = false,
  height = 400,
}) => {

  const isDarkMode = useSelector((state) => state.colorMode.isDarkMode);
  const nonce = useSelector((state) => state.customNonce.nonce);



  const mainChart = {
    series: series,
    options: {
      chart: {
        id: `mainchart${id}`,
        type: 'area',
        height: height,
        toolbar: {
          show: toolbar,
          autoSelected: 'pan'
        },
        nonce: nonce
      },
      
      xaxis: {
        type: 'category',
        categories: categories,
        
        labels: {
          style: {
            colors: isDarkMode?'#FFFFFF':'#000000'  ,
            fontSize: '12px'
          }
        }
        
      },
      fill: {
        opacity: 1,
        type: 'gradient',
        colors: colors,
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode?'#FFFFFF':'#000000'  ,
            fontSize: '12px'
          }
        }
      },
      legend: {
        labels: {
            colors: isDarkMode?'#FFFFFF':'#000000',
            useSeriesColors: false
        },
        show: legend
    },
    },
  };


  return (
    <>
    <Box>
        <Chart
          options={mainChart.options}
          series={mainChart.series}
          type="area"
          height={height}
        />
      </Box>
    </>
  );
};

export default CustomAreaChart;