import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { fetchData } from '../Api/apihandler';
import { config } from '../config';

const Orderbarchart = () => {
  const [orderModalData, setOrderModalData] = useState([]);
  const [year, pickYear] = useState(moment().year());

  // Setup the bar chart data and options
  const setupBarChart = (orders) => {
    const chartData = {
      labels: moment.monthsShort(),
      datasets: [
        {
          label: 'Ordered',
          data: orders.map(item => item.ordered),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Cancelled',
          data: orders.map(item => item.cancelled),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    return {
      data: chartData,
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Allow the chart to resize flexibly
        scales: {
          x: {
            grid: {
              display: false // Hide vertical grid lines
            }
          },
          y: {
            grid: {
              display: true, // Keep horizontal grid lines
              color: 'rgba(0,0,0,0.1)' // Customize the color if needed
            },
            ticks: {
              beginAtZero: true
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + context.raw;
              }
            }
          }
        }
      }
    };
  };

  // Fetch data from the API
  const getBarChartData = async () => {
    let res = await fetchData(`${config.getorderedcancelledproductsdata}?year=${year}&sellerid=${localStorage.getItem('sellerid')}`);
    setOrderModalData(res); // Set the fetched data
  };

  useEffect(() => {
    getBarChartData();
  }, [year]); 

  const { data: chartData, options: chartOptions } = setupBarChart(orderModalData);

  // Handle calendar date change
  const handleDateChange = (e) => {
    pickYear(e.value.getFullYear()); // Extract the year from the Date object
  };

  return (
    <div style={{ padding: '16px' }}>
      <div className='text-end'>
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

      <div style={{ height: '360px', marginTop: '8px' }}>
        <Chart type="bar" data={chartData} options={chartOptions} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default Orderbarchart;
