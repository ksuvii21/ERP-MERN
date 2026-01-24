import React from 'react';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import AlertsCard from '../components/AlertsCard';

const TasksCard = ({ tasks }) => (
    <div style={{ border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', margin: '10px', flex: 2, backgroundColor: 'white' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>My Tasks</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.map(task => <li key={task.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}><strong>{task.title}</strong> - Due: {task.dueDate}</li>)}
        </ul>
    </div>
);

const AssistantPanel = () => (
    <div style={{ border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', margin: '10px', flex: 1, backgroundColor: 'white' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>AI Assistant</h3>
        <input type="text" placeholder="Ask me anything..." style={{ width: '95%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <div style={{ height: '150px', marginTop: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', padding: '10px', color: '#777' }}>Conversation history...</div>
    </div>
);

const EmployeeDashboard = () => {
    // Mock data
    const myTasks = [
        { id: 1, title: 'Complete Q4 report', dueDate: '2026-01-28' },
        { id: 2, title: 'Submit expense claims', dueDate: '2026-01-25' },
        { id: 3, title: 'Team sync meeting', dueDate: '2026-01-26' },
    ];

    const announcements = [
        { message: 'Office closed this Friday for maintenance.', type: 'warning' },
        { message: 'New health insurance policy details available.', type: 'warning' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333' }}>Employee Dashboard</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -10px' }}>
                <KPICard title="Attendance (This Month)" value="98%" icon="✅" />
                <KPICard title="Salary (Net/Month)" value="$4,500" icon="💰" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', margin: '0 -10px' }}>
                <TasksCard tasks={myTasks} />
                <AssistantPanel />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', margin: '0 -10px' }}>
                <ChartCard title="My Performance Score" />
                <AlertsCard title="Company Announcements" alerts={announcements} />
            </div>
        </div>
    );
};

export default EmployeeDashboard;