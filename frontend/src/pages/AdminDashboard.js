import React from 'react';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import AlertsCard from '../components/AlertsCard';

const AdminDashboard = () => {
  // Mock data - in a real app, this would come from API calls
  const aiAlerts = [
    { message: 'Unusual expense spike detected in Q4.', type: 'warning' },
    { message: 'Server CPU usage at 95%.', type: 'error' },
    { message: 'Revenue goal for the month is at risk.', type: 'warning' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333' }}>Admin Dashboard</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -10px' }}>
        <KPICard title="Total Employees" value="1,204" icon="👥" />
        <KPICard title="Company Health Score" value="8.5/10" icon="❤️" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', margin: '0 -10px' }}>
        <ChartCard title="Revenue vs Expense" />
        <AlertsCard title="AI Alerts" alerts={aiAlerts} />
      </div>
    </div>
  );
};

export default AdminDashboard;