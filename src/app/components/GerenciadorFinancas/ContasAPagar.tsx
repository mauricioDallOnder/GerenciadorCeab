import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { BoxStyleFinanca, StyledDataGridFinanceiro } from '@/utils/styles';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface ContaPagar {
  id: string;
  empresa: string;
  valor: number;
  dataPagamento: string;
  nNotaFiscal: string;
  FormaPagamento: string;
  CNPJ: string;
  Status: string;
}

const ContasPagar: React.FC = () => {
  const [rows, setRows] = useState<ContaPagar[]>([]);

  const { control, register, handleSubmit, reset } = useForm<ContaPagar>({
    defaultValues: {
      id: '',
      empresa: '',
      valor: 0,
      dataPagamento: '',
      nNotaFiscal: '',
      FormaPagamento: '',
      CNPJ: '',
      Status: 'em aberto',
    },
  });

  useEffect(() => {
    axios.get<ContaPagar[]>('/api/ApiContasPagar')
      .then(response => {
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map(row => ({
            ...row,
            dataPagamento: formatDate(row.dataPagamento),
          }));
          setRows(formattedData);
        } else {
          console.error('Data received is not an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onSubmit = (data: ContaPagar) => {
    const newConta = {
      ...data,
      id: uuidv4(),
      dataPagamento: formatDate(data.dataPagamento),
    };
    setRows(prevRows => [...prevRows, newConta]);
    axios.post('/api/ApiContasPagar', newConta)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erro ao adicionar conta a pagar:', error);
      });
    reset();
  };

  const handleDelete = (id: string) => {
    axios.delete('/api/ApiContasPagar', { data: { id } })
      .then(response => {
        console.log(response.data);
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar conta a pagar:', error);
      });
  };

  const handleStatusChange = (id: string, status: string) => {
    const updatedConta = rows.find(row => row.id === id);
    if (updatedConta) {
      const updatedRow = { ...updatedConta, Status: status };
      axios.put('/api/ApiContasPagar', updatedRow)
        .then(response => {
          console.log(response.data);
          setRows(prevRows => prevRows.map(row => row.id === id ? updatedRow : row));
        })
        .catch(error => {
          console.error('Erro ao atualizar status:', error);
        });
    }
  };

  const columns: GridColDef[] = [
    { field: 'empresa', headerName: 'Empresa', width: 300 },
    { field: 'valor', headerName: 'Valor', width: 100 },
    { field: 'dataPagamento', headerName: 'Data de Pagamento', width: 150 },
    { field: 'nNotaFiscal', headerName: 'N° Título/Nota Fiscal', width: 180 },
    { field: 'FormaPagamento', headerName: 'Forma de Pagamento', width: 180 },
    { field: 'CNPJ', headerName: 'CNPJ', width: 150 },
    {
      field: 'Status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.Status}
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

  const getRowClassName = (params: any) => {
    return params.row.Status === 'em aberto' ? 'row-em-aberto' : 'row-pago';
  };

  return (
    <Box sx={BoxStyleFinanca}>
      <Typography variant="h6" gutterBottom>
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
              <Controller
                  name="valor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor"
                      type="number"
                      inputMode="decimal"
                      fullWidth
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
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
                  {...register('nNotaFiscal')}
                  label="N° Título/Nota Fiscal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('CNPJ')}
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
                    name="FormaPagamento"
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
                    name="Status"
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
          getRowId={(row) => row.id}
          getRowClassName={getRowClassName}
        />
      </Box>
    </Box>
  );
};

export default ContasPagar;
