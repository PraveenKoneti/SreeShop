import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { fetchData } from '../Api/apihandler';
import { config } from '../config';

const Productinstock = () => {
  let inStockProducts = useRef([]);
  let [productcount, pickproductcount] = useState(0);
  let [instockcount, pickinstockcount] = useState(0);
  let [outofstockcount, pickoutofstockcount] = useState(0);
  const chartRef = useRef(null); // Ref for chart DOM element

  // Function to initialize and update the horizontal bar chart
  const renderBarChart = () => {
    const chartDom = chartRef.current; // Use ref for chart DOM
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const outOfStockCount = outofstockcount;
    const inStockCount = instockcount;

    const option = {
      title: {
        text: 'Product Stock Status',
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 25,
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: ['In Stock', 'Out of Stock'],
        bottom: '2%',
        left: 'center',
        textStyle: {
          fontSize: 14,
        },
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true, // Show the x-axis line
          lineStyle: {
            color: '#000', // Color of the x-axis line
            width: 2,      // Width of the x-axis line
          },
        },
      },
      yAxis: {
        type: 'category',
        data: ['In', 'Out'], // Updated labels for In Stock and Out of Stock
        axisLabel: {
          fontSize: 14, // Adjust font size for clarity
          margin: 10,   // Add margin to avoid overlap
        },
        axisLine: {
          show: true, // Show the y-axis line
          lineStyle: {
            color: '#000', // Color of the y-axis line
            width: 2,      // Width of the y-axis line
          },
        },
      },
      series: [
        {
          name: 'In Stock', // First series
          type: 'bar',
          data: [inStockCount, 0], // In Stock count only
          itemStyle: {
            color: 'green',
          },
          barWidth: '30%',
          label: {
            show: true,
            position: 'insideRight',
            formatter: '{c}', 
            fontSize: 16,
            color: '#fff',
          },
        },
        {
          name: 'Out of Stock', // Second series
          type: 'bar',
          data: [0, outOfStockCount], // Out of Stock count only
          itemStyle: {
            color: 'red',
          },
          barWidth: '30%',
          label: {
            show: true,
            position: 'insideRight',
            formatter: '{c}', 
            fontSize: 16,
            color: '#fff',
          },
        },
      ]
      
    };

    myChart.setOption(option);

    // Ensure the chart resizes when the window is resized
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove listeners and dispose of the chart
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  };

  const getoutofstock = async () => {
    await fetchData(`${config.outofstockcount}?id=${localStorage.getItem('sellerid')}`)
      .then((res) => {
        pickoutofstockcount(res.outofstockcount);
      })
      .catch((error) => console.error('Error fetching out of stock count:', error));
  };

  const getinstockcount = async () => {
    await fetchData(`${config.instockcount}?id=${localStorage.getItem('sellerid')}`)
      .then((res) => {
        pickinstockcount(res.instockcount);
        pickproductcount(res.productcount);
      })
      .catch((error) => console.error('Error fetching in stock count:', error));
  };

  useEffect(() => {
    getinstockcount();
    getoutofstock();
  }, []);

  // Ensure the chart renders after state update
  useEffect(() => {
    renderBarChart();
  }, [productcount, instockcount, outofstockcount]);

  return (
    <div className="pb-3" style={{ width: '100%', height: 'auto' }}>
      <div id="main4" ref={chartRef} style={{ width: '100%', maxWidth: '600px', height: '420px', margin: '0 auto' }}></div>
    </div>
  );
};

export default Productinstock;
