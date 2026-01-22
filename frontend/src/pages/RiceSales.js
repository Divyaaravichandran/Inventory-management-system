import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiDollarSign } from 'react-icons/fi';

const RiceSales = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    customerAddress: '',
    riceType: '',
    quantity: '',
    rate: '',
    vehicleNumber: '',
    driverName: '',
    destination: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    setTotalAmount(qty * rate);
  }, [formData.quantity, formData.rate]);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(response.data);
    } catch (error) {
      toast.error('Failed to load sales');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/sales', {
        ...formData,
        quantity: parseFloat(formData.quantity),
        rate: parseFloat(formData.rate),
      });
      toast.success('Sale recorded successfully!');
      setFormData({
        customerName: '',
        customerContact: '',
        customerAddress: '',
        riceType: '',
        quantity: '',
        rate: '',
        vehicleNumber: '',
        driverName: '',
        destination: '',
      });
      setTotalAmount(0);
      fetchSales();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to record sale';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Rice Sales Entry</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FiShoppingCart className="mr-2" />
                New Sale Entry
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Customer Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Contact Number *</label>
                      <input
                        type="text"
                        name="customerContact"
                        value={formData.customerContact}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Address</label>
                      <textarea
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleChange}
                        className="input-field"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>

                {/* Rice Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Rice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Rice Type *</label>
                      <select
                        name="riceType"
                        value={formData.riceType}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Rice Type</option>
                        <option value="Basmati">Basmati</option>
                        <option value="Sona Masoori">Sona Masoori</option>
                        <option value="Jasmine">Jasmine</option>
                        <option value="Brown Rice">Brown Rice</option>
                        <option value="Parboiled">Parboiled</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Quantity (kg) *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="input-field"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Rate (₹/kg) *</label>
                      <input
                        type="number"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        className="input-field"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Total Amount</label>
                      <div className="input-field bg-primary-50 border-primary-200 text-primary-700 font-bold text-lg">
                        ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispatch Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Dispatch Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Vehicle Number</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Driver Name</label>
                      <input
                        type="text"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Destination</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Recording Sale...' : 'Record Sale'}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Sales */}
          <div>
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sales.slice(0, 10).map((sale) => (
                  <div key={sale._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {sale.customerName}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {sale.riceType} - {sale.quantity} kg
                    </div>
                    <div className="text-sm font-bold text-primary-700 mt-1">
                      ₹{sale.totalAmount?.toLocaleString()}
                    </div>
                  </div>
                ))}
                {sales.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">No sales yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiceSales;
