import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContent } from '../contexts/AppContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userData, loading } = useContext(AppContent);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }

  console.log("role",userData?.role)

  if (allowedRoles.includes(userData?.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
