import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import {
  Box, Container, Grid, Paper, Typography, Button, TextField, MenuItem,
  IconButton, Tooltip, Card, CardContent, Avatar, Chip, Popover,
  CircularProgress, Drawer, Divider, Alert
} from '@mui/material';
import {
  Add, FilterList, CheckCircle, Cancel, AccessTime, Person, MoreVert,
  LocalHospital, AttachMoney, TrendingUp, Info, Search
} from '@mui/icons-material';
import api from '../../utils/api';

// --- Configuration ---
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop(Calendar);

const STATUS_COLORS = {
  'Scheduled': '#3b82f6', // Blue
  'Waiting': '#eab308',   // Yellow
  'In-Consultation': '#22c55e', // Green
  'Completed': '#64748b', // Grey
  'Cancelled': '#ef4444', // Red
};

// --- Custom Event Component (Interactive Card) ---
const AppointmentEvent = ({ event, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handlePopoverOpen = (e) => setAnchorEl(e.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <Box
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      onClick={(e) => e.stopPropagation()} // Prevent calendar click-through
      sx={{
        bgcolor: STATUS_COLORS[event.status] || '#3b82f6',
        color: 'white',
        borderRadius: '4px',
        p: 0.5,
        height: '100%',
        fontSize: '0.75rem',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.1s',
        '&:hover': { transform: 'scale(1.02)', zIndex: 10 }
      }}
    >
      <Box display="flex" alignItems="center" gap={0.5}>
        <Box flexGrow={1}>
          <Typography variant="caption" fontWeight="bold" noWrap>{event.title}</Typography>
          <Typography variant="caption" display="block" noWrap>{event.doctorName}</Typography>
        </Box>
        <IconButton size="small" sx={{ color: 'white', p: 0.2 }} onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
          <MoreVert fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Status Change Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        {Object.keys(STATUS_COLORS).map(status => (
          <MenuItem 
            key={status} 
            onClick={() => { onStatusChange(event.id, status); setMenuAnchorEl(null); }}
            disabled={event.status === status}
          >
            <Chip label={status} size="small" sx={{ bgcolor: STATUS_COLORS[status], color: 'white' }} />
          </MenuItem>
        ))}
      </Menu>

      {/* Hover Preview Popover */}
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box p={2} maxWidth={250}>
          <Typography variant="subtitle2" fontWeight="bold">{event.patientName}</Typography>
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            {event.desc}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption"><strong>Status:</strong> {event.status}</Typography>
          <br />
          <Typography variant="caption"><strong>Last Visit:</strong> 12 days ago</Typography>
          <br />
          <Typography variant="caption"><strong>Balance:</strong> $0.00</Typography>
        </Box>
      </Popover>
    </Box>
  );
};

const Appointments = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  
  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });

  // New Appointment Form
  const [formData, setFormData] = useState({
    patientName: '', // In real app, use ID
    doctorName: '',  // In real app, use ID
    startTime: new Date(),
    duration: 30, // minutes
    reason: ''
  });

  // Memoized filtering for real-time search without backend calls
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const searchMatch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'All' || event.status === statusFilter;
      const doctorMatch = doctorFilter === 'All' || event.doctorName === doctorFilter;

      return searchMatch && statusMatch && doctorMatch;
    });
  }, [events, searchTerm, statusFilter, doctorFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]); // Refetch when month changes (simplified logic)

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Fetch current month + padding
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1).toISOString();
      const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 2, 0).toISOString();
      
      const { data } = await api.get(`/appointments?start=${start}&end=${end}`);
      
      const formattedEvents = data.map(app => ({
        id: app._id,
        title: app.patient?.name || 'Unknown Patient',
        patientName: app.patient?.name,
        doctorName: app.doctor?.name || 'General Doctor',
        start: new Date(app.startTime),
        end: new Date(new Date(app.startTime).getTime() + (30 * 60000)), // Default 30 mins
        status: app.status,
        desc: app.reason || 'Regular Checkup'
      }));

      setEvents(formattedEvents);

      // Calculate Stats (Mock Revenue logic)
      setStats({
        total: formattedEvents.length,
        pending: formattedEvents.filter(e => e.status === 'Scheduled').length,
        revenue: formattedEvents.filter(e => e.status === 'Completed').length * 150 // $150 per visit
      });

    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const originalEvents = [...events];
    // Optimistic Update
    const updatedEvents = events.map(e => e.id === event.id ? { ...e, start, end } : e);
    setEvents(updatedEvents);

    try {
      await api.put(`/appointments/${event.id}/reschedule`, { startTime: start, endTime: end });
    } catch (error) {
      console.error("Reschedule failed, reverting.", error);
      setEvents(originalEvents); // Revert on failure
      alert("Could not reschedule appointment. Please try again.");
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    const originalEvents = [...events];
    // Optimistic UI update
    const updatedEvents = events.map(e => 
      e.id === eventId ? { ...e, status: newStatus } : e
    );
    setEvents(updatedEvents);

    try {
      await api.put(`/appointments/${eventId}/status`, { status: newStatus });
    } catch (error) {
      console.error("Status update failed, reverting.", error);
      setEvents(originalEvents); // Revert on failure
      console.error("Reschedule failed", error);
      fetchAppointments(); // Revert
    }
  };

  const handleAddAppointment = async () => {
    try {
      // Mock submission - In real app, search for patient/doctor IDs
      await api.post('/appointments', {
        patient: '65f1a2b3c4d5e6f7a8b9c0d1', // Mock ID
        doctor: '65f1a2b3c4d5e6f7a8b9c0d2',  // Mock ID
        startTime: formData.startTime,
        reason: formData.reason,
        status: 'Scheduled',
        company: '65f1a2b3c4d5e6f7a8b9c0d0' // Mock ID
      });
      setDrawerOpen(false);
      fetchAppointments();
    } catch (error) {
      alert("Booking failed (Ensure IDs are valid in backend)");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header & HUD */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="800" color="#0f172a">Appointments</Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => setDrawerOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            New Booking
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}><LocalHospital /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{stats.total}</Typography>
                <Typography variant="caption" color="textSecondary">Total Visits</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
              <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a' }}><AttachMoney /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">${stats.revenue}</Typography>
                <Typography variant="caption" color="textSecondary">Est. Revenue</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
              <Avatar sx={{ bgcolor: '#fefce8', color: '#ca8a04' }}><AccessTime /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{stats.pending}</Typography>
                <Typography variant="caption" color="textSecondary">Pending</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
              <Avatar sx={{ bgcolor: '#fee2e2', color: '#dc2626' }}><Cancel /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">12%</Typography>
                <Typography variant="caption" color="textSecondary">No-Show Rate</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filter HUD */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search color="action" sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField select fullWidth size="small" label="Filter by Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All Statuses</MenuItem>
              {Object.keys(STATUS_COLORS).map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField select fullWidth size="small" label="Filter by Doctor" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
              <MenuItem value="All">All Doctors</MenuItem>
              {/* This should be populated from a doctors API call */}
              <MenuItem value="Dr. John Smith">Dr. John Smith</MenuItem>
              <MenuItem value="Dr. Jane Doe">Dr. Jane Doe</MenuItem>
              <MenuItem value="General Doctor">General Doctor</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Calendar Area */}
      <Paper sx={{ flex: 1, p: 2, borderRadius: 3, overflow: 'hidden' }}>
        <DnDCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onEventDrop={handleEventDrop}
          components={{
            event: (props) => <AppointmentEvent {...props} onStatusChange={handleStatusChange} />
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: 'transparent', // Let component handle bg
              border: 'none',
              padding: 0
            }
          })}
          onNavigate={date => setSelectedDate(date)}
          views={['month', 'week', 'day']}
          defaultView='week'
          min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8 AM
          max={new Date(0, 0, 0, 19, 0, 0)} // End at 7 PM
        />
      </Paper>

      {/* Quick Booking Drawer (Split Screen Feel) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400, p: 3 } }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>New Appointment</Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Search for a patient or create a new profile.
        </Typography>

        <Box display="flex" flexDirection="column" gap={3} mt={2}>
            {/* Intelligent Search Simulation */}
            <TextField 
                label="Search Patient (Name/UHID)" 
                InputProps={{
                    endAdornment: <Search color="action" />
                }}
                fullWidth 
            />
            
            <Alert severity="info" icon={<Info />}>
                <strong>AI Suggestion:</strong> Dr. Smith has an open slot at 2:30 PM.
            </Alert>

            <TextField
                label="Start Time"
                type="datetime-local"
                value={formData.startTime.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({...formData, startTime: new Date(e.target.value)})}
                fullWidth
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                select
                label="Appointment Type"
                value="General"
                fullWidth
            >
                <MenuItem value="General">General Consultation</MenuItem>
                <MenuItem value="FollowUp">Follow-up</MenuItem>
                <MenuItem value="Urgent">Urgent / Acute</MenuItem>
            </TextField>

            <TextField
                label="Chief Complaint"
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                fullWidth
            />

            <Button variant="contained" size="large" onClick={handleAddAppointment}>
                Confirm Booking
            </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Appointments;