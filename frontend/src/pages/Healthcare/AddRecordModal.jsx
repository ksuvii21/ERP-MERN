import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box,
  TextField, Grid, Alert, Autocomplete, MenuItem, FormControlLabel, Switch, Button
} from '@mui/material';
import { Science, EditNote, LocalPharmacy, MonitorHeart } from '@mui/icons-material';

// Mock Drug Database for interaction check
const DRUG_DATABASE = {
  'Lisinopril': { interactsWith: ['Ibuprofen'] },
  'Metformin': { interactsWith: [] },
  'Amoxicillin': { interactsWith: [] },
  'Ibuprofen': { interactsWith: ['Lisinopril', 'Warfarin'] },
  'Warfarin': { interactsWith: ['Ibuprofen', 'Aspirin'] },
};

const AddRecordModal = ({ open, onClose, patient, onSave, existingPrescriptions }) => {
  const [tabValue, setTabValue] = useState(0);
  const [vitals, setVitals] = useState({ heartRate: '', bp: '', temp: '' });
  const [prescription, setPrescription] = useState({ medication: '', dosage: '', instructions: '', status: 'Active' });
  const [labResult, setLabResult] = useState({ testName: 'Complete Blood Count', results: [{ name: 'Hemoglobin', value: '', unit: 'g/dL', isAbnormal: false }] });
  const [interactionWarning, setInteractionWarning] = useState('');

  const handleSave = () => {
    let recordData;
    switch (tabValue) {
      case 0: // Vitals
        recordData = { eventType: 'Vitals', data: vitals };
        break;
      case 1: // Prescription
        recordData = { eventType: 'Prescription', data: prescription };
        break;
      case 2: // Lab Result
        recordData = { eventType: 'LabResult', data: labResult };
        break;
      default:
        return;
    }
    onSave({ patient: patient._id, ...recordData, eventDate: new Date() });
    onClose();
  };

  const handlePrescriptionChange = (field, value) => {
    const newPrescription = { ...prescription, [field]: value };
    setPrescription(newPrescription);

    // Drug-Drug Interaction Check
    if (field === 'medication' && value) {
      const newDrug = DRUG_DATABASE[value];
      if (!newDrug) {
        setInteractionWarning('');
        return;
      }

      const activeMeds = existingPrescriptions.map(p => p.data.medication);
      const interaction = activeMeds.find(med => newDrug.interactsWith.includes(med));

      if (interaction) {
        setInteractionWarning(`Warning: Potential interaction between ${value} and ${interaction}.`);
      } else {
        setInteractionWarning('');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Medical Record for {patient?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab icon={<MonitorHeart />} label="Vitals" />
            <Tab icon={<LocalPharmacy />} label="Prescription" />
            <Tab icon={<Science />} label="Lab Result" />
          </Tabs>
        </Box>

        {/* Vitals Form */}
        {tabValue === 0 && (
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}><TextField label="Heart Rate (bpm)" fullWidth value={vitals.heartRate} onChange={e => setVitals({ ...vitals, heartRate: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Blood Pressure (e.g., 120/80)" fullWidth value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Temperature (°F)" fullWidth value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} /></Grid>
          </Grid>
        )}

        {/* Prescription Form */}
        {tabValue === 1 && (
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={Object.keys(DRUG_DATABASE)}
                onInputChange={(e, newValue) => handlePrescriptionChange('medication', newValue)}
                renderInput={(params) => <TextField {...params} label="Medication Name" />}
              />
            </Grid>
            {interactionWarning && <Grid item xs={12}><Alert severity="warning">{interactionWarning}</Alert></Grid>}
            <Grid item xs={6}><TextField label="Dosage (e.g., 500mg)" fullWidth value={prescription.dosage} onChange={e => handlePrescriptionChange('dosage', e.target.value)} /></Grid>
            <Grid item xs={6}>
              <TextField select label="Status" fullWidth value={prescription.status} onChange={e => handlePrescriptionChange('status', e.target.value)}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Past">Past</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField label="Instructions (e.g., Twice a day)" fullWidth multiline rows={2} value={prescription.instructions} onChange={e => handlePrescriptionChange('instructions', e.target.value)} /></Grid>
          </Grid>
        )}

        {/* Lab Result Form */}
        {tabValue === 2 && (
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}><TextField label="Test Name" fullWidth value={labResult.testName} onChange={e => setLabResult({ ...labResult, testName: e.target.value })} /></Grid>
            {labResult.results.map((res, index) => (
              <React.Fragment key={index}>
                <Grid item xs={4}><TextField label="Component" value={res.name} onChange={e => {
                  const newResults = [...labResult.results];
                  newResults[index].name = e.target.value;
                  setLabResult({ ...labResult, results: newResults });
                }} /></Grid>
                <Grid item xs={3}><TextField label="Value" value={res.value} onChange={e => {
                  const newResults = [...labResult.results];
                  newResults[index].value = e.target.value;
                  setLabResult({ ...labResult, results: newResults });
                }} /></Grid>
                <Grid item xs={3}><TextField label="Unit" value={res.unit} onChange={e => {
                  const newResults = [...labResult.results];
                  newResults[index].unit = e.target.value;
                  setLabResult({ ...labResult, results: newResults });
                }} /></Grid>
                <Grid item xs={2}><FormControlLabel control={<Switch checked={res.isAbnormal} onChange={e => {
                  const newResults = [...labResult.results];
                  newResults[index].isAbnormal = e.target.checked;
                  setLabResult({ ...labResult, results: newResults });
                }} />} label="Abnormal" /></Grid>
              </React.Fragment>
            ))}
             <Grid item xs={12}>
                <Button onClick={() => setLabResult({...labResult, results: [...labResult.results, { name: '', value: '', unit: '', isAbnormal: false }]})}>
                    Add Lab Component
                </Button>
            </Grid>
          </Grid>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Record</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalRecords;