import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Chip } from '@mui/material';
import { Add, ContactPage } from '@mui/icons-material';

const CRM = () => {
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
        <Typography variant="h4" fontWeight="bold">CRM & Leads</Typography>
        <Button variant="contained" startIcon={<Add />}>New Lead</Button>
      </Box>
      
      <Grid container spacing={3}>
        {[
          { name: 'John Smith', company: 'Global Solutions', status: 'Hot', value: '$5,000' },
          { name: 'Alice Wong', company: 'Tech Partners', status: 'In Conversation', value: '$12,000' }
        ].map((lead, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ContactPage color="primary" sx={{ fontSize: 40 }} />
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">{lead.name}</Typography>
                <Typography variant="body2" color="text.secondary">{lead.company}</Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h6" color="success.main">{lead.value}</Typography>
                <Chip label={lead.status} size="small" variant="outlined" />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default CRM;