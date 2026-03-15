import React, { useState, useEffect } from 'react';
import {
  Container, Divider,Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Alert, Modal, Box, TextField, MenuItem, IconButton, Chip,
  Dialog, AppBar, Toolbar, Slide, Grid, Card, CardContent,
  Tabs, Tab, Avatar, List, ListItem, ListItemText, ListItemIcon, Switch, FormControlLabel,
  InputAdornment, Tooltip
} from '@mui/material';
import {
  Add, Visibility, Close, Fingerprint, MonitorHeart,
  ReceiptLong, Security, Save, Warning, Search, 
  LocalHospital, PersonAdd, FilterList, Edit, Delete
} from '@mui/icons-material'; // Assuming you have @mui/icons-material installed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../../utils/api';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// --- THEME & STYLES ---
const themeColors = {
  primary: '#0ea5e9', // Sky Blue
  secondary: '#64748b', // Slate
  background: '#f8fafc',
  card: '#ffffff',
  header: '#0f172a' // Dark Navy
};

// A hidden component for generating the PDF layout
const DischargeSummaryPDF = React.forwardRef(({ patient, summaryDetails }, ref) => {
  if (!patient) return null;
  return (
    <Box ref={ref} sx={{ p: 4, width: '210mm', height: '297mm', color: 'black', bgcolor: 'white' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom="2px solid black" pb={2}>
        <Typography variant="h4" fontWeight="bold">Hospital Discharge Summary</Typography>
        <Typography variant="subtitle1">KNexis Medical Center</Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>Patient Information</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}><Typography><strong>Patient Name:</strong> {patient.name}</Typography></Grid>
          <Grid item xs={6}><Typography><strong>UHID:</strong> {patient._id.substring(18).toUpperCase()}</Typography></Grid>
          <Grid item xs={6}><Typography><strong>Age / Gender:</strong> {patient.age} / {patient.gender}</Typography></Grid>
          <Grid item xs={6}><Typography><strong>Blood Group:</strong> {patient.bloodGroup}</Typography></Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h6" gutterBottom>Clinical Summary</Typography>
        <Typography><strong>Date of Admission:</strong> {new Date().toLocaleDateString()}</Typography>
        <Typography><strong>Date of Discharge:</strong> {new Date().toLocaleDateString()}</Typography>
        <Typography mt={2}><strong>Final Diagnosis:</strong> {summaryDetails.diagnosis}</Typography>
        <Typography mt={2}><strong>Critical Allergies:</strong></Typography>
        <Box pl={2}>
          {(patient.allergies || []).map(allergy => <Typography key={allergy}>- {allergy}</Typography>)}
          {(patient.allergies || []).length === 0 && <Typography>- No Known Allergies</Typography>}
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h6" gutterBottom>Discharge Instructions</Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{summaryDetails.instructions}</Typography>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 40, right: 40, textAlign: 'center' }}>
        <Typography>_________________________</Typography>
        <Typography>Dr. John Smith, MD</Typography>
        <Typography>Attending Physician</Typography>
      </Box>
    </Box>
  );
});

const PatientProfileView = ({ patient, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const [billing, setBilling] = useState({ invoices: [], loading: true });
  const [privacySettings, setPrivacySettings] = useState({ portalSync: false, dataMasking: false });
  const [auditLog, setAuditLog] = useState({ logs: [], loading: true });
  const [summaryDetails, setSummaryDetails] = useState({
    diagnosis: 'Condition Stable',
    instructions: 'Patient advised to take complete rest for 3 days.\nFollow-up appointment scheduled after one week.\nContinue prescribed medication as advised.'
  });
  const summaryRef = React.useRef();

  useEffect(() => {
    // Fetch billing data when the billing tab is opened
    const fetchBilling = async () => {
      if (!patient) return;
      setBilling({ invoices: [], loading: true });
      try {
        // In a real-world scenario, an optimized endpoint like /api/billing/patient/:patientId is preferred.
        // Here, we fetch all company invoices and filter client-side as a workaround.
        const { data } = await api.get('/billing/invoices');
        const patientInvoices = data.filter(inv => inv.customerName.toLowerCase() === patient.name.toLowerCase());
        setBilling({ invoices: patientInvoices, loading: false });
      } catch (err) {
        console.error("Failed to fetch billing data", err);
        setBilling({ invoices: [], loading: false });
      }
    };

    if (tabValue === 1) { // Corresponds to "Billing & Insurance" tab
      fetchBilling();
    }

    const fetchAuditLog = async () => {
      if (!patient) return;
      setAuditLog({ logs: [], loading: true });
      try {
        const { data } = await api.get(`/audit-logs/patient/${patient._id}`);
        setAuditLog({ logs: data, loading: false });
      } catch (err) {
        console.error("Failed to fetch audit log", err);
        setAuditLog({ logs: [], loading: false });
      }
    };
    if (tabValue === 2) { // Corresponds to "Privacy & Security" tab
      fetchAuditLog();
    }
  }, [patient, tabValue]);

  useEffect(() => {
    // Initialize privacy settings from patient data when the component loads
    if (patient && patient.privacySettings) {
      setPrivacySettings(patient.privacySettings);
    }
  }, [patient]);

  if (!patient) return null;

  const handlePrivacyChange = async (event) => {
    const { name, checked } = event.target;
    const updatedSettings = { ...privacySettings, [name]: checked };
    setPrivacySettings(updatedSettings);
    // Persist changes to the backend
    await api.put(`/patients/${patient._id}/privacy`, updatedSettings);
  };
  
  const handleGeneratePDF = async () => {
    const element = summaryRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${patient.name}_Discharge_Summary.pdf`);
  };

  return (
    <Dialog fullScreen open={Boolean(patient)} onClose={onClose} TransitionComponent={Transition}>
      <AppBar elevation={0} sx={{ position: 'relative', bgcolor: themeColors.header, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}><Close /></IconButton>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: -0.5 }}>{patient.name}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              UHID: {patient._id.substring(18).toUpperCase()} • {patient.gender} • {patient.bloodGroup || 'N/A'}
            </Typography>
          </Box>
          <Button onClick={handleGeneratePDF} variant="contained" disableElevation sx={{ bgcolor: themeColors.primary, borderRadius: '8px' }}>
            Generate Discharge Summary
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: themeColors.background, minHeight: '100vh' }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{ width: 100, height: 100, mx: 'auto', bgcolor: '#e0f2fe', color: themeColors.primary, fontSize: '2rem', fontWeight: 'bold' }}>
                  {patient.name[0]}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>{patient.name}</Typography>
                <Chip label={patient.status === 'Admitted' ? `Admitted: ${patient.location || 'Ward 4B'}` : 'Outpatient'} size="small" sx={{ mt: 1, bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
                
                <Box sx={{ mt: 3, textAlign: 'left', px: 2 }}>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>CONTACT INFO</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>{patient.contact}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{patient.email}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Tabs orientation="vertical" value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ 
                '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', py: 2, fontWeight: 600 },
                '& .Mui-selected': { bgcolor: '#f1f5f9', color: themeColors.primary }
              }}>
                <Tab icon={<MonitorHeart sx={{ mr: 1 }} />} label="Clinical Dashboard" iconPosition="start" />
                <Tab icon={<ReceiptLong sx={{ mr: 1 }} />} label="Billing & Insurance" iconPosition="start" />
                <Tab icon={<Security sx={{ mr: 1 }} />} label="Privacy & Security" iconPosition="start" />
                <Tab icon={<Save sx={{ mr: 1 }} />} label="Discharge Planning" iconPosition="start" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={9}>
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <MonitorHeart sx={{ mr: 1, color: '#ef4444' }} /> Vital Signs Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={patient.vitals || []}>
                        <defs>
                          <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="recordedAt" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fillOpacity={1} fill="url(#colorHr)" name="Heart Rate" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Clinical SOAP Notes</Typography>
                      <TextField fullWidth multiline rows={6} placeholder="Describe patient condition..." variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }}} />
                      <Button variant="contained" disableElevation startIcon={<Save />} sx={{ mt: 2, borderRadius: '8px', bgcolor: themeColors.header }}>Update Note</Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #fee2e2', bgcolor: '#fffafb' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: '#b91c1c', fontWeight: 700, display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Warning sx={{ mr: 1 }} /> Critical Allergies
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {(patient.allergies || []).length > 0 ? patient.allergies.map((a) => (
                          <Chip key={a} label={a} sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 600, borderRadius: '6px' }} />
                        )) : <Typography variant="body2" color="textSecondary">No known allergies.</Typography>}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            {tabValue === 1 && (
              <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Billing & Insurance</Typography>
                  <Box mb={3} p={2} bgcolor="#f1f5f9" borderRadius={2}>
                    <Typography variant="subtitle2"><strong>Insurance Provider:</strong> United Health</Typography>
                    <Typography variant="caption">Policy #: {patient._id.substring(10, 20).toUpperCase()} | Coverage: 80%</Typography>
                  </Box>
                  {billing.loading ? <CircularProgress /> : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Service</TableCell><TableCell align="right">Amount</TableCell><TableCell align="right">Status</TableCell></TableRow></TableHead>
                        <TableBody>
                          {billing.invoices.map(row => (
                            <TableRow key={row._id}>
                              <TableCell>{new Date(row.issueDate).toLocaleDateString()}</TableCell>
                              <TableCell>{row.items.map(i => i.description).join(', ')}</TableCell>
                              <TableCell align="right">${row.totalAmount.toLocaleString()}</TableCell>
                              <TableCell align="right"><Chip label={row.status} color={row.status === 'Paid' ? 'success' : 'warning'} size="small" /></TableCell>
                            </TableRow>
                          ))}
                           {billing.invoices.length === 0 && <TableRow><TableCell colSpan={4} align="center">No billing records found for this patient.</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            )}
            {tabValue === 2 && (
              <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Privacy & Security Controls</Typography>
                  <FormControlLabel 
                    control={<Switch checked={privacySettings.portalSync} onChange={handlePrivacyChange} name="portalSync" />} 
                    label="Enable Patient Portal Sync" 
                    sx={{ mb: 2, display: 'block' }} 
                  />
                  <FormControlLabel 
                    control={<Switch checked={privacySettings.dataMasking} onChange={handlePrivacyChange} name="dataMasking" />} 
                    label="Mask Sensitive Data (Role-Based Access)" 
                    sx={{ mb: 4, display: 'block' }} 
                  />
                  <Divider />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 3 }}>Audit Trail</Typography>
                  {auditLog.loading ? <CircularProgress size={24} /> : (
                    <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {auditLog.logs.map(log => (
                        <ListItem key={log._id}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: themeColors.secondary }}>
                              {log.userName ? log.userName.charAt(0) : 'S'}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${log.action.replace(/_/g, ' ')}`}
                            secondary={`${log.userName} • ${new Date(log.createdAt).toLocaleString()}`}
                          />
                        </ListItem>
                      ))}
                      {auditLog.logs.length === 0 && <Typography variant="body2" color="textSecondary">No audit records found.</Typography>}
                    </List>
                  )}
                </CardContent>
              </Card>
            )}
            {tabValue === 3 && (
              <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Edit Discharge Summary</Typography>
                  <TextField
                    label="Final Diagnosis"
                    fullWidth
                    value={summaryDetails.diagnosis}
                    onChange={(e) => setSummaryDetails({...summaryDetails, diagnosis: e.target.value})}
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    label="Discharge Instructions & Notes"
                    fullWidth
                    multiline
                    rows={8}
                    value={summaryDetails.instructions}
                    onChange={(e) => setSummaryDetails({...summaryDetails, instructions: e.target.value})}
                  />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Hidden component for PDF generation */}
        <Box sx={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <DischargeSummaryPDF ref={summaryRef} patient={patient} summaryDetails={summaryDetails} />
        </Box>
      </Box>
    </Dialog>
  );
};

const AddPatientModal = ({ open, onClose, onSave, patientToEdit }) => {
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    email: '',
    bloodGroup: '',
    allergies: '', // Will be a comma-separated string from input
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPatient.name || !newPatient.age || !newPatient.contact) {
      setError('Name, Age, and Contact are required.');
      return;
    }
    try {
      const payload = {
        ...newPatient,
        allergies: newPatient.allergies.split(',').map(a => a.trim()).filter(a => a), // Convert string to array
      };

      let res;
      if (patientToEdit) {
        res = await api.put(`/patients/${patientToEdit._id}`, payload);
      } else {
        res = await api.post('/patients', payload);
      }
      
      onSave(res.data, !!patientToEdit);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save patient.');
    }
  };

  useEffect(() => {
    if (open && patientToEdit) {
      setNewPatient({ ...patientToEdit, allergies: patientToEdit.allergies ? patientToEdit.allergies.join(', ') : '' });
    } else if (!open) {
      setNewPatient({ name: '', age: '', gender: 'Male', contact: '', email: '', bloodGroup: '', allergies: '' });
    }
    setError('');
  }, [open, patientToEdit]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', borderRadius: '12px', boxShadow: 24, p: 4, outline: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{patientToEdit ? 'Edit Patient Details' : 'Register New Patient'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Full Name" name="name" value={newPatient.name} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Age" name="age" type="number" value={newPatient.age} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth select label="Gender" name="gender" value={newPatient.gender} onChange={handleChange}><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem></TextField></Grid>
            <Grid item xs={12}><TextField fullWidth label="Contact Number" name="contact" value={newPatient.contact} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Blood Group" name="bloodGroup" value={newPatient.bloodGroup} onChange={handleChange} placeholder="e.g., O+" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Allergies" name="allergies" value={newPatient.allergies} onChange={handleChange} placeholder="e.g., Penicillin, Sulfa" helperText="Comma-separated" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email Address" name="email" type="email" value={newPatient.email} onChange={handleChange} /></Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="contained" disableElevation sx={{ bgcolor: themeColors.primary }}>{patientToEdit ? 'Update' : 'Register'}</Button></Box>
        </form>
      </Box>
    </Modal>
  );
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/patients');
        setPatients(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = (savedPatient, isEdit) => {
    if (isEdit) {
      setPatients(prev => prev.map(p => p._id === savedPatient._id ? savedPatient : p));
    } else {
      setPatients(prev => [savedPatient, ...prev]);
    }
  };

  const handleEditClick = (patient) => {
    setPatientToEdit(patient);
    setOpenAdd(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        await api.delete(`/patients/${id}`);
        setPatients(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete patient');
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress thickness={5} sx={{ color: themeColors.primary }} /></Box>;

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: themeColors.background, minHeight: '100vh' }}>
      {/* Page Header */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: themeColors.header, letterSpacing: '-1px' }}>
            Patient Registry
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your medical records and patient EMR data
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          disableElevation
          startIcon={<PersonAdd />} 
            onClick={() => {
              setPatientToEdit(null);
              setOpenAdd(true);
            }}
          sx={{ bgcolor: themeColors.primary, borderRadius: '10px', px: 3, py: 1.5, fontWeight: 700, textTransform: 'none' }}
        >
          Add New Patient
        </Button>
      </Box>

      {/* Main Controls */}
      <Card elevation={0} sx={{ p: 2, mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: 2 }}>
        <TextField 
          placeholder="Search by name, UHID, or phone..." 
          fullWidth 
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            sx: { borderRadius: '10px', bgcolor: '#f1f5f9', border: 'none' }
          }}
        />
        <Button variant="outlined" sx={{ borderRadius: '10px', borderColor: '#e2e8f0', color: themeColors.secondary }} startIcon={<FilterList />}>
          Filter
        </Button>
      </Card>

      {/* Table Area */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: themeColors.secondary }}>PATIENT NAME</TableCell>
              <TableCell sx={{ fontWeight: 700, color: themeColors.secondary }}>CONTACT</TableCell>
              <TableCell sx={{ fontWeight: 700, color: themeColors.secondary }}>AGE / GENDER</TableCell>
              <TableCell sx={{ fontWeight: 700, color: themeColors.secondary }}>STATUS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: themeColors.secondary }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: themeColors.primary, fontSize: '0.8rem', fontWeight: 700 }}>{p.name[0]}</Avatar>
                    <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{p.contact}</TableCell>
                <TableCell>{p.age} Yrs / {p.gender}</TableCell>
                <TableCell><Chip label="Active" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }} /></TableCell>
                <TableCell align="right">
                  <Tooltip title="View Medical Record">
                    <IconButton size="small" onClick={() => setSelectedPatient(p)} sx={{ color: themeColors.primary, bgcolor: '#f0f9ff', ml: 1 }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Details">
                    <IconButton size="small" onClick={() => handleEditClick(p)} sx={{ color: themeColors.secondary, ml: 1 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Record">
                    <IconButton size="small" onClick={() => handleDeleteClick(p._id)} sx={{ color: '#ef4444', ml: 1 }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Components */}
      <PatientProfileView patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      <AddPatientModal 
        open={openAdd} 
        onClose={() => { setOpenAdd(false); setPatientToEdit(null); }} 
        onSave={handleSave}
        patientToEdit={patientToEdit}
      />
    </Container>
  );
};

export default Patients;