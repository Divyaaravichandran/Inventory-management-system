import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDealerAuth } from '../context/DealerAuthContext';

const DealerPrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useDealerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/dealer/login" replace />;
};

export default DealerPrivateRoute;

