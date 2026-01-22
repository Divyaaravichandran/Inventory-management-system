import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiMapPin, FiPackage } from 'react-icons/fi';

const GodownManagement = () => {
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    stockType: 'mixed',
  });

  useEffect(() => {
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/godown');
      setGodowns(response.data);
    } catch (error) {
      toast.error('Failed to load godowns');
    } finally {
      setLoading(false);
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
    try {
      await axios.post('http://localhost:5000/api/godown', {
        ...formData,
        capacity: parseFloat(formData.capacity),
      });
      toast.success('Godown added successfully!');
      setShowForm(false);
      setFormData({ name: '', location: '', capacity: '', stockType: 'mixed' });
      fetchGodowns();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add godown';
      toast.error(message);
    }
  };

  const getCapacityPercent = (godown) => {
    return (godown.currentStock / godown.capacity) * 100;
  };

  const getCapacityColor = (percent) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Godown Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
            <FiPlus />
            <span>Add Godown</span>
          </button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Godown</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Godown Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Capacity (tons) *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="label">Stock Type *</label>
                <select
                  name="stockType"
                  value={formData.stockType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="paddy">Paddy</option>
                  <option value="rice">Rice</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button type="submit" className="btn-primary">
                  Add Godown
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {godowns.map((godown) => {
            const capacityPercent = getCapacityPercent(godown);
            const isNearFull = capacityPercent >= 90;

            return (
              <div
                key={godown._id}
                className={`card transform hover:scale-105 transition-all ${
                  isNearFull ? 'ring-2 ring-amber-500 shadow-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{godown.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiMapPin className="mr-1" />
                      {godown.location}
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold capitalize">
                    {godown.stockType}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {capacityPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getCapacityColor(
                        capacityPercent
                      )}`}
                      style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <FiPackage className="mr-2" />
                    <span className="text-sm">
                      {godown.currentStock.toFixed(2)} / {godown.capacity.toFixed(2)} tons
                    </span>
                  </div>
                  {isNearFull && (
                    <span className="text-xs font-semibold text-amber-600">Near Full!</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {godowns.length === 0 && (
          <div className="card text-center py-12">
            <FiPackage className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No godowns found. Add your first godown to get started.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GodownManagement;
