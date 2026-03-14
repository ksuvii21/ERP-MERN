import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Modal, Box, TextField, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../utils/api';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ project: '', category: '', allocatedAmount: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, pRes] = await Promise.all([api.get('construction/budgets'), api.get('construction/projects')]);
        setBudgets(bRes.data);
        setProjects(pRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('construction/budgets', formData);
      setBudgets([...budgets, res.data]);
      setOpen(false);
    } catch (err) { alert('Error saving budget'); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Project Budgets</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Allocate Budget</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Allocated</TableCell>
              <TableCell>Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.project?.name}</TableCell>
                <TableCell>{b.category}</TableCell>
                <TableCell>${b.allocatedAmount.toLocaleString()}</TableCell>
                <TableCell>${b.spentAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>New Budget Allocation</Typography>
          <form onSubmit={handleSubmit}>
            <TextField select label="Project" fullWidth sx={{ mb: 2 }} required value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})}>
              {projects.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
            </TextField>
            <TextField label="Category" fullWidth sx={{ mb: 2 }} required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            <TextField label="Amount" type="number" fullWidth sx={{ mb: 2 }} required value={formData.allocatedAmount} onChange={(e) => setFormData({...formData, allocatedAmount: e.target.value})} />
            <Button type="submit" variant="contained" fullWidth>Save Allocation</Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};
export default Budgets;