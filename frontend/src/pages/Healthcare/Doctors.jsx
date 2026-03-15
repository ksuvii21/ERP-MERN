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
import Patients, { PatientProfileView } from './Patients'; // Ensure PatientProfileView is exported from Patients.jsx

// Helper to process schedule data from real appointments
const getScheduleData = (appointments) => {
  const hours = Array(10).fill(0).map((_, i) => ({ hour: `${i + 8}:00`, appointments: 0 })); // 8 AM to 5 PM
  if (Array.isArray(appointments)) {
    appointments.forEach(app => {
      const appHour = new Date(app.startTime).getHours();
      const index = appHour - 8;
      if (index >= 0 && index < hours.length) {
        hours[index].appointments++;
      }
    });
  }
  return hours;
};

const Doctors = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Clinical, 1: Admin Management
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]); // For Admin View
  const [columns, setColumns] = useState({
    waiting: { name: 'Waiting Room', items: [] },
    inConsultation: { name: 'In Consultation', items: [] },
    completed: { name: 'Completed', items: [] },
  });
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // State for the selected patient profile

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
        waiting: { name: 'Waiting Room', items: data.filter(a => a.status === 'Waiting' || a.status === 'Scheduled') },
        inConsultation: { name: 'In Consultation', items: data.filter(a => a.status === 'In-Consultation') },
        completed: { name: 'Completed', items: data.filter(a => a.status === 'Completed') },
      });

      setScheduleData(getScheduleData(data));

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

  // --- Drag & Drop logic ---
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    // Optimistic UI Update
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({ ...columns, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
    } else {
      const destItems = [...destColumn.items];
      destItems.splice(destination.index, 0, removed);
      // Update local state first
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
      
      // Call API to persist status change
      try {
        let newStatus = 'Waiting';
        if (destination.droppableId === 'inConsultation') newStatus = 'In-Consultation';
        if (destination.droppableId === 'completed') newStatus = 'Completed';
        
        await api.put(`/appointments/${draggableId}/status`, { status: newStatus });
      } catch (err) {
        console.error("Failed to update status", err);
        // Revert on failure (optional but recommended)
      }
    }
  };

  const handleCardClick = (patient) => {
    if (patient) {
        setSelectedPatient(patient);
    }
  };

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
          {/* Main Content: Appointment Queue */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>Daily Appointment Queue</Typography>
            {loading ? <CircularProgress /> : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={2}>
                  {Object.entries(columns).map(([columnId, column]) => (
                    <Grid item xs={12} md={4} key={columnId}>
                      <Paper sx={{ bgcolor: '#fff', p: 2, borderRadius: '12px', height: '100%', border: '1px solid #e2e8f0' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          {columnId === 'waiting' && <Clock size={18} color="#f59e0b" />}
                          {columnId === 'inConsultation' && <UserCheck size={18} color="#3b82f6" />}
                          {columnId === 'completed' && <CheckCircle size={18} color="#16a34a" />}
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{column.name}</Typography>
                          <Chip label={column.items.length} size="small" sx={{ ml: 'auto' }} />
                        </Box>
                        <Droppable droppableId={columnId}>
                          {(provided, snapshot) => (
                            <Box
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              sx={{
                                minHeight: '400px',
                                transition: 'background-color 0.2s ease',
                                bgcolor: snapshot.isDraggingOver ? '#f0f9ff' : 'transparent',
                                borderRadius: '8px',
                                p: 0.5
                              }}
                            >
                              {column.items.map((item, index) => (
                                <Draggable key={item._id} draggableId={item._id} index={index}>
                                  {(provided) => (
                                    <Paper
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => handleCardClick(item.patient)}
                                      sx={{ 
                                        p: 2, 
                                        mb: 1.5, 
                                        borderRadius: '8px', 
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
                                      }}
                                    >
                                      <Typography sx={{ fontWeight: 600 }}>{item.patient?.name || 'Unknown Patient'}</Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {item.patient?.age || 'N/A'} Yrs • {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </Typography>
                                    </Paper>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </DragDropContext>
            )}
          </Grid>

          {/* Right Sidebar: Alerts & Schedule */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, borderRadius: '12px', mb: 3, border: '1px solid #e2e8f0' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AlertTriangle size={20} color="#ef4444" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155' }}>Critical Alerts</Typography>
              </Box>
              <List dense>
                 {/* Real data implementation: Show placeholder if no alerts logic exists yet */}
                 <ListItem>
                    <ListItemText primary="No critical alerts at this moment." secondary="System monitoring active." />
                 </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Calendar size={20} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155' }}>Today's Schedule Load</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scheduleData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="appointments" radius={[4, 4, 0, 0]} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
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
      
      {/* Patient Profile View Modal */}
      {selectedPatient && (
        <PatientProfileView 
            patient={selectedPatient} 
            onClose={() => setSelectedPatient(null)} 
        />
      )}
    </Container>
  );
};

export default Doctors;
