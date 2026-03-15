import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Avatar, CircularProgress, Card, CardContent, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { Send, SmartToy, Person, TrendingUp, Warning, Close } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ERPBrain = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', type: 'text', content: 'Hello! I am your ERP Brain 🧠. Ask me about sales predictions, attrition risk, or financial anomalies.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Simulated AI Engine (Intent Recognition & Data Fetching)
  const processQuery = async (query) => {
    const lowerQ = query.toLowerCase();
    
    // Intent: Attrition Prediction (Random Forest)
    if (lowerQ.includes('resign') || lowerQ.includes('attrition') || lowerQ.includes('quit')) {
      try {
        // 1. Fetch Real Users from Node.js Backend (Single Source of Truth)
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        
        const userResponse = await fetch('http://localhost:5000/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userResponse.ok) throw new Error('Failed to fetch employee data');
        
        const realUsers = await userResponse.json();

        // 2. Prepare Data for AI (Simulating HR stats since they aren't in DB yet)
        const aiInputData = realUsers.map(u => ({
            name: u.name,
            role: u.role,
            stats: { 
                satisfaction_level: Math.random(), // In a proper ERP, these come from DB
                last_evaluation: Math.random(),
                number_project: Math.floor(Math.random() * 5) + 2,
                average_monthly_hours: Math.floor(Math.random() * 150) + 150,
                time_spend_company: Math.floor(Math.random() * 10),
                work_accident: 0,
                promotion_last_5years: 0,
                salary_level: Math.floor(Math.random() * 3)
            }
        }));

        // 3. Batch Process with Python AI Engine
        const aiResponse = await fetch('http://localhost:8000/predict/attrition/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aiInputData.map(u => u.stats))
        });
        
        const predictions = await aiResponse.json();

        // 4. Merge Results
        const analysis = aiInputData.map((emp, index) => ({
            ...emp,
            risk: predictions[index].risk_score,
            risk_level: predictions[index].risk_level,
            reason: predictions[index].risk_level === 'High' ? 'High Risk Factors' : 'Normal'
        }));

        const highRisk = analysis.filter(a => a.risk > 30);

        return {
          type: 'attrition',
          content: `I analyzed ${realUsers.length} employees from the live database. Found ${highRisk.length} potential risks.`,
          data: highRisk
        };
      } catch (err) {
        console.error(err);
        return { type: 'text', content: '⚠️ Error: Could not fetch real data. Ensure Node (5000) and Python (8000) are running.' };
      }
    }
    
    // Intent: Expense Anomaly (Alert Engine)
    if (lowerQ.includes('expense') || lowerQ.includes('increase') || lowerQ.includes('cost')) {
      return {
        type: 'anomaly',
        content: 'I detected a significant spike in expenses this month compared to the moving average.',
        data: { category: 'Travel', amount: '$4,500', date: 'Feb 12, 2026', reason: 'Unplanned executive trip to NY' }
      };
    }

    // Intent: Sales Forecast (Linear Regression / LSTM)
    if (lowerQ.includes('sales') || lowerQ.includes('predict') || lowerQ.includes('forecast')) {
      try {
        // Mock history data (In a real scenario, fetch this from your Node backend DB first)
        const history = [12000, 15000, 14000, 18000, 19000, 22000];
        
        const response = await fetch('http://localhost:8000/predict/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history, months_to_predict: 1 })
        });
        const result = await response.json();
        
        // Combine history with prediction for the chart
        const chartData = history.map((val, i) => ({ day: `Month ${i+1}`, sales: val }));
        chartData.push({ day: 'Next Month', sales: result.prediction });

        return {
          type: 'forecast',
          content: `Based on your historical data, the AI predicts sales of $${result.prediction} for next month.\nTrend: ${result.trend} (Confidence: ${result.confidence * 100}%)`,
          data: chartData
        };
      } catch (error) {
        return { type: 'text', content: '⚠️ Error connecting to AI Engine. Ensure the Python service is running on port 8000.' };
      }
    }

    // Intent: Financial Report (LLM Generation)
    if (lowerQ.includes('report') || lowerQ.includes('financial') || lowerQ.includes('summary')) {
      return {
        type: 'text',
        content: '📊 **Monthly Financial Report Generated**\n\n✅ **Revenue**: $152,000 (Up 12% YoY)\n⚠️ **Expenses**: $48,000 (High Travel Costs detected)\n📉 **Net Profit**: $104,000\n\n**AI Insight**: Overall performance is strong. Recommend reviewing travel policies to optimize margins for Q2.'
      };
    }

    return { type: 'text', content: "I'm not sure about that yet. Try asking about 'sales predictions', 'attrition risk', or 'expense reports'." };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await processQuery(userMsg.content);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', ...response }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', type: 'text', content: 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.type === 'text') return <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.content}</Typography>;
    
    if (msg.type === 'attrition') return (
      <Box>
        <Typography variant="body2" gutterBottom>{msg.content}</Typography>
        <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {msg.data.map((emp, i) => (
            <ListItem key={i}>
              <ListItemText primary={emp.name} secondary={`${emp.role} - ${emp.reason}`} />
              <Chip label={`${emp.risk}% Risk`} color="error" size="small" />
            </ListItem>
          ))}
        </List>
      </Box>
    );

    if (msg.type === 'anomaly') return (
      <Box>
        <Typography variant="body2" gutterBottom>{msg.content}</Typography>
        <Card variant="outlined" sx={{ mt: 1, borderColor: '#ef4444' }}>
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box display="flex" alignItems="center" gap={1} color="error.main">
              <Warning fontSize="small" /> <Typography variant="subtitle2">Anomaly Detected</Typography>
            </Box>
            <Typography variant="h6">{msg.data.amount}</Typography>
            <Typography variant="caption" color="text.secondary">{msg.data.category} • {msg.data.date}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{msg.data.reason}</Typography>
          </CardContent>
        </Card>
      </Box>
    );

    if (msg.type === 'forecast') return (
      <Box sx={{ width: '100%', minWidth: 250 }}>
        <Typography variant="body2" gutterBottom>{msg.content}</Typography>
        <Box sx={{ height: 150, mt: 1, bgcolor: '#fff', borderRadius: 1, p: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={msg.data}>
              <XAxis dataKey="day" hide />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: '#3b82f6' }}><SmartToy /></Avatar>
          <Typography variant="h6" fontWeight="bold">ERP Brain</Typography>
        </Box>
        <IconButton onClick={onClose}><Close /></IconButton>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <Paper sx={{ p: 2, bgcolor: msg.sender === 'user' ? '#3b82f6' : '#fff', color: msg.sender === 'user' ? '#fff' : 'text.primary', borderRadius: 2 }}>
              {renderMessageContent(msg)}
            </Paper>
          </Box>
        ))}
        {loading && <Box sx={{ alignSelf: 'flex-start' }}><CircularProgress size={20} /></Box>}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
        <TextField fullWidth placeholder="Ask about sales, risks, or reports..." size="small" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
        <IconButton color="primary" onClick={handleSend}><Send /></IconButton>
      </Box>
    </Box>
  );
};

export default ERPBrain;
