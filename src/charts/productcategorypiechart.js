import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { fetchData } from '../Api/apihandler';
import { config } from '../config';

const Productcategorypiechart = (props) => {

    // Function to initialize and update the pie chart
    const setupPieChart = (products = []) => {
        if (!products || products.length === 0) {
            console.warn('No product data available to render the pie chart.');
            return;
        }

        const chartDom = document.getElementById('main1');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);

        const categoryData = products.reduce((acc, product) => {
            const category = product.name;  // Adjusted to match your API response key 'name'
            acc[category] = (acc[category] || 0) + product.value; // Using 'value' for counts
            return acc;
        }, {});

        const chartData = Object.keys(categoryData).map(category => ({
            name: category,
            value: categoryData[category]
        }));

        const option = {
            title: {
                text: 'Product Categories',
                subtext: 'Based on current stock',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',  
                bottom: 'bottom',       
                textStyle: {
                    fontSize: 14,     
                },
            },
            series: [
                {
                    name: 'Products',
                    type: 'pie',
                    radius: '50%',
                    data: chartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {d}%', 
                        position: 'outside',
                    }
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', () => {
            myChart.resize();
        });
    };

    const getpiechartdata = async() => {
        const res = await fetchData(`${config.getpiechartdata}?sellerid=${localStorage.getItem('sellerid')}`);
        setupPieChart(res); // Make sure data is passed correctly
    }

    useEffect(() => {
        getpiechartdata(); // Initialize chart with initial data
        return () => {
            window.removeEventListener('resize', () => {}); 
        };
    }, []); 

    return (
        <div className='pt-4'>
            <div id="main1" style={{ width: '100%', height: '410px', maxWidth: '100%' }}></div>
        </div>
    );
}

export default Productcategorypiechart;
