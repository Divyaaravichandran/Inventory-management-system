import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import RoleSelection from './pages/RoleSelection';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import PaddyInward from './pages/PaddyInward';
import GodownManagement from './pages/GodownManagement';
import RiceStock from './pages/RiceStock';
import RiceSales from './pages/RiceSales';
import DispatchTracking from './pages/DispatchTracking';
import Payments from './pages/Payments';
import AdminSettings from './pages/AdminSettings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/paddy-inward"
              element={
                <PrivateRoute>
                  <PaddyInward />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/godown"
              element={
                <PrivateRoute>
                  <GodownManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/rice-stock"
              element={
                <PrivateRoute>
                  <RiceStock />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/sales"
              element={
                <PrivateRoute>
                  <RiceSales />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dispatch"
              element={
                <PrivateRoute>
                  <DispatchTracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <PrivateRoute>
                  <Payments />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <PrivateRoute>
                  <AdminSettings />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
