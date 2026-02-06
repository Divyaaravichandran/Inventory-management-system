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
  const [dealers, setDealers] = useState([]);
  const [dealerOrders, setDealerOrders] = useState([]);
  const [selectedDealerId, setSelectedDealerId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    fetchSales();
    fetchDealersAndOrders();
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

  const fetchDealersAndOrders = async () => {
    try {
      const [dealersRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dealers'),
        axios.get('http://localhost:5000/api/dealer-orders'),
      ]);
      setDealers(dealersRes.data || []);
      setDealerOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Failed to load dealer data:', error);
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

  const filteredOrdersForDealer = selectedDealerId
    ? dealerOrders.filter(
        (o) =>
          o.dealerId === selectedDealerId &&
          ['approved', 'dispatched', 'delivered'].includes(o.status)
      )
    : [];

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedDealerId || !selectedOrderId || !invoiceAmount) {
      toast.error('Please select dealer, order, and amount');
      return;
    }
    setInvoiceLoading(true);
    try {
      await axios.post('http://localhost:5000/api/invoices', {
        dealerId: selectedDealerId,
        orderId: selectedOrderId,
        amount: parseFloat(invoiceAmount),
        notes: invoiceNotes,
      });
      toast.success('Invoice created and sent to dealer');
      setSelectedDealerId('');
      setSelectedOrderId('');
      setInvoiceAmount('');
      setInvoiceNotes('');
      fetchDealersAndOrders();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create invoice';
      toast.error(message);
    } finally {
      setInvoiceLoading(false);
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

          {/* Right column: recent sales + dealer invoice */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Sales
              </h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
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
                  <p className="text-center text-gray-500 text-sm py-4">
                    No sales yet
                  </p>
                )}
              </div>
            </div>

            {/* Dealer Invoice creation */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiDollarSign className="mr-2" />
                Create Dealer Invoice
              </h2>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div>
                  <label className="label">Dealer</label>
                  <select
                    className="input-field"
                    value={selectedDealerId}
                    onChange={(e) => {
                      setSelectedDealerId(e.target.value);
                      setSelectedOrderId('');
                    }}
                  >
                    <option value="">Select Dealer</option>
                    {dealers
                      .filter((d) => d.status === 'active')
                      .map((dealer) => (
                        <option key={dealer._id} value={dealer.dealerId}>
                          {dealer.dealerName} ({dealer.dealerId})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="label">Dealer Order</label>
                  <select
                    className="input-field"
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    disabled={!selectedDealerId || filteredOrdersForDealer.length === 0}
                  >
                    <option value="">
                      {selectedDealerId
                        ? filteredOrdersForDealer.length > 0
                          ? 'Select Order'
                          : 'No approved orders'
                        : 'Select dealer first'}
                    </option>
                    {filteredOrdersForDealer.map((order) => (
                      <option key={order._id} value={order._id}>
                        {order.riceType} - {order.brand} | {order.quantityBags} x{' '}
                        {order.bagSize} ({order.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Invoice Amount (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="label">Notes</label>
                  <textarea
                    className="input-field"
                    rows="2"
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={invoiceLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {invoiceLoading ? 'Creating Invoice...' : 'Create Invoice'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiceSales;
