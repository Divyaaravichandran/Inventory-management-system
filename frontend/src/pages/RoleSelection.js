import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUser, FiUsers } from 'react-icons/fi';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      icon: FiShield,
      description: 'Full system access',
      enabled: true,
      color: 'from-primary-500 to-primary-700',
    },
    {
      id: 'dealer',
      name: 'Dealer',
      icon: FiUser,
      description: 'Dealer portal access',
      enabled: true,
      color: 'from-primary-500 to-primary-700',
    },
    {
      id: 'user',
      name: 'User',
      icon: FiUsers,
      description: 'Limited access',
      enabled: false,
      color: 'from-gray-400 to-gray-600',
    },
  ];

  const handleRoleSelect = (role) => {
    if (!role.enabled) return;
    if (role.id === 'admin') navigate('/admin/login');
    if (role.id === 'dealer') navigate('/dealer/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-50 via-primary-50 to-rice-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">

          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to Kongu
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-700 mb-6">
            Hi-Tech Rice Industries
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive Inventory & Operations Management System
          </p>
        </div>

        {/* System Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            System Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '📦', title: 'Procurement', desc: 'Paddy Inward Management' },
              { icon: '🏭', title: 'Production', desc: 'Rice Processing & Stock' },
              { icon: '💰', title: 'Sales', desc: 'Order & Dispatch Tracking' },
              { icon: '📊', title: 'Finance', desc: 'Payment & Ledger Management' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                className={`relative group cursor-pointer ${
                  role.enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`bg-gradient-to-br ${role.color} rounded-2xl p-8 shadow-xl transform transition-all duration-300 ${
                    role.enabled
                      ? 'hover:scale-105 hover:shadow-2xl group-hover:ring-4 group-hover:ring-primary-300'
                      : ''
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 ${
                        role.enabled ? 'group-hover:bg-white/30' : ''
                      }`}
                    >
                      <Icon size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{role.name}</h3>
                    <p className="text-white/90 mb-4">{role.description}</p>
                    {!role.enabled && (
                      <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold">
                        Coming Soon
                      </span>
                    )}
                    {role.enabled && (
                      <div className="mt-6">
                        <span className="inline-block px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold shadow-lg transform group-hover:scale-110 transition-transform">
                          Continue →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {role.enabled && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
