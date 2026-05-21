import { Box } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const CustomPieChart = ({ 
  series, 
  categories, 
  colors, 
  id,
  legend = false,
  height = 400,
  width = 380,
  type = 'donut',
  toolbar = false,
}) => {

  const isDarkMode = useSelector((state) => state.colorMode.isDarkMode);
  const nonce = useSelector((state) => state.customNonce.nonce);

  const mainChartPie ={
    series: series,
    options: {
      chart: {
        id: `mainchart${id}`,
        width: width,
        type: type,
        toolbar: {
          show: toolbar,
          autoSelected: 'pan'
        },
        nonce: nonce
      },
     
      dataLabels: {
        enabled: true,
        
      },
      fill: {
        type: 'gradient',
        colors: colors
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270
        }
      },
      
     legend: {
      position: 'bottom',
      labels: {
        colors: isDarkMode?'#FFFFFF':'#000000'  ,
      },
      show: legend
    },
      
      labels: categories,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom',
            
          }
        }
      }]
    },
}

  return (
    <>
      <Box>
        <Chart
          options={mainChartPie.options}
          series={mainChartPie.series}
          type={type}
          height={height}
        />
      </Box>
    </>
  );
};

export default CustomPieChart;
