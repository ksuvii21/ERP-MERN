import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, CircularProgress, Alert, Chip, Divider,
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle,
  DialogContent, DialogActions, Switch, FormControlLabel, IconButton, Tooltip as MuiTooltip
} from '@mui/material';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Download, RefreshCw, Cpu, TrendingUp, AlertTriangle, FileText, 
  Settings, Activity, Calendar, Filter, Share2, ChevronRight, X
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import API from '../../utils/api';

// --- Helper for CSV Export ---
const downloadCSV = (data, filename) => {
  const headers = Object.keys(data[0] || {}).join(',');
  const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Reports = () => {
  const reportRef = useRef(null);
  const [tabValue, setTabValue] = useState(0); // 0: MIS, 1: Reports, 2: Automation
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [financialData, setFinancialData] = useState([]);
  const [rawInvoices, setRawInvoices] = useState([]); // For granular reporting
  const [forecastData, setForecastData] = useState([]);
  const [aiStatus, setAiStatus] = useState({ online: false, confidence: 0 });
  const [kpis, setKpis] = useState({ totalRevenue: 0, avgMonthly: 0, pending: 0 });

  // Interactive States
  const [drillDownData, setDrillDownData] = useState(null); // For modal
  const [reportFilters, setReportFilters] = useState({ status: 'All', minAmount: 0 });
  const [automationRules, setAutomationRules] = useState({
    emailReports: true,
    expenseAlert: false,
    inventoryTrigger: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Aggregated Stats
      const { data: stats } = await API.get('billing/stats');
      
      // 2. Fetch Raw Data for Drill-down & Reports
      const { data: invoices } = await API.get('billing/invoices');
      setRawInvoices(invoices);
      
      // Transform for Charts (Sort by Month)
      const formattedData = stats.map(item => ({
        name: item.month, // e.g., "Jan"
        revenue: item.totalRevenue,
        pending: item.totalPending,
        monthIndex: item._id,
        rawMonth: item._id // Store ID for drill-down filtering
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
          const aiRes = await fetch('http://localhost:8000/predict/sales', { // Ensure this matches your python port
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

  // --- Handlers ---
  
  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
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

  const handleExportCSV = () => {
    // Prepare data based on current tab
    if (tabValue === 1) {
      // Export filtered invoice list
      const dataToExport = rawInvoices.filter(inv => 
        (reportFilters.status === 'All' || inv.status === reportFilters.status) &&
        inv.totalAmount >= reportFilters.minAmount
      ).map(inv => ({
        Date: new Date(inv.dueDate).toLocaleDateString(),
        InvoiceNo: inv.invoiceNumber || 'N/A',
        Customer: inv.customerName,
        Amount: inv.totalAmount,
        Status: inv.status
      }));
      downloadCSV(dataToExport, 'Detailed_Report.csv');
    } else {
      // Export summary stats
      downloadCSV(financialData, 'Financial_Summary.csv');
    }
  };

  const handleDrillDown = (data) => {
    if (data && data.activePayload) {
      const monthName = data.activePayload[0].payload.name;
      // Filter invoices for this month (Approximation using string match for simplicity)
      const relevantInvoices = rawInvoices.filter(inv => 
        new Date(inv.dueDate).toLocaleString('default', { month: 'short' }) === monthName
      );
      setDrillDownData({ month: monthName, invoices: relevantInvoices });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight={700} color="#1e293b">Business Intelligence</Typography>
            <Typography variant="body2" color="textSecondary">Real-time financial analytics and AI forecasting</Typography>
        </Box>
        <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<RefreshCw size={18} />} onClick={fetchData}>Refresh</Button>
            <Button variant="outlined" startIcon={<Share2 size={18} />} onClick={handleExportCSV}>Export CSV</Button>
            <Button variant="contained" startIcon={<Download size={18} />} onClick={handleExportPDF}>Download PDF</Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="primary">
          <Tab icon={<Activity size={20} />} label="MIS Dashboard" iconPosition="start" />
          <Tab icon={<FileText size={20} />} label="Detailed Reports" iconPosition="start" />
          <Tab icon={<Settings size={20} />} label="Automation" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ==================== TAB 0: MIS DASHBOARD ==================== */}
      {tabValue === 0 && (
        <Box ref={reportRef}>
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
                <Typography variant="h6" fontWeight={600} mb={2}>Revenue Trends (Click Bar to Drill-Down)</Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={financialData} onClick={handleDrillDown} style={{ cursor: 'pointer' }}>
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
      )}

      {/* ==================== TAB 1: DETAILED REPORTS (AD-HOC BUILDER) ==================== */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>Ad-hoc Report Builder</Typography>
            <Box display="flex" gap={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select 
                        value={reportFilters.status} 
                        label="Status"
                        onChange={(e) => setReportFilters({...reportFilters, status: e.target.value})}
                    >
                        <MenuItem value="All">All Status</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Overdue">Overdue</MenuItem>
                    </Select>
                </FormControl>
                <TextField 
                    label="Min Amount" 
                    type="number" 
                    size="small" 
                    value={reportFilters.minAmount}
                    onChange={(e) => setReportFilters({...reportFilters, minAmount: e.target.value})}
                />
            </Box>
          </Box>

          <TableContainer>
            <Table>
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Invoice #</strong></TableCell>
                        <TableCell><strong>Customer</strong></TableCell>
                        <TableCell align="right"><strong>Amount</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rawInvoices
                        .filter(inv => 
                            (reportFilters.status === 'All' || inv.status === reportFilters.status) &&
                            inv.totalAmount >= reportFilters.minAmount
                        )
                        .map((inv) => (
                        <TableRow key={inv._id} hover>
                            <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>{inv.invoiceNumber || 'INV-000'}</TableCell>
                            <TableCell>{inv.customerName}</TableCell>
                            <TableCell align="right">${inv.totalAmount.toLocaleString()}</TableCell>
                            <TableCell align="center">
                                <Chip 
                                    label={inv.status} 
                                    color={inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : 'warning'} 
                                    size="small" 
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    {rawInvoices.length === 0 && (
                        <TableRow><TableCell colSpan={5} align="center">No data found</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ==================== TAB 2: AUTOMATION CENTER ==================== */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Workflow Triggers</Typography>
                    <Typography variant="body2" color="textSecondary" mb={3}>
                        Configure automated actions based on system events.
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography fontWeight={500}>High Expense Alert</Typography>
                            <Typography variant="caption" color="textSecondary">Notify Admin if expenses exceed $5,000</Typography>
                        </Box>
                        <Switch 
                            checked={automationRules.expenseAlert} 
                            onChange={(e) => setAutomationRules({...automationRules, expenseAlert: e.target.checked})} 
                        />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography fontWeight={500}>Inventory Reorder</Typography>
                            <Typography variant="caption" color="textSecondary">Auto-create PO when stock &lt; 10 units</Typography>
                        </Box>
                        <Switch 
                            checked={automationRules.inventoryTrigger} 
                            onChange={(e) => setAutomationRules({...automationRules, inventoryTrigger: e.target.checked})} 
                        />
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Scheduled Reporting</Typography>
                    <Typography variant="body2" color="textSecondary" mb={3}>
                        Automatically generate and email reports to stakeholders.
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography fontWeight={500}>Weekly Financial Summary</Typography>
                            <Typography variant="caption" color="textSecondary">Every Monday at 9:00 AM</Typography>
                        </Box>
                        <Switch 
                            checked={automationRules.emailReports} 
                            onChange={(e) => setAutomationRules({...automationRules, emailReports: e.target.checked})} 
                        />
                    </Box>
                    <Button variant="outlined" startIcon={<Calendar size={16} />} fullWidth>
                        Add New Schedule
                    </Button>
                </Paper>
            </Grid>
        </Grid>
      )}

      {/* Drill Down Modal */}
      <Dialog open={!!drillDownData} onClose={() => setDrillDownData(null)} maxWidth="md" fullWidth>
        <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
            {drillDownData?.month} Transaction Details
            <IconButton onClick={() => setDrillDownData(null)}><X size={20}/></IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <Table size="small">
                <TableHead><TableRow><TableCell>Invoice</TableCell><TableCell>Customer</TableCell><TableCell align="right">Amount</TableCell><TableCell align="right">Status</TableCell></TableRow></TableHead>
                <TableBody>
                    {drillDownData?.invoices.map(inv => (
                        <TableRow key={inv._id}>
                            <TableCell>{inv.invoiceNumber}</TableCell>
                            <TableCell>{inv.customerName}</TableCell>
                            <TableCell align="right">${inv.totalAmount}</TableCell>
                            <TableCell align="right">{inv.status}</TableCell>
                        </TableRow>
                    ))}
                    {drillDownData?.invoices.length === 0 && <TableRow><TableCell colSpan={4} align="center">No transactions found.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDrillDownData(null)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Reports;