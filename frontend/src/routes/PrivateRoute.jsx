import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dulzura-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dulzura-pink"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
