import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, CircularProgress, Box, Grid, TextField, Autocomplete,
  Avatar, Chip, Fab, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton, Tooltip, Button
} from '@mui/material';
import {
  Search, EventNote, Science, LocalPharmacy, Healing, MonitorHeart, EditNote, Bloodtype,
  Add as AddIcon, WarningAmber
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';

// --- Sub-components for the EMR Dashboard ---

const StickyPatientHeader = ({ patient }) => (
  <Paper
    elevation={2}
    sx={{
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      p: 2,
      mb: 3,
      bgcolor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}
  >
    <Avatar sx={{ width: 56, height: 56, bgcolor: '#e0f2fe', color: '#0ea5e9' }}>{patient.name[0]}</Avatar>
    <Box flexGrow={1}>
      <Typography variant="h5" fontWeight="bold">{patient.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {patient.age} Yrs / {patient.gender} / {patient.bloodGroup || 'N/A'}
      </Typography>
    </Box>
    {(patient.allergies && patient.allergies.length > 0) && (
      <Chip
        icon={<WarningAmber />}
        label={`Allergies: ${patient.allergies.join(', ')}`}
        color="error"
        variant="filled"
      />
    )}
  </Paper>
);

const HealthTimeline = ({ events }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'VisitSummary': return <EventNote color="primary" />;
      case 'LabResult': return <Science color="secondary" />;
      case 'Prescription': return <LocalPharmacy color="success" />;
      case 'Vitals': return <MonitorHeart color="error" />;
      default: return <Healing />;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Health Timeline</Typography>
      <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {events.map(event => (
          <ListItem key={event._id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#f1f5f9' }}>{getIcon(event.eventType)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle2" fontWeight="bold">{event.eventType.replace(/([A-Z])/g, ' $1').trim()}</Typography>}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {event.data.summary || event.data.testName || `BP: ${event.data.bp}`}
                  </Typography>
                  <br />
                  {new Date(event.eventDate).toLocaleString()} — by {event.recordedBy?.name || 'System'}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

const VitalsDashboard = ({ records }) => {
  const vitalsData = records
    .filter(r => r.eventType === 'Vitals')
    .map(r => ({ ...r.data, time: new Date(r.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }))
    .reverse();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Vitals Monitoring</Typography>
      {vitalsData.length === 0 ? (
        <Typography color="text.secondary">No vitals recorded for this period.</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={vitalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <RechartsTooltip />
            <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate" />
            <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#3b82f6" name="Temperature" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

const LabResults = ({ records }) => {
  const labData = records.filter(r => r.eventType === 'LabResult');

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Recent Lab Results</Typography>
      {labData.length === 0 ? (
        <Typography color="text.secondary">No lab results on record.</Typography>
      ) : (
        <Grid container spacing={2}>
          {(labData[0]?.data.results || []).map((result, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: result.isAbnormal ? '#fffbeB' : 'transparent' }}>
                <Typography variant="caption" color="text.secondary">{result.name}</Typography>
                <Typography variant="h5" fontWeight="bold" color={result.isAbnormal ? 'error.main' : 'text.primary'}>
                  {result.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">{result.unit}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

const Prescriptions = ({ records }) => {
  const prescriptions = records.filter(r => r.eventType === 'Prescription');

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Medication Management</Typography>
      {prescriptions.length === 0 ? (
        <Typography color="text.secondary">No prescriptions on record.</Typography>
      ) : (
        prescriptions.map(presc => (
          <Box key={presc._id} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {presc.data.medication} {presc.data.dosage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Instructions: {presc.data.instructions}
            </Typography>
            <Chip
              label={presc.data.status || 'Active'}
              color={presc.data.status === 'Past' ? 'default' : 'success'}
              size="small"
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
              Prescribed by {presc.recordedBy?.name} on {new Date(presc.eventDate).toLocaleDateString()}
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  );
};

const SoapNoteInterface = ({ patient, onSave }) => {
  const [note, setNote] = useState({ subjective: '', objective: '', assessment: '', plan: '' });

  const handleSave = () => {
    onSave({
      patient: patient._id,
      eventType: 'Note',
      data: { type: 'SOAP', ...note },
      eventDate: new Date(),
    });
    setNote({ subjective: '', objective: '', assessment: '', plan: '' }); // Clear form
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>SOAP Note</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField label="Subjective" fullWidth multiline rows={2} value={note.subjective} onChange={e => setNote({...note, subjective: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField label="Objective" fullWidth multiline rows={2} value={note.objective} onChange={e => setNote({...note, objective: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField label="Assessment" fullWidth multiline rows={2} value={note.assessment} onChange={e => setNote({...note, assessment: e.target.value})} /></Grid>
        <Grid item xs={12}><TextField label="Plan" fullWidth multiline rows={2} value={note.plan} onChange={e => setNote({...note, plan: e.target.value})} /></Grid>
      </Grid>
      <Button variant="contained" startIcon={<EditNote />} sx={{ mt: 2 }} onClick={handleSave}>Save Note</Button>
    </Paper>
  );
};

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false); // Fix: Don't show loader on initial render
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (selectedPatient) {
      fetchRecordsForPatient(selectedPatient._id);
    }
  }, [selectedPatient]);

  const handleSearchChange = async (event, value) => {
    if (value && value.length > 2) {
      const res = await api.get(`/records/search-patients?term=${value}`);
      setPatientOptions(res.data);
    } else {
      setPatientOptions([]);
    }
  };

  const fetchRecordsForPatient = async (patientId) => {
    setLoading(true);
    try {
      const res = await api.get(`/records/patient/${patientId}`);
      setRecords(res.data);
    } catch (err) {
      console.error('Records fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async (recordData) => {
    try {
      await api.post('/records', recordData);
      // Refetch records to show the new entry
      fetchRecordsForPatient(selectedPatient._id);
    } catch (err) {
      console.error("Failed to save record", err);
      alert("Failed to save record.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>Electronic Medical Records</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Autocomplete
          options={patientOptions}
          getOptionLabel={(option) => option.name}
          onInputChange={handleSearchChange}
          onChange={(event, newValue) => {
            setSelectedPatient(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a patient by name, email, or contact..."
              InputProps={{
                ...params.InputProps,
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Paper>

      {!selectedPatient ? (
        <Box textAlign="center" mt={10}>
          <Typography variant="h6" color="text.secondary">Please search and select a patient to view their records.</Typography>
        </Box>
      ) : loading ? (
        <Box textAlign="center" mt={10}><CircularProgress /></Box>
      ) : (
        <>
          <StickyPatientHeader patient={selectedPatient} />
          <Grid container spacing={3}>
            {/* Left Column: Timeline */}
            <Grid item xs={12} md={4}>
              <HealthTimeline events={records} />
            </Grid>

            {/* Right Column: Dashboards */}
            <Grid item xs={12} md={8}>
              <VitalsDashboard records={records} />
              <LabResults records={records} />
              <Prescriptions records={records} />
              <SoapNoteInterface patient={selectedPatient} onSave={handleSaveRecord} />
            </Grid>
          </Grid>
          <Tooltip title="Add New Record">
            <Fab color="primary" sx={{ position: 'fixed', bottom: 40, right: 40 }}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </>
      )}
    </Container>
  );
};

export default MedicalRecords;