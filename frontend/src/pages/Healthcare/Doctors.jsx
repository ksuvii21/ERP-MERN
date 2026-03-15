import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Avatar, Chip,
  CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Clock, UserCheck, CheckCircle, Calendar } from 'lucide-react';
import api from '../../utils/api';

// Mock data for alerts and schedule, as backend endpoints for these are not yet available.
const MOCK_ALERTS = [
  { id: 'alert-1', patientName: 'John Doe', message: 'Critical Potassium: 6.2 mmol/L', severity: 'high', time: '2m ago' },
  { id: 'alert-2', patientName: 'Jane Smith', message: 'Radiology Report Ready (Chest X-Ray)', severity: 'medium', time: '15m ago' },
  { id: 'alert-3', patientName: 'Peter Jones', message: 'Signature required for discharge', severity: 'low', time: '30m ago' },
];

const getScheduleData = (appointments) => {
  const hours = Array(10).fill(0).map((_, i) => ({ hour: `${i + 8}:00`, appointments: 0 })); // 8 AM to 5 PM
  appointments.forEach(app => {
    const appHour = new Date(app.startTime).getHours();
    const index = appHour - 8;
    if (index >= 0 && index < hours.length) {
      hours[index].appointments++;
    }
  });
  return hours;
};

const DoctorsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState({
    waiting: { name: 'Waiting Room', items: [] },
    inConsultation: { name: 'In Consultation', items: [] },
    completed: { name: 'Completed', items: [] },
  });
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // This assumes an endpoint /api/appointments exists and returns patient details.
        const { data } = await api.get('/appointments');
        
        const waiting = data.filter(a => a.status === 'Waiting' || a.status === 'Scheduled');
        const inConsultation = data.filter(a => a.status === 'In-Consultation');
        const completed = data.filter(a => a.status === 'Completed');

        setColumns({
          waiting: { name: 'Waiting Room', items: waiting },
          inConsultation: { name: 'In Consultation', items: inConsultation },
          completed: { name: 'Completed', items: completed },
        });
        
        setScheduleData(getScheduleData(data));
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        // In case of error, use some mock data to show functionality
        setScheduleData(getScheduleData([]));
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
      });
    } else {
      const destItems = [...destColumn.items];
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
      // Here you would call an API to update the appointment status
      // e.g., api.put(`/appointments/${removed._id}/status`, { status: destColumn.name });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f1f5f9' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>Doctor's Morning Brief</Typography>
        <Typography color="text.secondary">Your clinical control tower for today.</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content: Appointment Queue */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>Daily Appointment Queue</Typography>
          {loading ? <CircularProgress /> : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Grid container spacing={2}>
                {Object.entries(columns).map(([columnId, column]) => (
                  <Grid item xs={12} md={4} key={columnId}>
                    <Paper sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '12px', height: '100%' }}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        {columnId === 'waiting' && <Clock size={18} />}
                        {columnId === 'inConsultation' && <UserCheck size={18} />}
                        {columnId === 'completed' && <CheckCircle size={18} />}
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
                              bgcolor: snapshot.isDraggingOver ? '#e0f2fe' : 'transparent',
                              borderRadius: '8px',
                            }}
                          >
                            {column.items.map((item, index) => (
                              <Draggable key={item._id} draggableId={item._id} index={index}>
                                {(provided) => (
                                  <Paper
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{ p: 2, mb: 1.5, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
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
          {/* Critical Alerts */}
          <Paper sx={{ p: 2, borderRadius: '12px', mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AlertTriangle size={20} color="#ef4444" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155' }}>Critical Alerts</Typography>
            </Box>
            <List dense>
              {MOCK_ALERTS.map(alert => (
                <ListItem key={alert.id} divider sx={{ alignItems: 'flex-start' }}>
                  <ListItemAvatar sx={{ minWidth: 32, mt: 0.5 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: alert.severity === 'high' ? '#fecaca' : '#fed7aa' }}>
                      <AlertTriangle size={14} color={alert.severity === 'high' ? '#b91c1c' : '#c2410c'} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{alert.patientName}</Typography>}
                    secondary={`${alert.message} - ${alert.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Schedule Heatmap */}
          <Paper sx={{ p: 2, borderRadius: '12px' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Calendar size={20} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155' }}>Today's Schedule Load</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scheduleData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="appointments" radius={[4, 4, 0, 0]}>
                  {scheduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.appointments > 3 ? '#ef4444' : entry.appointments > 1 ? '#f97316' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorsDashboard;
