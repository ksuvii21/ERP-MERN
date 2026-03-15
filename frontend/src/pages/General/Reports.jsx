import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, CircularProgress, Alert, Chip, Divider 
} from '@mui/material';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { Download, RefreshCw, Cpu, TrendingUp, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import API from '../../utils/api';

const Reports = () => {
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [aiStatus, setAiStatus] = useState({ online: false, confidence: 0 });
  const [kpis, setKpis] = useState({ totalRevenue: 0, avgMonthly: 0, pending: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Real Financial Data from Backend
      const { data: stats } = await API.get('billing/stats');
      
      // Transform for Charts (Sort by Month)
      const formattedData = stats.map(item => ({
        name: item.month, // e.g., "Jan"
        revenue: item.totalRevenue,
        pending: item.totalPending,
        monthIndex: item._id
      })).sort((a, b) => a.monthIndex - b.monthIndex);

      setFinancialData(formattedData);

      // Calculate KPIs
      const totalRev = formattedData.reduce((acc, curr) => acc + curr.revenue, 0);
      const totalPen = formattedData.reduce((acc, curr) => acc + curr.pending, 0);
      setKpis({
        totalRevenue: totalRev,
        avgMonthly: formattedData.length ? Math.round(totalRev / formattedData.length) : 0,
        pending: totalPen
      });

      // 2. Fetch AI Forecast (Send history to Python)
      if (formattedData.length > 0) {
        const history = formattedData.map(d => d.revenue);
        try {
          const aiRes = await fetch('http://localhost:8000/predict/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, months_to_predict: 1 })
          });
          
          if (aiRes.ok) {
            const aiResult = await aiRes.json();
            
            // Create forecast dataset (Last actual + Predicted)
            const lastMonth = formattedData[formattedData.length - 1];
            const forecastPoint = {
              name: 'Next Month (AI)',
              revenue: aiResult.prediction,
              isForecast: true
            };
            
            setForecastData([...formattedData, forecastPoint]);
            setAiStatus({ online: true, confidence: aiResult.confidence * 100 });
          }
        } catch (err) {
          console.warn("AI Service offline", err);
          setAiStatus({ online: false, confidence: 0 });
        }
      }

    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true // Handles external images if any
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ERP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box ref={reportRef} sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight={700} color="#1e293b">Reports & MIS</Typography>
            <Typography variant="body2" color="textSecondary">Real-time financial analytics and AI forecasting</Typography>
        </Box>
        <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<RefreshCw size={18} />} onClick={fetchData}>Refresh</Button>
            <Button variant="contained" startIcon={<Download size={18} />} onClick={handleExportPDF}>Export PDF</Button>
        </Box>
      </Box>

      {/* AI Automation Status Banner */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <Cpu size={24} color={aiStatus.online ? "#0284c7" : "#94a3b8"} />
        <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={700}>AI Intelligence Engine</Typography>
            <Typography variant="caption" color="textSecondary">
                {aiStatus.online 
                    ? `System Online • Predictive Model Confidence: ${aiStatus.confidence.toFixed(1)}%` 
                    : "AI Service Unavailable (Check Python Backend)"}
            </Typography>
        </Box>
        {aiStatus.online && <Chip label="Active" color="primary" size="small" />}
      </Paper>

      <Grid container spacing={3}>
        {/* Main Financial Chart */}
        <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 400 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Revenue & Pending Collections</Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={financialData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue Received" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" fill="#f59e0b" name="Pending Invoices" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* KPI Column */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 185, mb: 3, bgcolor: '#10b981', color: 'white' }}>
                <Typography variant="overline" sx={{ opacity: 0.8 }}>Total Revenue (YTD)</Typography>
                <Typography variant="h3" fontWeight={700}>${kpis.totalRevenue.toLocaleString()}</Typography>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <TrendingUp size={16} /> <Typography variant="body2">+12% vs last year</Typography>
                </Box>
            </Paper>
             <Paper sx={{ p: 3, height: 185, bgcolor: '#fff' }}>
                <Typography variant="overline" color="textSecondary">AI Sales Forecast (Next Month)</Typography>
                <Box height={120}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData}>
                            <defs>
                                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorForecast)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;