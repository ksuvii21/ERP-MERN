import React from 'react';
import { useSelector } from 'react-redux';
import { ROLES } from '../config/roles';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div>Loading...</div>;
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
        return <div>Welcome to your Dashboard.</div>;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;
