import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- Sub-Component: Real-time AI Assistant ---
const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([{ role: 'bot', text: 'Hello! I can help you check your remaining leave or salary breakdown.' }]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newChat = [...chat, { role: 'user', text: input }];
    setChat(newChat);
    setInput('');
    // Simulate AI logic
    setTimeout(() => {
      setChat([...newChat, { role: 'bot', text: 'Processing your request in the ERP database...' }]);
    }, 800);
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>🤖</span> AI Business Assistant
      </h3>
      <div style={{ height: '200px', overflowY: 'auto', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '10px', fontSize: '14px' }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ background: msg.role === 'user' ? '#3b82f6' : '#e2e8f0', color: msg.role === 'user' ? '#fff' : '#1e293b', padding: '6px 12px', borderRadius: '12px', display: 'inline-block' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <input 
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about payroll..." 
          style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
        />
        <button onClick={handleSend} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-world implementation would fetch data from /api/employee/stats
    const salaryData = [
      { month: 'Oct', amount: 4200 }, { month: 'Nov', amount: 4500 },
      { month: 'Dec', amount: 4500 }, { month: 'Jan', amount: 4800 },
    ];
    setAttendance([{ name: 'Present', value: 21 }, { name: 'Absent', value: 1 }]);
    setLoading(false);
  }, []);

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#0f172a', margin: 0 }}>Welcome Back, Alex</h2>
        <span style={{ color: '#64748b' }}>Jan 29, 2026</span>
      </div>

      {/* Top Section: KPIs & Attendance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={attendance} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                            {attendance.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Attendance Rate</p>
                <h3 style={{ margin: 0 }}>95.4%</h3>
            </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Net Salary (Pending)</p>
            <h3 style={{ margin: '5px 0', color: '#22c55e' }}>$4,800.00</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Next Pay: Feb 01</span>
        </div>
      </div>

      {/* Middle Section: Tasks & AI */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '15px', minWidth: '300px' }}>
            <h3 style={{ marginTop: 0 }}>Active Tasks</h3>
            {[
                { t: 'Q4 Financial Audit', d: 'High', c: '#ef4444' },
                { t: 'Update Security Protocols', d: 'Med', c: '#f59e0b' },
                { t: 'Onboard New Intern', d: 'Low', c: '#3b82f6' }
            ].map((task, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>{task.t}</span>
                    <span style={{ color: task.c, fontSize: '12px', fontWeight: 'bold' }}>{task.d} Priority</span>
                </div>
            ))}
        </div>
        <AIAssistant />
      </div>

      {/* Bottom Section: Performance Chart */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '15px' }}>
        <h3 style={{ marginTop: 0 }}>Salary Growth & Performance</h3>
        <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                    { name: 'Oct', val: 3000 }, { name: 'Nov', val: 3200 }, 
                    { name: 'Dec', val: 4500 }, { name: 'Jan', val: 4800 }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#dbeafe" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;