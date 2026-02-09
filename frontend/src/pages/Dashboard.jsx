import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ROLES } from '../config/roles';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import HRDashboard from './HRDashboard';
import ERPBrain from './ERPBrain';
import { Fab, Drawer } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [aiOpen, setAiOpen] = useState(false);

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
      case 'HR':
        return <HRDashboard />;
      default:
        return <div>Welcome to your Dashboard.</div>;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {renderDashboard()}
      
      {/* AI Assistant Floating Button */}
      <Fab 
        color="primary" 
        aria-label="ai-brain" 
        sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}
        onClick={() => setAiOpen(true)}
      >
        <SmartToy />
      </Fab>

      {/* AI Assistant Drawer */}
      <Drawer anchor="right" open={aiOpen} onClose={() => setAiOpen(false)}>
         <div style={{ width: 400, height: '100%' }}>
            <ERPBrain onClose={() => setAiOpen(false)} />
         </div>
      </Drawer>
    </div>
  );
};

export default Dashboard;
