import React from 'react';
import { ROLES } from '../../../backend/config/roles';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

// This is a placeholder for your actual auth context/hook.
const useAuth = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  return { user };
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>; // Or a redirect to the login page
  }

  const renderDashboard = () => {
    switch (user.role) {
      case ROLES.SUPER_ADMIN:
      case ROLES.ADMIN:
        return <AdminDashboard />;
      case ROLES.MANAGER:
        return <ManagerDashboard />;
      case ROLES.EMPLOYEE:
        return <EmployeeDashboard />;
      default:
        // A default view for other roles like HR, Finance, etc.
        return <div>Welcome to your Dashboard.</div>;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;