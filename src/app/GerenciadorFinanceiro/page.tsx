'use client';
import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Container, Typography, useTheme } from '@mui/material';
import ContasPagar from '../components/GerenciadorFinancas/ContasAPagar';
import Vendas from '../components/GerenciadorFinancas/Vendas';

export default function FinanceManagement() {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Container sx={{ bgcolor: 'transparent', borderRadius: 2, p: 2 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2e3b55' }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Contas a Pagar" />
          <Tab label="Vendas" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <ContasPagar />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Vendas />
      </TabPanel>
    </Container>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, bgcolor: 'transparent', borderRadius: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
