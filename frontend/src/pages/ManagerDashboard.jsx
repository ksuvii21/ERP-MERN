import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- Sub-Component: Enhanced KPI Card ---
const KPICard = ({ title, value, icon, trend, color }) => (
  <div style={{
    background: '#fff', padding: '20px', borderRadius: '12px', flex: 1,
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: `5px solid ${color}`
  }}>
    <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{value}</div>
    <div style={{ fontSize: '12px', color: trend > 0 ? '#22c55e' : '#ef4444' }}>
      {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% from last month
    </div>
  </div>
);

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate Real API Fetch from ERP Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      // In reality: await fetch('/api/v1/manager/dashboard')
      setTimeout(() => {
        setData({
          performance: [
            { name: 'Dev Team', output: 85, target: 90 },
            { name: 'Design', output: 95, target: 80 },
            { name: 'QA', output: 70, target: 85 },
            { name: 'Ops', output: 92, target: 90 },
          ],
          trends: [
            { week: 'W1', productivity: 65 },
            { week: 'W2', productivity: 78 },
            { week: 'W3', productivity: 72 },
            { week: 'W4', productivity: 89 },
          ],
          risks: [
            { id: 1, msg: 'Database Migration: High Risk of Delay', level: 'Critical' },
            { id: 2, msg: 'Frontend QA: 3 days behind', level: 'Warning' }
          ]
        });
        setLoading(false);
      }, 1000);
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Enterprise Data...</div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '30px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '24px', color: '#1e293b' }}>Operations Overview</h1>
        <button style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Download Report</button>
      </header>

      {/* KPI Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <KPICard title="Project Velocity" value="4.2 pts/d" icon="⚡" trend={12} color="#3b82f6" />
        <KPICard title="Resource Load" value="82%" icon="📊" trend={-5} color="#8b5cf6" />
        <KPICard title="Budget Burn" value="$12,400" icon="💰" trend={8} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
        
        {/* Productivity Trends (Real Chart) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px' }}>Productivity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip stroke="#f8fafc" />
              <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deadline Risks (Enhanced List) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px' }}>Deadline Risks</h3>
          {data.risks.map(risk => (
            <div key={risk.id} style={{ 
              padding: '12px', borderRadius: '8px', marginBottom: '10px',
              backgroundColor: risk.level === 'Critical' ? '#fef2f2' : '#fffbeb',
              border: `1px solid ${risk.level === 'Critical' ? '#fee2e2' : '#fef3c7'}`
            }}>
              <span style={{ 
                fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px',
                backgroundColor: risk.level === 'Critical' ? '#ef4444' : '#f59e0b', color: '#fff' 
              }}>{risk.level}</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#1e293b' }}>{risk.msg}</p>
            </div>
          ))}
        </div>

        {/* Team Performance (Real Bar Chart) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: '20px' }}>Team Performance vs. Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.performance}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: '#f1f5f9'}} />
              <Legend />
              <Bar dataKey="output" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;