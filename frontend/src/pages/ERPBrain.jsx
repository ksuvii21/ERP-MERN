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
  const processQuery = (query) => {
    const lowerQ = query.toLowerCase();
    
    // Intent: Attrition Prediction (Random Forest)
    if (lowerQ.includes('resign') || lowerQ.includes('attrition') || lowerQ.includes('quit')) {
      return {
        type: 'attrition',
        content: 'I analyzed the workforce data using the Random Forest model. Here are employees with high attrition risk:',
        data: [
          { name: 'Sarah Jenkins', role: 'Senior Dev', risk: 85, reason: 'Stagnant Salary' },
          { name: 'Mike Ross', role: 'Sales Lead', risk: 72, reason: 'Frequent Short Leaves' }
        ]
      };
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
      return {
        type: 'forecast',
        content: 'Based on historical trends (LSTM Model), here is the sales forecast for next month:',
        data: [
          { day: 'Week 1', sales: 12000 }, { day: 'Week 2', sales: 19000 },
          { day: 'Week 3', sales: 15000 }, { day: 'Week 4', sales: 24000 }
        ]
      };
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

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate Network/Processing Delay
    setTimeout(() => {
      const response = processQuery(userMsg.content);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', ...response }]);
      setLoading(false);
    }, 1200);
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