import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';

/**
 * A router component that selects the appropriate dashboard based on the user's role.
 * This ensures that the user sees a view tailored to their responsibilities.
 */
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !user.role) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <CircularProgress />
        <Typography mt={2}>Loading user profile...</Typography>
      </Box>
    );
  }

  switch (user.role) {
    case 'super_admin':
    case 'admin':
      return <AdminDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    case 'manager':
    default:
      return <ManagerDashboard />;
  }
};

export default Dashboard;