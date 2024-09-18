import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { fetchData } from '../Api/apihandler';
import { config } from '../config';

const Productcategorypiechart = (props) => {
    const [productModalData, setProductModalData] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

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

        myChart.on('click', function (params) {
            const category = params.name;
            const categoryProducts = products.filter(product => product.name === category); // Adjust to match your API data structure
            setProductModalData(categoryProducts);
            setIsProductModalOpen(true);
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

            {/* Product Modal */}
            {/* {isProductModalOpen && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg" style={{ maxWidth: '90vw' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title text-primary m-auto">Product Details</h4>
                                <button type="button" className="close" onClick={() => setIsProductModalOpen(false)}>&times;</button>
                            </div>
                            <div className="modal-body" style={{ height: '540px', maxHeight: '70vh', overflow: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Brand Name</th>
                                            <th>Product Name</th>
                                            <th>Price</th>
                                            <th>Active</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {console.log(productModalData)}
                                        {productModalData.map((product, index) => (
                                            <tr key={index}>
                                                <td><img src={`${config.host}/productimages/${product.productimage}`} alt={product.productname} width="50" height="50" /></td>
                                                <td>{product.brandname}</td>
                                                <td>{product.productname}</td>
                                                <td>{product.productprice}</td>
                                                <td>{product.productactive ? 'Yes' : 'No'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => setIsProductModalOpen(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default Productcategorypiechart;
