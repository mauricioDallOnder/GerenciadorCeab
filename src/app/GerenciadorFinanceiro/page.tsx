'use client'
import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Container, Typography, useTheme } from '@mui/material';
import ContasPagar from '../components/GerenciadorFinancas/ContasAPagar';
import Vendas from '../components/GerenciadorFinancas/Vendas';
import ContribuicoesDoacoes from '../components/GerenciadorFinancas/ContribuicoesDoacoes';

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
          <Tab label="Contribuições/Doações" /> {/* Adicione a aba aqui */}
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <ContasPagar />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Vendas />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}> {/* Certifique-se de que o índice é 2 */}
        <ContribuicoesDoacoes />
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
