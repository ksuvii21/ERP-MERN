import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Modal,
  Box,
  TextField,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
// Note: This assumes you have a configured API client, like axios.
// You may need to create this file (e.g., in 'src/utils/api.js').
import api from '../../utils/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const BillOfMaterials = () => {
  const [boms, setBoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const [newBom, setNewBom] = useState({
    name: '',
    product: null,
    description: '',
    components: [{ component: null, quantity: 1 }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        // Assumes API endpoints exist for fetching BOMs and products
        const [bomsRes, productsRes] = await Promise.all([
          api.get('/boms?populate=product'),
          api.get('/products'),
        ]);
        setBoms(bomsRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to fetch data. Ensure API endpoints for BOMs and Products are running.'
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewBom({
      name: '',
      product: null,
      description: '',
      components: [{ component: null, quantity: 1 }],
    });
  };

  const handleBomChange = (e) => {
    setNewBom({ ...newBom, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (event, value) => {
    setNewBom({ ...newBom, product: value });
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...newBom.components];
    updatedComponents[index][field] = value;
    setNewBom({ ...newBom, components: updatedComponents });
  };

  const addComponent = () => {
    setNewBom({
      ...newBom,
      components: [...newBom.components, { component: null, quantity: 1 }],
    });
  };

  const removeComponent = (index) => {
    const updatedComponents = newBom.components.filter((_, i) => i !== index);
    setNewBom({ ...newBom, components: updatedComponents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newBom,
        product: newBom.product?._id,
        components: newBom.components.map((c) => ({
          component: c.component?._id,
          quantity: c.quantity,
        })),
      };

      if (!payload.product || payload.components.some((c) => !c.component || !c.quantity)) {
        setError('Please fill all required fields for the BOM.');
        return;
      }

      const res = await api.post('/boms', payload);
      // To show the populated product name immediately, we can merge data. The createOne factory returns the created doc.
      const createdBom = { ...res.data, product: newBom.product };
      setBoms([...boms, createdBom]);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Bill of Materials.');
      console.error(err);
    }
  };

  if (loading) {
    return <Container><CircularProgress /></Container>;
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Bill of Materials
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Create BOM
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>BOM Name</TableCell>
              <TableCell>Final Product</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Components Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boms.map((bom) => (
              <TableRow key={bom._id} hover>
                <TableCell>{bom.name}</TableCell>
                <TableCell>{bom.product?.name || 'N/A'}</TableCell>
                <TableCell>{bom.description}</TableCell>
                <TableCell align="center">{bom.components.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" mb={2}>Create New Bill of Materials</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="BOM Name" name="name" value={newBom.name} onChange={handleBomChange} fullWidth required sx={{ mb: 2 }} />
            <Autocomplete options={products} getOptionLabel={(option) => option.name || ''} value={newBom.product} onChange={handleProductSelect} isOptionEqualToValue={(option, value) => option._id === value._id} renderInput={(params) => <TextField {...params} label="Final Product" required />} sx={{ mb: 2 }} />
            <TextField label="Description" name="description" value={newBom.description} onChange={handleBomChange} fullWidth multiline rows={2} sx={{ mb: 2 }} />
            <Typography variant="subtitle1" mt={2} mb={1}>Components</Typography>
            {newBom.components.map((comp, index) => (
              <Box key={index} display="flex" gap={2} alignItems="center" mb={1}>
                <Autocomplete options={products} getOptionLabel={(option) => option.name || ''} value={comp.component} onChange={(e, val) => handleComponentChange(index, 'component', val)} isOptionEqualToValue={(option, value) => option._id === value._id} renderInput={(params) => <TextField {...params} label={`Component ${index + 1}`} required />} sx={{ flexGrow: 1 }} />
                <TextField label="Quantity" type="number" value={comp.quantity} onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)} required inputProps={{ min: 1 }} sx={{ width: '120px' }} />
                <IconButton onClick={() => removeComponent(index)} color="error" disabled={newBom.components.length <= 1}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button onClick={addComponent} startIcon={<Add />} sx={{ mt: 1 }}>Add Component</Button>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained">Create</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default BillOfMaterials;