import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DealerAuthProvider } from './context/DealerAuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import RoleSelection from './pages/RoleSelection';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDealers from './pages/AdminDealers';
import AdminRecentOrders from './pages/AdminRecentOrders';
import PaddyInward from './pages/PaddyInward';
import GodownManagement from './pages/GodownManagement';
import RiceStock from './pages/RiceStock';
import RiceSales from './pages/RiceSales';
import DispatchTracking from './pages/DispatchTracking';
import Payments from './pages/Payments';
import AdminSettings from './pages/AdminSettings';
import PrivateRoute from './components/PrivateRoute';
import DealerLogin from './pages/DealerLogin';
import DealerSetup from './pages/DealerSetup';
import DealerDashboard from './pages/DealerDashboard';
import DealerOrders from './pages/DealerOrders';
import DealerInvoices from './pages/DealerInvoices';
import DealerPrivateRoute from './components/DealerPrivateRoute';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import UserDashboard from './pages/UserDashboard';
import UserProducts from './pages/UserProducts';
import UserCheckout from './pages/UserCheckout';
import UserOrders from './pages/UserOrders';
import UserProfile from './pages/UserProfile';
import UserPrivateRoute from './components/UserPrivateRoute';

function App() {
  return (
    <AuthProvider>
      <DealerAuthProvider>
        <UserAuthProvider>
          <Router>
            <div className="App">
              <Toaster position="top-right" />
              <Routes>
              <Route path="/" element={<RoleSelection />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dealers"
                element={
                  <PrivateRoute>
                    <AdminDealers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/recent-orders"
                element={
                  <PrivateRoute>
                    <AdminRecentOrders />
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
              {/* Dealer routes */}
              <Route path="/dealer/login" element={<DealerLogin />} />
              <Route path="/dealer/setup" element={<DealerSetup />} />
              <Route
                path="/dealer/dashboard"
                element={
                  <DealerPrivateRoute>
                    <DealerDashboard />
                  </DealerPrivateRoute>
                }
              />
              <Route
                path="/dealer/orders"
                element={
                  <DealerPrivateRoute>
                    <DealerOrders />
                  </DealerPrivateRoute>
                }
              />
              <Route
                path="/dealer/invoices"
                element={
                  <DealerPrivateRoute>
                    <DealerInvoices />
                  </DealerPrivateRoute>
                }
              />
              {/* User routes */}
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route
                path="/user/dashboard"
                element={
                  <UserPrivateRoute>
                    <UserDashboard />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/user/products"
                element={
                  <UserPrivateRoute>
                    <UserProducts />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/user/checkout"
                element={
                  <UserPrivateRoute>
                    <UserCheckout />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/user/orders"
                element={
                  <UserPrivateRoute>
                    <UserOrders />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <UserPrivateRoute>
                    <UserProfile />
                  </UserPrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
        </UserAuthProvider>
      </DealerAuthProvider>
    </AuthProvider>
  );
}

export default App;
