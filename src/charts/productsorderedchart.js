import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { fetchData } from '../Api/apihandler';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { config } from '../config';

const Productsorderedchart = () => {
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
    const progressValue = totalOrdersRef.current 
      ? ((ordersCountRef.current / totalOrdersRef.current) * 100).toFixed(1) 
      : 0;

    const option = {
      title: {
        text: 'Product Ordered',
        left: 'center',
        bottom:'2%',
        top: '5%',  // Position title at the top
        textStyle: {
          color: 'blue',
          fontSize: 25,
          fontWeight: 'bold'
        }
      },
      legend: {
        data: ['Current Orders'],
        orient: 'horizontal',  // Change orientation to horizontal
        left: 'center',
        bottom: '4%',  // Position legend at the bottom
        itemWidth: 20,  // Increase item width for better readability
        itemHeight: 20, // Increase item height for better readability
        textStyle: {
          fontSize: 16
        },
        formatter: (name) => {
          // Format legend with count information
          if (name === 'Current Orders') {
            return `${name}: ${ordersCountRef.current}/${totalOrdersRef.current}`;
          }
          return name;
        }
      },
      series: [
        {
          name: 'Current Orders',
          type: 'gauge',
          progress: {
            show: true,
            width: 18,
          },
          axisLine: {
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: '#999'
            }
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
              borderWidth: 5
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 24,  // Adjust font size as needed
            offsetCenter: [0, '70%'],
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
    try {
      const res = await fetchData(`${config.getorderproducts}?year=${year}&sellerid=${localStorage.getItem('sellerid')}`);
      
      // Ensure the API returns valid data, update state
      if (res && res.totalorders !== undefined && res.orderscount !== undefined) {
        totalOrdersRef.current = res.totalorders;
        ordersCountRef.current = res.orderscount;
        orderedchart(); // Update the chart with new data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getorderproducts();
  }, [year]);

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

      <div id="main5" ref={chartRef} style={{ width: '100%', height: '365px' }}></div>
    </div>
  );
};

export default Productsorderedchart;
