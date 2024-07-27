import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, user }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  return Component;
};

export default ProtectedRoute;