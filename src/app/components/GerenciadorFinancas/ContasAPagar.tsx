import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DataGrid, GridColDef, GridRowParams, gridClasses } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import { BoxStyleFinanca, StyledDataGridFinanceiro, TituloDaPagina } from '@/utils/styles';

interface ContaPagar {
  id: string;
  empresa: string;
  valor: number;
  dataPagamento: string;
  tituloNotaFiscal: string;
  formaPagamento: string;
  cnpj: string;
  status: string;
}



export default function ContasPagar() {
  const [rows, setRows] = useState<ContaPagar[]>([]);

  const { control, register, handleSubmit, reset } = useForm<ContaPagar>({
    defaultValues: {
      id: '',
      empresa: '',
      valor: 0,
      dataPagamento: '',
      tituloNotaFiscal: '',
      formaPagamento: '',
      cnpj: '',
      status: 'em aberto',
    },
  });

  const onSubmit = (data: ContaPagar) => {
    const newConta = {
      ...data,
      id: String(Date.now()),
    };
    setRows([...rows, newConta]);
    reset();
  };

  const handleDelete = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleStatusChange = (id: string, status: string) => {
    setRows(rows.map(row => (row.id === id ? { ...row, status } : row)));
  };

  const columns: GridColDef[] = [
    { field: 'empresa', headerName: 'Empresa', width: 300 },
    { field: 'valor', headerName: 'Valor', width: 100 },
    { field: 'dataPagamento', headerName: 'Data de Pagamento', width: 150 },
    { field: 'tituloNotaFiscal', headerName: 'N° Título/Nota Fiscal', width: 180 },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 180 },
    { field: 'cnpj', headerName: 'CNPJ', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value as string)}
          fullWidth
        >
          <MenuItem value="em aberto">Em Aberto</MenuItem>
          <MenuItem value="pago">Pago</MenuItem>
        </Select>
      ),
    },
    {
      field: 'Deletar',
      headerName: 'Deletar Registro',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          Deletar
        </Button>
      ),
    },
  ];

  const getRowClassName = (params: GridRowParams) => {
    return params.row.status === 'em aberto' ? 'row-em-aberto' : 'row-pago';
  };

  return (
    <Box sx={BoxStyleFinanca}>
      <Typography variant="h6" gutterBottom sx={TituloDaPagina}>
        Contas a Pagar
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('empresa')}
                  label="Empresa"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('valor')}
                  label="Valor"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('dataPagamento')}
                  label="Data de Pagamento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('tituloNotaFiscal')}
                  label="N° Título/Nota Fiscal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('cnpj')}
                  label="CNPJ"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select {...field} fullWidth>
                        <MenuItem value="debito">Débito</MenuItem>
                        <MenuItem value="credito">Crédito</MenuItem>
                        <MenuItem value="boleto">Boleto</MenuItem>
                      </Select>
                    )}
                    name="formaPagamento"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select {...field} fullWidth>
                        <MenuItem value="em aberto">Em Aberto</MenuItem>
                        <MenuItem value="pago">Pago</MenuItem>
                      </Select>
                    )}
                    name="status"
                    control={control}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              color="primary"
              type="submit"
            >
              Adicionar Conta a Pagar
            </Button>
          </CardActions>
        </Card>
      </form>
      <Box sx={{ height: 400, width: '100%' }}>
        <StyledDataGridFinanceiro
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          getRowClassName={getRowClassName}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
}
