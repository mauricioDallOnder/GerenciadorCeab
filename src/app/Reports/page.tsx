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
  totalDoacoes: number;
  totalContasAPagar: number;
  totalVendas: number;
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
    setLoading(true);
    Promise.all([
      axios.get('/api/ApiVendas'),
      axios.get('/api/ApiContasPagar'),
      axios.get('/api/ApiContribuicoesDoacoes')
    ])
      .then(([vendasResponse, contasPagarResponse, contribuicoesDoacoesResponse]) => {
        const vendas = vendasResponse.data;
        const contasPagar = contasPagarResponse.data;
        const contribuicoesDoacoes = contribuicoesDoacoesResponse.data;
        processFinanceData(vendas, contasPagar, contribuicoesDoacoes);
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

  const processFinanceData = (vendas: any[], contasPagar: any[], contribuicoesDoacoes: any[]) => {
    let reports: { [key: string]: MonthlyReport } = {};
    let uniqueAnos: Set<number> = new Set();
    let uniqueMeses: Set<string> = new Set();

    // Processar Vendas
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
          reports[key] = { id: key, month: key, totalContribuicoes: 0, totalDoacoes: 0, totalContasAPagar: 0, totalVendas: 0 };
        }

        reports[key].totalVendas += isNaN(value) ? 0 : value;
      }
    });

    // Processar Contas a Pagar
    contasPagar.forEach(conta => {
      if (isValidDate(conta.dataPagamento)) {
        const date = new Date(conta.dataPagamento);
        const month = date.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();
        uniqueAnos.add(year);
        uniqueMeses.add(month);
        const key = `${month} de ${year}`;
        const value = parseFloat(conta.valor);

        if (!reports[key]) {
          reports[key] = { id: key, month: key, totalContribuicoes: 0, totalDoacoes: 0, totalContasAPagar: 0, totalVendas: 0 };
        }

        reports[key].totalContasAPagar += isNaN(value) ? 0 : value;
      }
    });

    // Processar Contribuições e Doações
    contribuicoesDoacoes.forEach(contribuicao => {
      if (isValidDate(contribuicao.data)) {
        const date = new Date(contribuicao.data);
        const month = date.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();
        uniqueAnos.add(year);
        uniqueMeses.add(month);
        const key = `${month} de ${year}`;
        const valueContrib = parseFloat(contribuicao.valorTotalPagoContribuicao);
        const valueDoacao = parseFloat(contribuicao.valorPagoDoacao);

        if (!reports[key]) {
          reports[key] = { id: key, month: key, totalContribuicoes: 0, totalDoacoes: 0, totalContasAPagar: 0, totalVendas: 0 };
        }

        reports[key].totalContribuicoes += isNaN(valueContrib) ? 0 : valueContrib;
        reports[key].totalDoacoes += isNaN(valueDoacao) ? 0 : valueDoacao;
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
    { field: 'totalVendas', headerName: 'Valor Total de Vendas', type: 'number', width: 200, cellClassName: 'column-vendas' },
    { field: 'totalContribuicoes', headerName: 'Valor Total em Contribuições', type: 'number', width: 250, cellClassName: 'column-contribuicoes' },
    { field: 'totalDoacoes', headerName: 'Valor Total em Doações', type: 'number', width: 200, cellClassName: 'column-doacoes' },
    { field: 'totalContasAPagar', headerName: 'Valor Total de Contas a Pagar', type: 'number', width: 250, cellClassName: 'column-contas' },
  ];

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

        <Grid
          container
          spacing={3}
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
            p: 3, // Padding interno para espaçamento
            borderRadius: 2, // Bordas arredondadas
            boxShadow: 3 // Sombra para destaque
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "black",
              mb: 3, // Margin-bottom para separar do formulário
              textAlign: "center"
            }}
          >
            Relatório Financeiro
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: "600px" // Limitar a largura do formulário
            }}
          >
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ano</InputLabel>
                <Select
                  value={selectedAno}
                  onChange={(e) => setSelectedAno(e.target.value as number)}
                >
                  <MenuItem value="">
                    <em>Todos os Anos</em>
                  </MenuItem>
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
                  <MenuItem value="">
                    <em>Todos os Meses</em>
                  </MenuItem>
                  {meses.map(mes => (
                    <MenuItem key={mes} value={mes}>{mes}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
                '& .column-vendas': { backgroundColor: '#c8e6c9', textAlign: "center" },
                '& .column-contribuicoes': { backgroundColor: '#bbdefb', textAlign: "center" },
                '& .column-doacoes': { backgroundColor: '#ffcdd2', textAlign: "center" },
                '& .column-contas': { backgroundColor: '#ffe0b2', textAlign: "center" },
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
