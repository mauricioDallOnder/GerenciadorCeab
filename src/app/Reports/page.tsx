'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, SelectChangeEvent, Typography } from '@mui/material';
import { Associado } from '../interfaces/interfaces';
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
  totalDebitos: number;
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
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    axios.get<Record<string, Associado>>('/api/getAssociadosDataFirebase')
      .then(response => {
        const usuarios = Object.entries(response.data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        processFinanceData(usuarios);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toString() !== 'Invalid Date' && dateString !== "09/09/9999";
  };

  const processFinanceData = (usuarios: Associado[]) => {
    let reports: { [key: string]: MonthlyReport } = {};
    let yearsSet = new Set<string>();

    usuarios.forEach(user => {
      user.contribuicao?.forEach(({ dataContribuicao, tipoContribuicao, valorContribuicao }) => {
        if (isValidDate(dataContribuicao)) {
          const date = new Date(dataContribuicao);
          const month = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
          const year = date.getFullYear().toString();
          yearsSet.add(year);
          const value = parseFloat(valorContribuicao!);
          if (!reports[month]) {
            reports[month] = { id: month, month, totalContribuicoes: 0, totalDebitos: 0, pix: 0, dinheiro: 0, cartao: 0, valePresente: 0 };
          }
          reports[month].totalContribuicoes += isNaN(value) ? 0 : value;
          switch (tipoContribuicao!.toLowerCase()) {
            case 'pix':
              reports[month].pix += isNaN(value) ? 0 : value;
              break;
            case 'dinheiro':
              reports[month].dinheiro += isNaN(value) ? 0 : value;
              break;
            case 'cartao':
              reports[month].cartao += isNaN(value) ? 0 : value;
              break;
            case 'vale presente':
              reports[month].valePresente += isNaN(value) ? 0 : value;
              break;
          }
        }
      });

      user.possuiDebito?.forEach(({ dataDebito, valorDebito }) => {
        if (isValidDate(dataDebito)) {
          const date = new Date(dataDebito);
          const month = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
          const year = date.getFullYear().toString();
          yearsSet.add(year);
          const value = parseFloat(String(valorDebito).replace(',', '.'));
          if (!reports[month]) {
            reports[month] = { id: month, month, totalContribuicoes: 0, totalDebitos: 0, pix: 0, dinheiro: 0, cartao: 0, valePresente: 0 };
          }
          reports[month].totalDebitos += isNaN(value) ? 0 : value;
        }
      });
    });

    setMonthlyReports(Object.values(reports));
    setYears(Array.from(yearsSet).sort());
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
    setSelectedMonths([]); // Clear selected months when year changes
  };

  const handleMonthChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedMonths(event.target.value as string[]);
  };

  const filteredReports = monthlyReports.filter(report => {
    const reportYear = report.month.split(' ')[2];
    const reportMonth = report.month.split(' ')[0];
    return reportYear === selectedYear && (selectedMonths.length === 0 || selectedMonths.includes(reportMonth));
  });

  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const columns: GridColDef[] = [
    { field: 'month', headerName: 'Mês', width: 150, cellClassName: 'column-month' },
    { field: 'pix', headerName: 'Valor Total em Pix', type: 'number', width: 200, cellClassName: 'column-pix' },
    { field: 'dinheiro', headerName: 'Valor Total em Dinheiro', type: 'number', width: 200, cellClassName: 'column-dinheiro' },
    { field: 'cartao', headerName: 'Valor Total em Cartão', type: 'number', width: 200, cellClassName: 'column-cartao' },
    { field: 'valePresente', headerName: 'Valor Total em Vale Presente', type: 'number', width: 230, cellClassName: 'column-valePresente' },
    { field: 'totalContribuicoes', headerName: 'Valor Total de Contribuições', type: 'number', width: 230, cellClassName: 'column-totalContribuicoes' },
    { field: 'totalDebitos', headerName: 'Valor Total em Débitos', type: 'number', width: 200, cellClassName: 'column-totalDebitos' },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Box sx={{display:"flex",width:"90%", backgroundColor:"white",justifyContent:"center",alignItems:"center",mt:"10px"}}>
        <Typography sx={{color:"black"}}>Selecione o ano e o(s) mês(s) correspondente(s) ao lado:</Typography>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel>Ano</InputLabel>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          input={<OutlinedInput label="Ano" />}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedYear && (
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>Meses</InputLabel>
          <Select
            multiple
            value={selectedMonths}
            onChange={handleMonthChange}
            input={<OutlinedInput label="Meses" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      </Box>
      <Box style={{ marginTop: "20px", height: "auto", width: "90%" }}>
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
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          disableRowSelectionOnClick
          sx={{
            '& .column-month': { backgroundColor: '#e1bee7', textAlign: "center" },
            '& .column-pix': { backgroundColor: '#ffcdd2', textAlign: "center" },
            '& .column-dinheiro': { backgroundColor: '#e1bee7', textAlign: "center" },
            '& .column-cartao': { backgroundColor: '#ffcdd2', textAlign: "center" },
            '& .column-valePresente': { backgroundColor: '#e1bee7', textAlign: "center" },
            '& .column-totalContribuicoes': { backgroundColor: '#ffcdd2', textAlign: "center" },
            '& .column-totalDebitos': { backgroundColor: '#e1bee7', textAlign: "center" },
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
      <FinanceChart data={filteredReports} />
    </Box>
  );
}
