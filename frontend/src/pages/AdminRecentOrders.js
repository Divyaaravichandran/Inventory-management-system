import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminRecentOrders = () => {
  const [dealerOrders, setDealerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealerOrders();
  }, []);

  const fetchDealerOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dealer-orders');
      setDealerOrders(res.data || []);
    } catch (error) {
      toast.error('Failed to load dealer orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/dealer-orders/${orderId}/approve`);
      toast.success('Order approved and inventory updated');
      fetchDealerOrders();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to approve order';
      toast.error(message);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/dealer-orders/${orderId}/status`, {
        status: 'rejected',
      });
      toast.success('Order rejected');
      fetchDealerOrders();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to reject order';
      toast.error(message);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Recent Dealer Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Dealer Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      Dealer
                    </th>
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      Rice
                    </th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dealerOrders.length > 0 ? (
                    dealerOrders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 text-sm text-gray-800">
                          {order.dealer
                            ? `${order.dealer.dealerName} (${order.dealer.dealerId})`
                            : order.dealerId}
                        </td>
                        <td className="py-2 text-sm text-gray-800">
                          {order.riceType} - {order.brand}
                        </td>
                        <td className="py-2 text-sm text-gray-800 text-right">
                          {order.quantityBags} x {order.bagSize}
                        </td>
                        <td className="py-2 text-sm text-gray-800 capitalize">
                          {order.status}
                        </td>
                        <td className="py-2 text-sm text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 text-sm text-gray-800">
                          {order.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(order._id)}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(order._id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 text-center text-gray-500 text-sm"
                      >
                        No dealer orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminRecentOrders;

