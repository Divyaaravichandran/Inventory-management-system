import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiCheck } from 'react-icons/fi';

const PaddyInward = () => {
  const [formData, setFormData] = useState({
    paddyType: '',
    quantity: '',
    weight: '',
    qualityGrade: '',
    moisturePercent: '',
    sellerName: '',
    sellerContact: '',
    vehicleNumber: '',
    location: '',
    godownId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/godown');
      setGodowns(response.data);
    } catch (error) {
      toast.error('Failed to load godowns');
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
      await axios.post('http://localhost:5000/api/paddy', {
        ...formData,
        quantity: parseFloat(formData.quantity),
        weight: parseFloat(formData.weight),
        moisturePercent: parseFloat(formData.moisturePercent),
      });
      toast.success('Paddy inward added successfully!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          paddyType: '',
          quantity: '',
          weight: '',
          qualityGrade: '',
          moisturePercent: '',
          sellerName: '',
          sellerContact: '',
          vehicleNumber: '',
          location: '',
          godownId: '',
          date: new Date().toISOString().split('T')[0],
        });
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add paddy inward';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Paddy Inward (Procurement)</h1>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <FiCheck className="text-green-600 mr-2" size={20} />
            <span className="text-green-800 font-medium">Paddy inward added successfully!</span>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Paddy Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Paddy Details</h3>

                <div>
                  <label className="label">Paddy Type *</label>
                  <select
                    name="paddyType"
                    value={formData.paddyType}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Paddy Type</option>
                    <option value="Basmati">Basmati</option>
                    <option value="Sona Masoori">Sona Masoori</option>
                    <option value="Jasmine">Jasmine</option>
                    <option value="Brown Rice">Brown Rice</option>
                    <option value="Parboiled">Parboiled</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter quantity"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="label">Weight (tons) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter weight in tons"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="label">Quality Grade *</label>
                  <select
                    name="qualityGrade"
                    value={formData.qualityGrade}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <div>
                  <label className="label">Moisture % *</label>
                  <input
                    type="number"
                    name="moisturePercent"
                    value={formData.moisturePercent}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter moisture percentage"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Right Column: Seller & Logistics */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Seller & Logistics</h3>

                <div>
                  <label className="label">Seller Name *</label>
                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter seller name"
                    required
                  />
                </div>

                <div>
                  <label className="label">Seller Contact *</label>
                  <input
                    type="text"
                    name="sellerContact"
                    value={formData.sellerContact}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter contact number"
                    required
                  />
                </div>

                <div>
                  <label className="label">Vehicle Number *</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter vehicle number"
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
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div>
                  <label className="label">Godown *</label>
                  <select
                    name="godownId"
                    value={formData.godownId}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Godown</option>
                    {godowns.map((godown) => (
                      <option key={godown._id} value={godown._id}>
                        {godown.name} - {godown.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <FiPlus />
                <span>{loading ? 'Adding...' : 'Add Paddy Inward'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PaddyInward;
