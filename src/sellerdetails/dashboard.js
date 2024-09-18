import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Productcategorypiechart from '../charts/productcategorypiechart'; // Ensure correct path and export
import Orderbarchart from '../charts/orderbarchart'; // Ensure correct path and export
import Productsoutofstock from '../charts/productsoutofstock'; // Ensure correct path and export
import Productinstock from '../charts/productinstock'; // Ensure correct path and export
import Productsorderedchart from '../charts/productsorderedchart'; // Ensure correct path and export
import Ordercancelledchart from '../charts/productsordercancelled';
import { fetchData } from '../Api/apihandler'; // Ensure correct path and export
import { config } from '../config'; // Ensure correct path and export

const Mydashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  const getdate = () => {
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    setCurrentDate(date);
  };

  useEffect(() => {
    getdate();
  }, []);

  const getProducts = async() => {
    await fetchData(`${config.getsellerproduct}?sellerid=${localStorage.getItem("sellerid")}`)
    .then(data => setProducts(data))
    .catch(err => console.error('Error fetching products:', err));
  };

  const getOrders = async () => {
    try {
      const response = await fetchData(`${config.getsellerorders}?sellerid=${localStorage.getItem("sellerid")}`);
      const data = response;
      const sortedOrders = data.sort((a, b) => moment(b.date, 'MMMM Do YYYY, h:mm:ss a').valueOf() - moment(a.date, 'MMMM Do YYYY, h:mm:ss a').valueOf());
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => { getProducts(); getOrders(); }, []);

  return (
    <div className="container-fluid p-3 mt-4">
      <div className="row">
        <div className="col-12 text-center mb-4">
          <h1 className="text-primary">Seller Dashboard</h1>
        </div>

        <div className="col-md-6 text-center mb-4 d-flex align-items-center justify-content-center">
          <div className="shadow-lg p-3 bg-white rounded">
            <i className="fa fa-database fa-4x text-info mb-2"></i>
            <h3>Items in Stock: {products.length}</h3>
          </div>
        </div>

        <div className="col-md-6 text-center mb-4 d-flex align-items-center justify-content-center">
          <div className="shadow-lg p-3 bg-white rounded">
            <i className="fa fa-headset fa-4x text-warning mb-2"></i>
            <h3>Orders Received: {orders.length}</h3>
          </div>
        </div>

        <hr className="w-100" />
      </div>

      {/* Chart Section */}
      <div className="row mt-3">
        <div className="col-12 col-lg-6 mb-4">
          <div className="shadow-lg rounded p-2">
            <Productcategorypiechart />
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-4">
          <div className="shadow-lg rounded p-2">
            <Orderbarchart />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className="shadow-lg rounded p-2">
            <Productsoutofstock />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className="shadow-lg rounded p-2">
            <Productinstock  />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className="shadow-lg rounded p-2">
            <Productsorderedchart  />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className="shadow-lg rounded p-2">
            <Ordercancelledchart  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mydashboard;
