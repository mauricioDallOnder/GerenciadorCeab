'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { Associado } from '../interfaces/interfaces';
import { GridColDef, GridToolbar } from '@mui/x-data-grid';
import CustomPagination from '../components/TableCustomPagination';
import FinanceChart from '../components/FinanceChart';
import { StyledDataGrid } from '@/utils/styles';
import { useSession} from "next-auth/react";
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
        required: true, // Indica que a sessão é necessária
        onUnauthenticated() {
            // Redireciona para o login se não autenticado
            router.push('/Login');
        }
    });
    
    const PAGE_SIZE = 15;
    const [paginationModel, setPaginationModel] = useState({
        pageSize: PAGE_SIZE,
        page: 0,
    });
    const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);

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

  const processFinanceData = (usuarios: Associado[]) => {
    let reports: {[key: string]: MonthlyReport} = {};
  
    usuarios.forEach(user => {
      // Processa contribuições
      user.contribuicao?.forEach(({ dataContribuicao, tipoContribuicao, valorContribuicao }) => {
        const month = new Date(dataContribuicao).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
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
      });
  
      // Processa débitos
      user.possuiDebito?.forEach(({ dataDebito, valorDebito }) => {
        const month = new Date(dataDebito).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        const value = parseFloat(valorDebito.replace(',', '.'));
        if (!reports[month]) {
          reports[month] = { id: month, month, totalContribuicoes: 0, totalDebitos: 0, pix: 0, dinheiro: 0, cartao: 0, valePresente: 0 };
        }
        reports[month].totalDebitos += isNaN(value) ? 0 : value;
      });
    });
  
    setMonthlyReports(Object.values(reports));
  };
  

  const columns: GridColDef[] = [
    { field: 'month', headerName: 'Mês', width: 150 },
    { field: 'pix', headerName: 'Valor Total em Pix', type: 'number', width: 200 },
    { field: 'dinheiro', headerName: 'Valor Total em Dinheiro', type: 'number', width: 200 },
    { field: 'cartao', headerName: 'Valor Total em Cartão', type: 'number', width: 200 },
    { field: 'valePresente', headerName: 'Valor Total em Vale Presente', type: 'number', width: 200 },
    { field: 'totalContribuicoes', headerName: 'Valor Total de Contribuições', type: 'number', width: 200 },
    { field: 'totalDebitos', headerName: 'Valor Total em Débitos', type: 'number', width: 200 },
  ];



    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Box
                style={{ marginTop: "100px", height: "auto", width: "90%" }}
            >
                <StyledDataGrid

                    rows={Object.values(monthlyReports)}
                    columns={columns}
                    checkboxSelection
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


                />
            </Box>
            <FinanceChart data={monthlyReports} />
        </Box>
    );
};

