import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCheckCircle, FiAlertCircle, FiXCircle, FiPlus } from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const Payments = () => {
  const [summary, setSummary] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [sales, setSales] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    referenceNumber: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
    fetchLedger();
    fetchSales();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/summary');
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to load payment summary');
    }
  };

  const fetchLedger = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/ledger');
      setLedger(response.data);
    } catch (error) {
      toast.error('Failed to load ledger');
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(response.data.filter((s) => s.paymentStatus !== 'paid'));
    } catch (error) {
      console.error('Failed to load sales');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSale) return;

    try {
      await axios.post('http://localhost:5000/api/payments', {
        saleId: selectedSale._id,
        customerName: selectedSale.customerName,
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        referenceNumber: paymentData.referenceNumber,
        notes: paymentData.notes,
      });
      toast.success('Payment recorded successfully!');
      setShowPaymentForm(false);
      setSelectedSale(null);
      setPaymentData({
        amount: '',
        paymentMethod: 'cash',
        referenceNumber: '',
        notes: '',
      });
      fetchSummary();
      fetchLedger();
      fetchSales();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to record payment';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FiCheckCircle className="text-green-500" />;
      case 'partial':
        return <FiAlertCircle className="text-amber-500" />;
      default:
        return <FiXCircle className="text-red-500" />;
    }
  };

  const paymentChartData = summary
    ? [
        { name: 'Paid', value: summary.totalReceived, color: '#10b981' },
        { name: 'Pending', value: summary.totalPending, color: '#f59e0b' },
      ]
    : [];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payments Management</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Receivable</p>
                <p className="text-3xl font-bold">
                  ₹{summary?.totalReceivable?.toLocaleString() || 0}
                </p>
              </div>
              <FiDollarSign size={32} className="opacity-50" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Received</p>
                <p className="text-3xl font-bold">
                  ₹{summary?.totalReceived?.toLocaleString() || 0}
                </p>
              </div>
              <FiCheckCircle size={32} className="opacity-50" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 mb-1">Pending</p>
                <p className="text-3xl font-bold">
                  ₹{summary?.totalPending?.toLocaleString() || 0}
                </p>
              </div>
              <FiAlertCircle size={32} className="opacity-50" />
            </div>
          </div>
        </div>

        {/* Payment Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {paymentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Stats */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3" />
                  <span className="font-semibold text-gray-800">Paid</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {summary?.paidCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center">
                  <FiAlertCircle className="text-amber-500 mr-3" />
                  <span className="font-semibold text-gray-800">Partial</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {summary?.partialCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <FiXCircle className="text-red-500 mr-3" />
                  <span className="font-semibold text-gray-800">Pending</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {summary?.pendingCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Customer Ledger</h3>
            <button
              onClick={() => {
                setShowPaymentForm(true);
                setSelectedSale(sales[0] || null);
              }}
              className="btn-primary flex items-center space-x-2"
              disabled={sales.length === 0}
            >
              <FiPlus />
              <span>Record Payment</span>
            </button>
          </div>

          {showPaymentForm && selectedSale && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-primary-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Record Payment</h4>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Customer</label>
                    <input
                      type="text"
                      value={selectedSale.customerName}
                      className="input-field bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label">Outstanding Balance</label>
                    <input
                      type="text"
                      value={`₹${selectedSale.balanceAmount?.toLocaleString()}`}
                      className="input-field bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label">Payment Amount *</label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, amount: e.target.value })
                      }
                      className="input-field"
                      step="0.01"
                      max={selectedSale.balanceAmount}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Payment Method *</label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, paymentMethod: e.target.value })
                      }
                      className="input-field"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Reference Number</label>
                    <input
                      type="text"
                      value={paymentData.referenceNumber}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, referenceNumber: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, notes: e.target.value })
                      }
                      className="input-field"
                      rows="2"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Record Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedSale(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Paid
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Balance
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ledger.length > 0 ? (
                  ledger.map((entry, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-800">{entry.customer}</div>
                        <div className="text-xs text-gray-600">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-800">
                        ₹{entry.amount?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-green-600 font-semibold">
                        ₹{entry.paid?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-red-600 font-semibold">
                        ₹{entry.balance?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(entry.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              entry.status
                            )}`}
                          >
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {entry.balance > 0 && (
                          <button
                            onClick={() => {
                              const sale = sales.find((s) => s.customerName === entry.customer);
                              if (sale) {
                                setSelectedSale(sale);
                                setShowPaymentForm(true);
                              }
                            }}
                            className="px-3 py-1 bg-primary-500 text-white rounded-lg text-xs font-semibold hover:bg-primary-600"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No ledger entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
