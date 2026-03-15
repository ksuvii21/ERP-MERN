import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Avatar, Chip,
  CircularProgress, List, ListItem, ListItemAvatar, ListItemText, 
  Divider, Button, IconButton, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Card, CardContent, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Tabs, Tab
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Clock, UserCheck, CheckCircle, Calendar, Plus, Trash2, Edit, Stethoscope, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';

const Doctors = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Clinical, 1: Admin Management
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]); // For Admin View
  const [columns, setColumns] = useState({
    waiting: { name: 'Waiting Room', items: [] },
    inConsultation: { name: 'In Consultation', items: [] },
    completed: { name: 'Completed', items: [] },
  });

  // --- Doctor Management State ---
  const [openDocModal, setOpenDocModal] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', specialty: '', email: '', phone: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch Appointments for Clinical View
      const appRes = await api.get('/appointments');
      const data = appRes.data;
      
      setColumns({
        waiting: { name: 'Waiting Room', items: data.filter(a => a.status === 'Waiting') },
        inConsultation: { name: 'In Consultation', items: data.filter(a => a.status === 'In-Consultation') },
        completed: { name: 'Completed', items: data.filter(a => a.status === 'Completed') },
      });

      // Fetch Doctors for Admin View
      const docRes = await api.get('/doctors');
      setDoctors(docRes.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Admin Functions: Add/Delete Doctor ---
  const handleAddDoctor = async () => {
    try {
      const res = await api.post('/doctors', docForm);
      setDoctors([...doctors, res.data]);
      setOpenDocModal(false);
      setDocForm({ name: '', specialty: '', email: '', phone: '' });
    } catch (err) { alert("Failed to add doctor"); }
  };

  const handleDeleteDoctor = async (id) => {
    if(window.confirm("Are you sure?")) {
      await api.delete(`/doctors/${id}`);
      setDoctors(doctors.filter(d => d._id !== id));
    }
  };

  // --- Drag & Drop logic (Keep your existing onDragEnd here) ---
  const onDragEnd = (result) => { /* Your existing logic */ };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Dynamic Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-1px' }}>
            {activeTab === 0 ? "Clinical Control Tower" : "Staff Management"}
          </Typography>
          <Typography color="text.secondary">
            {activeTab === 0 ? "Real-time patient flow & critical alerts" : "Manage hospital medical staff and credentials"}
          </Typography>
        </Box>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ bgcolor: '#fff', borderRadius: '12px', p: 0.5, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <Tab icon={<Stethoscope size={18} />} label="Clinical" />
          <Tab icon={<ShieldCheck size={18} />} label="Admin" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        /* --- CLINICAL VIEW (Your original DND + Schedule) --- */
        <Grid container spacing={3}>
           {/* Place your existing Grid items for DragDropContext and Sidebar here */}
           {/* ... (Keep your previous logic here for the patient queue) */}
        </Grid>
      ) : (
        /* --- ADMIN VIEW: DOCTOR MANAGEMENT --- */
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              startIcon={<Plus />} 
              onClick={() => setOpenDocModal(true)}
              sx={{ borderRadius: '10px', bgcolor: '#3b82f6', textTransform: 'none', fontWeight: 600 }}
            >
              Register New Doctor
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell><strong>Doctor Name</strong></TableCell>
                  <TableCell><strong>Specialty</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doc) => (
                  <TableRow key={doc._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>{doc.name[0]}</Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{doc.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={doc.specialty} size="small" variant="outlined" /></TableCell>
                    <TableCell>{doc.email}</TableCell>
                    <TableCell><Chip label="On-Duty" color="success" size="small" sx={{ fontWeight: 600 }} /></TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="small"><Edit size={16} /></IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDeleteDoctor(doc._id)}><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Register Doctor Modal */}
      <Dialog open={openDocModal} onClose={() => setOpenDocModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Add Medical Staff</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Full Name" fullWidth variant="outlined" value={docForm.name} onChange={(e) => setDocForm({...docForm, name: e.target.value})} />
            <TextField label="Specialization" fullWidth variant="outlined" value={docForm.specialty} onChange={(e) => setDocForm({...docForm, specialty: e.target.value})} />
            <TextField label="Email Address" fullWidth variant="outlined" value={docForm.email} onChange={(e) => setDocForm({...docForm, email: e.target.value})} />
            <TextField label="Mobile Number" fullWidth variant="outlined" value={docForm.phone} onChange={(e) => setDocForm({...docForm, phone: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDocModal(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleAddDoctor} variant="contained" disableElevation sx={{ borderRadius: '8px', px: 4 }}>Save Doctor</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Doctors;