import { Box } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const CustomAreaBrushChart = ({ 
  series, 
  categories, 
  colors, 
  id,
  legend = false,
  height = 130,
}) => {

  const isDarkMode = useSelector((state) => state.colorMode.isDarkMode);
  const nonce = useSelector((state) => state.customNonce.nonce);


  const brushChart = {
    series: series,
    options: {
      chart: {
        id: `brushchart${id}`,
        type: 'area',
        height: height,
        brush:{
          target: `mainchart${id}`,
          enabled: true
        },
        selection: {
          enabled: true,
          xaxis: {
            min: 0,
            max: categories.length-1
          }
        },
        nonce: nonce
      },
      colors: colors,
      xaxis: {
        type: 'category',
        categories: categories,
        tooltip: {
          enabled: false
        }        
      },
    
      fill: {
        opacity: 1,
        type: 'gradient',
        
      },
      yaxis: {
        labels: {
          style: {
            colors: isDarkMode?'#FFFFFF':'#000000'  ,
            fontSize: '12px'
          }
        },
        tickAmount: 2
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
          options={brushChart.options}
          series={brushChart.series}
          type="area"
          height={height}
        />
      </Box>
    </>
  );
};

export default CustomAreaBrushChart;