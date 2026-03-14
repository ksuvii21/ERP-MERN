import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Modal, Box, TextField, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', budget: '', status: 'Planning' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('construction/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('construction/projects', formData);
      setOpen(false);
      fetchProjects();
    } catch (err) { alert('Error saving project'); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Construction Projects</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>New Project</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.location}</TableCell>
                <TableCell>${p.budget.toLocaleString()}</TableCell>
                <TableCell>{p.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Add New Project</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Project Name" fullWidth sx={{ mb: 2 }} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <TextField label="Location" fullWidth sx={{ mb: 2 }} required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            <TextField label="Budget" type="number" fullWidth sx={{ mb: 2 }} required value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
            <TextField select label="Status" fullWidth sx={{ mb: 2 }} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              {['Planning', 'In Progress', 'On Hold', 'Completed'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Button type="submit" variant="contained" fullWidth>Create Project</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Projects;