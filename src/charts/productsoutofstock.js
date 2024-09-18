import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { fetchData } from '../Api/apihandler';
import { config } from '../config';

const Productsoutofstock = () => {
  const chartInstance = useRef(null); // Reference to the chart instance

  const renderOutOfStockChart = (productcount, outofstockcount) => {
    const chartDom = document.getElementById('main3');
    if (!chartDom) return; // Ensure chartDom is defined

    // Initialize the chart if it's not already initialized
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartDom);
    }

    const myChart = chartInstance.current;

    // Handle division by zero
    const outOfStockText = productcount === 0 ? '0/0' : `${outofstockcount}/${productcount}`;

    const option = {
      title: {
        text: 'Out Of Stock',
        left: 'center',
        top:'5%',
        textStyle: {
          color: 'red',
          fontSize: 25,
        },
      },
      legend: {
        data: ['Out Of Stock'], // Ensure this matches the series name
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
          return `${name}: ${outOfStockText}`;
        },
        itemStyle: {
            color: 'red',  // Set the icon color to red
        }
      },
      series: [
        {
          name: 'Out Of Stock', // Ensure this matches the legend data
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          progress: {
            show: true,
            width: 25,
            itemStyle: {
              color: 'red',
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
            formatter: function () {
              return outOfStockText;
            },
            color: 'red',
            fontSize: 35,
            offsetCenter: [0, 0],
          },
          data: [
            {
              value: productcount === 0 ? 0 : (outofstockcount / productcount) * 100,
            },
          ],
        },
      ],
    };

    // Set the chart options
    myChart.setOption(option);

    // Ensure the chart resizes when the window is resized
    const handleResize = () => {
      if (myChart) {
        myChart.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove listeners and dispose of the chart
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null; // Clear the reference after disposing
      }
    };
  };

  const getOutOfStockCount = async () => {
    try {
      const res = await fetchData(`${config.outofstockcount}?id=${localStorage.getItem('sellerid')}`);
      renderOutOfStockChart(res.productcount, res.outofstockcount);
    } catch (error) {
      console.error('Error fetching out of stock count:', error);
    }
  };

  useEffect(() => {
    getOutOfStockCount();

    // Cleanup function when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return (
    <div className='pb-3'>
      <div id="main3" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default Productsoutofstock;
