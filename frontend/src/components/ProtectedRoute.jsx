import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    // User is not logged in, redirect them to the login page.
    // We save the current location so we can redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route requires specific roles, check if the user has one of them.
  if (roles && !roles.includes(user.role)) {
    // User is logged in but does not have the required role.
    // Redirect them to the dashboard or an "unauthorized" page.
    return <Navigate to="/app/dashboard" replace />;
  }

  // If all checks pass, render the component.
  return children;
};

export default ProtectedRoute;