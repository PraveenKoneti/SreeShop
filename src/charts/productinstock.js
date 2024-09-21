import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { fetchData } from '../Api/apihandler';
import { config } from '../config';

const Productinstock = () => {
  let inStockProducts = useRef([]);
  let [productcount, pickproductcount] = useState(0);
  let [instockcount, pickinstockcount] = useState(0);
  const chartRef = useRef(null); // Ref for chart DOM element

  // Function to initialize and update the gauge chart
  const instock = () => {
    const chartDom = chartRef.current; // Use ref for chart DOM
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const inStockText = productcount === 0 ? '0/0' : `${instockcount}/${productcount}`;

    const option = {
      title: {
        text: 'In Stock',
        top: '5%',
        left: 'center',
        textStyle: {
          color: 'green',
          fontSize: 25,
        },
      },
      legend: {
        data: ['In Stock'], // Ensure this matches the series name
        left: 'center',
        bottom: '2%',  // Position legend at the bottom
        itemWidth: 20,  // Increase item width for better readability
        itemHeight: 20, // Increase item height for better readability
        textStyle: {
          fontSize: 16,
          color: 'black' // Make the legend text red
        },
        formatter: (name) => {
          // Format legend text with the outOfStockText
          return `${name}: ${inStockText}`;
        },
        itemStyle: {
            color: 'green',  // Set the icon color to red
        }
      },
      series: [
        {
          name: 'In Stock',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          progress: {
            show: true,
            width: 25,
            itemStyle: {
              color: 'green',
            },
          },
          axisLine: {
            lineStyle: {
              width: 25,
              color: [[1, '#999']],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            formatter: () => inStockText, // Use function for formatter
            color: 'red',
            fontSize: 35,
            offsetCenter: [0, 0],
          },
          data: [
            {
              // Round the value to remove the dot by converting to an integer
              value: productcount === 0 ? 0 : Math.round((instockcount / productcount) * 100),
            },
          ],
        },
      ],
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

  const getinstockcount = async () => {
    await fetchData(`${config.instockcount}?id=${localStorage.getItem('sellerid')}`)
      .then((res) => {
        pickinstockcount(res.instockcount);
        pickproductcount(res.productcount);
      })
      .catch((error) => console.error('Error fetching stock count:', error));
  };

  useEffect(() => {
    getinstockcount();
  }, []);

  // Ensure the chart renders after state update
  useEffect(() => {
    instock();
  }, [productcount, instockcount]);

  if (inStockProducts.current.length > 0) return <Navigate to="/chartsdata" state={{ inStockProducts }} replace />;

  return (
    <div className="pb-3" style={{ width: '100%', height: 'auto' }}>
      <div id="main4" ref={chartRef} style={{ width: '100%', maxWidth: '600px', height: '400px', margin: '0 auto' }}></div>
    </div>
  );
};

export default Productinstock;
