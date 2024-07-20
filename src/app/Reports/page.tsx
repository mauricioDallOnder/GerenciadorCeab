'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, FormControl, InputLabel, MenuItem, Select, Grid, Typography, CircularProgress } from '@mui/material';
import { GridColDef, GridToolbar } from '@mui/x-data-grid';
import CustomPagination from '../components/TableCustomPagination';
import FinanceChart from '../components/FinanceChart';
import { StyledDataGrid } from '@/utils/styles';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"

interface MonthlyReport {
  id: string;
  month: string;
  totalContribuicoes: number;
  pix: number;
  dinheiro: number;
  cartao: number;
  valePresente: number;
}

export default function FinanceReport() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/Login');
    }
  });

  const PAGE_SIZE = 15;
  const [paginationModel, setPaginationModel] = useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<MonthlyReport[]>([]);
  const [anos, setAnos] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);
  const [selectedAno, setSelectedAno] = useState<number | ''>('');
  const [selectedMes, setSelectedMes] = useState<string | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/ApiVendas')
      .then(response => {
        const vendas = response.data;
        processFinanceData(vendas);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toString() !== 'Invalid Date';
  };

  const processFinanceData = (vendas: any[]) => {
    let reports: { [key: string]: MonthlyReport } = {};
    let uniqueAnos: Set<number> = new Set();
    let uniqueMeses: Set<string> = new Set();

    vendas.forEach(venda => {
      if (isValidDate(venda.dataVenda)) {
        const date = new Date(venda.dataVenda);
        const month = date.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();
        uniqueAnos.add(year);
        uniqueMeses.add(month);
        const key = `${month} de ${year}`;
        const value = parseFloat(venda.valorTotal);

        if (!reports[key]) {
          reports[key] = { id: key, month: key, totalContribuicoes: 0, pix: 0, dinheiro: 0, cartao: 0, valePresente: 0 };
        }

        reports[key].totalContribuicoes += isNaN(value) ? 0 : value;

        switch (venda.formaPagamento.toLowerCase()) {
          case 'pix':
            reports[key].pix += isNaN(value) ? 0 : value;
            break;
          case 'dinheiro':
            reports[key].dinheiro += isNaN(value) ? 0 : value;
            break;
          case 'cartao':
            reports[key].cartao += isNaN(value) ? 0 : value;
            break;
          case 'vale':
            reports[key].valePresente += isNaN(value) ? 0 : value;
            break;
        }
      }
    });

    setMonthlyReports(Object.values(reports));
    setAnos(Array.from(uniqueAnos).sort((a, b) => b - a));
    setMeses(Array.from(uniqueMeses));
  };

  useEffect(() => {
    const filtered = monthlyReports.filter(report => {
      const [mes, ano] = report.month.split(' de ');
      return (selectedAno === '' || parseInt(ano) === selectedAno) && (selectedMes === '' || mes === selectedMes);
    });
    setFilteredReports(filtered);
  }, [selectedAno, selectedMes, monthlyReports]);

  const columns: GridColDef[] = [
    { field: 'month', headerName: 'Mês', width: 150, cellClassName: 'column-month' },
    { field: 'pix', headerName: 'Valor Total em Pix', type: 'number', width: 200, cellClassName: 'column-pix' },
    { field: 'dinheiro', headerName: 'Valor Total em Dinheiro', type: 'number', width: 200, cellClassName: 'column-dinheiro' },
    { field: 'cartao', headerName: 'Valor Total em Cartão', type: 'number', width: 200, cellClassName: 'column-cartao' },
    { field: 'valePresente', headerName: 'Valor Total em Vale', type: 'number', width: 230, cellClassName: 'column-valePresente' },
    { field: 'totalContribuicoes', headerName: 'Valor Total de Contribuições', type: 'number', width: 230, cellClassName: 'column-totalContribuicoes' },
  ];

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Typography variant="h4" component="h1" sx={{ my: 4 }}>
          Relatório de Vendas
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Ano</InputLabel>
              <Select
                value={selectedAno}
                onChange={(e) => setSelectedAno(e.target.value as number)}
              >
                <MenuItem value=""><em>Todos os Anos</em></MenuItem>
                {anos.map(ano => (
                  <MenuItem key={ano} value={ano}>{ano}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Meses</InputLabel>
              <Select
                value={selectedMes}
                onChange={(e) => setSelectedMes(e.target.value as string)}
              >
                <MenuItem value=""><em>Todos os Meses</em></MenuItem>
                {meses.map(mes => (
                  <MenuItem key={mes} value={mes}>{mes}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ height: 400, width: '100%', mt: 4 }}>
            <StyledDataGrid
              rows={filteredReports}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[PAGE_SIZE]}
              slots={{
                pagination: CustomPagination,
                toolbar: GridToolbar,
              }}
              disableRowSelectionOnClick
              sx={{
                '& .column-month': { backgroundColor: '#e1bee7', textAlign: "center" },
                '& .column-pix': { backgroundColor: '#ffcdd2', textAlign: "center" },
                '& .column-dinheiro': { backgroundColor: '#e1bee7', textAlign: "center" },
                '& .column-cartao': { backgroundColor: '#ffcdd2', textAlign: "center" },
                '& .column-valePresente': { backgroundColor: '#e1bee7', textAlign: "center" },
                '& .column-totalContribuicoes': { backgroundColor: '#ffcdd2', textAlign: "center" },
                '& .MuiDataGrid-cell': {
                  fontSize: '14px',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#eeeeee',
                  color: '#000',
                  fontSize: '16px',
                },
              }}
            />
          </Box>
        )}
        <FinanceChart data={filteredReports} />
      </Box>
    </Container>
  );
}
