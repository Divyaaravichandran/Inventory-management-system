import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiKey } from 'react-icons/fi';
import { useDealerAuth } from '../context/DealerAuthContext';

const DealerSetup = () => {
  const [dealerId, setDealerId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useDealerAuth();
  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    if (!dealerId) nextErrors.dealerId = 'Dealer ID is required';
    if (!password) nextErrors.password = 'Password is required';
    if (password && password.length < 6)
      nextErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword)
      nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(dealerId, password);
    setLoading(false);
    if (result.success) navigate('/dealer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-50 via-primary-50 to-rice-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link
          to="/dealer/login"
          className="inline-flex items-center text-primary-700 hover:text-primary-800 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dealer Login
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-3xl">🌾</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dealer Password Setup
            </h1>
            <p className="text-gray-600">
              Enter your Dealer ID and create a secure password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">
                <FiKey className="inline mr-2" />
                Dealer ID
              </label>
              <input
                type="text"
                value={dealerId}
                onChange={(e) => setDealerId(e.target.value)}
                className={`input-field ${errors.dealerId ? 'border-red-500' : ''}`}
                placeholder="DLR0001"
              />
              {errors.dealerId && (
                <p className="mt-1 text-sm text-red-600">{errors.dealerId}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting password...' : 'Set Password & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealerSetup;

