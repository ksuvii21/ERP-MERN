import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { CloudUpload, Description, BugReport, CheckCircle } from '@mui/icons-material';

const DocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'invoice_feb_001.pdf', type: 'Invoice', status: 'Processed', confidence: 98, fraudRisk: 'Low' },
  ]);

  const handleUpload = () => {
    setUploading(true);
    // Simulate AI Processing
    setTimeout(() => {
        setUploading(false);
        setDocuments(prev => [
            { id: Date.now(), name: 'new_receipt.png', type: 'Receipt', status: 'Processed', confidence: 85, fraudRisk: 'High' },
            ...prev
        ]);
    }, 2000);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Document Intelligence (AI-OCR)</Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer' }} onClick={handleUpload}>
                <CloudUpload sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">Drag & Drop or Click to Upload</Typography>
                <Typography variant="body2" color="text.secondary">Supports PDF, PNG, JPG (Max 10MB)</Typography>
                {uploading && <Box mt={3}><LinearProgress /><Typography variant="caption" display="block" mt={1}>AI Extracting Data...</Typography></Box>}
            </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Processed Documents</Typography>
                <List>
                    {documents.map((doc) => (
                        <ListItem key={doc.id} sx={{ borderBottom: '1px solid #f1f5f9' }}>
                            <ListItemIcon><Description /></ListItemIcon>
                            <ListItemText 
                                primary={doc.name} 
                                secondary={`Type: ${doc.type} | AI Confidence: ${doc.confidence}%`} 
                            />
                            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                                <Chip 
                                    label={doc.fraudRisk === 'High' ? 'Fraud Risk' : 'Verified'} 
                                    color={doc.fraudRisk === 'High' ? 'error' : 'success'} 
                                    size="small" 
                                    icon={doc.fraudRisk === 'High' ? <BugReport /> : <CheckCircle />}
                                />
                                {doc.fraudRisk === 'High' && <Typography variant="caption" color="error">Duplicate Invoice ID</Typography>}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>AI Extraction Preview</Typography>
        <Paper sx={{ p: 3, backgroundColor: '#1e293b', color: '#fff', fontFamily: 'monospace' }}>
            <Typography variant="body2" component="pre" sx={{ overflowX: 'auto' }}>
{`{
  "document_id": "doc_8821",
  "detected_type": "Invoice",
  "vendor": "Acme Corp",
  "date": "2026-02-10",
  "total_amount": 1250.00,
  "line_items": [
    { "desc": "Server Maintenance", "qty": 1, "price": 1250.00 }
  ],
  "anomalies": []
}`}
            </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DocumentUpload;