import React from 'react';
import ChartCard from '../components/ChartCard';
import AlertsCard from '../components/AlertsCard';

const ManagerDashboard = () => {
    // Mock data
    const deadlineRisks = [
        { message: 'Project "Phoenix" is 5 days behind schedule.', type: 'error' },
        { message: 'Resource allocation for "Project Gamma" exceeds budget.', type: 'warning' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333' }}>Manager Dashboard</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -10px' }}>
                <ChartCard title="Team Performance" />
                <ChartCard title="Productivity Trends" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', margin: '0 -10px' }}>
                <AlertsCard title="Deadline Risks" alerts={deadlineRisks} />
            </div>
        </div>
    );
};

export default ManagerDashboard;