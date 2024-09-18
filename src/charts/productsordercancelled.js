import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { fetchData } from '../Api/apihandler';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { config } from '../config';

const Ordercancelledchart = (props) => {
  const chartRef = useRef(null); // Ref for the chart DOM element
  const chartInstance = useRef(null); // Ref for the chart instance
  const [year, pickYear] = useState(moment().year());

  // Ref for storing fetched orders data
  const totalOrdersRef = useRef(100);  // Default to 100 for progress calculation
  const ordersCountRef = useRef(0);  // Default 0, will be updated

  const orderedchart = () => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartDom);
    }

    const myChart = chartInstance.current;

    // Calculate the progress value with one decimal place
    const progressValue = totalOrdersRef.current && ordersCountRef.current 
      ? ((ordersCountRef.current / totalOrdersRef.current) * 100).toFixed(1) 
      : 0;

    const option = {
      title: {
        text: 'Product Cancelled',
        left: 'center',
        bottom:'2%',
        top: '5%',  // Position title at the top
        textStyle: {
          color: 'red',
          fontSize: 25,
          fontWeight: 'bold'
        }
      },
      legend: {
        data: ['Current Cancelled'],
        orient: 'horizontal',  // Change orientation to horizontal
        left: 'center',
        bottom: '4%',  // Position legend at the bottom
        itemWidth: 20,  // Increase item width for better readability
        itemHeight: 20, // Increase item height for better readability
        textStyle: {
          fontSize: 16,
          color: 'black' // Make the legend text black
        },
        formatter: (name) => {
          if (name === 'Current Cancelled') {
            return `${name}: ${ordersCountRef.current}/${totalOrdersRef.current}`;
          }
          return name;
        },
        itemStyle: {
          color: 'red',  // Set the icon color to red
        }
      },
      series: [
        {
          name: 'Current Cancelled',
          type: 'gauge',
          progress: {
            show: true,
            width: 18,
            itemStyle: {
              color: 'red' // Set the progress bar color to red
            }
          },
          axisLine: {
            lineStyle: {
              width: 18,
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: 'black', // Split line color black
            },
          },
          axisLabel: {
            distance: 25,
            color: 'black', 
            fontSize: 12
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 5,
              borderColor: 'red',  // Border color red
            },
          },
          pointer: { // Add this section to style the pointer
            length: '60%', // Length of the pointer
            width: 6, // Width of the pointer
            color: 'red', // Pointer color
            itemStyle: {
                color: 'red', // Pointer color red
            },
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 24,  // Adjust font size as needed
            offsetCenter: [0, '70%'],
            color: 'black', // Detail value color set to red
            formatter: (value) => `${value}%`
          },
          data: [
            {
              value: parseFloat(progressValue), // Use the formatted progress value
            }
          ]
        }
      ],
    };

    myChart.setOption(option);

    // Resize chart on window resize
    const resizeChart = () => {
      if (myChart) {
        myChart.resize();
      }
    };

    window.addEventListener('resize', resizeChart);

    // Cleanup function to remove listeners and dispose of the chart
    return () => {
      window.removeEventListener('resize', resizeChart);
      if (myChart) {
        myChart.dispose();
      }
    };
  };

  const getorderproducts = async () => {
    const res = await fetchData(`${config.getcancelledproducts}?year=${year}&sellerid=${localStorage.getItem('sellerid')}`);
    totalOrdersRef.current = res.totalorders;
    ordersCountRef.current = res.cancelledcount;
    orderedchart(); // Update the chart with new data
  };

  useEffect(() => {
    getorderproducts();
  }, [year]);

  useEffect(() => {
    // Apply red color to the calendar icon
    const icon = document.querySelector('.p-calendar .p-calendar-header .p-calendar-icon');
    if (icon) {
      icon.style.color = 'red'; // Apply red color to the icon
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render

  const handleDateChange = (e) => {
    pickYear(e.value.getFullYear()); // Extract the year from the Date object
  };

  return (
    <div className='pt-3'>
      <div className='text-center'>
        <Calendar
          value={moment(year, 'YYYY').toDate()}
          onChange={handleDateChange}
          view="year"
          dateFormat="yy"
          showIcon
          placeholder="Select a year"
          style={{ width: '250px', height: '35px', fontSize: '0.8rem' }}
        />
      </div>

      <div id="main6" ref={chartRef} style={{ width: '100%', height: '365px' }}></div>
    </div>
  );
};

export default Ordercancelledchart;
