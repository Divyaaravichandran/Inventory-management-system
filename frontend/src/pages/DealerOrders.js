import React, { useEffect, useState } from 'react';
import DealerLayout from '../components/DealerLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

const DealerOrders = () => {
  const [formData, setFormData] = useState({
    riceType: '',
    brand: '',
    bagSize: '',
    quantityBags: '',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dealer-orders/dealer');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
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
      await axios.post('http://localhost:5000/api/dealer-orders/dealer', {
        ...formData,
        quantityBags: parseInt(formData.quantityBags, 10),
      });
      toast.success('Order placed successfully. Pending admin approval.');
      setFormData({
        riceType: '',
        brand: '',
        bagSize: '',
        quantityBags: '',
      });
      fetchOrders();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DealerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600 mb-6">
          Place new rice orders and track their status.
        </p>

        {/* Order form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Place New Order
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Rice Type *</label>
              <select
                name="riceType"
                value={formData.riceType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Type</option>
                <option value="Basmati">Basmati</option>
                <option value="Sona Masoori">Sona Masoori</option>
                <option value="Jasmine">Jasmine</option>
                <option value="Brown Rice">Brown Rice</option>
                <option value="Parboiled">Parboiled</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input-field"
                placeholder="Brand name"
                required
              />
            </div>
            <div>
              <label className="label">Bag Size *</label>
              <select
                name="bagSize"
                value={formData.bagSize}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Size</option>
                <option value="5kg">5 kg</option>
                <option value="10kg">10 kg</option>
                <option value="25kg">25 kg</option>
                <option value="75kg">75 kg</option>
              </select>
            </div>
            <div>
              <label className="label">Quantity (bags) *</label>
              <input
                type="number"
                name="quantityBags"
                value={formData.quantityBags}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Orders table */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Rice
                  </th>
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Bags
                  </th>
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-2 text-sm text-gray-800">
                        {order.riceType} - {order.brand}
                      </td>
                      <td className="py-2 text-sm text-gray-800">
                        {order.quantityBags} x {order.bagSize}
                      </td>
                      <td className="py-2 text-sm text-gray-800 capitalize">
                        {order.status}
                      </td>
                      <td className="py-2 text-sm text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 text-center text-gray-500 text-sm"
                    >
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
};

export default DealerOrders;

