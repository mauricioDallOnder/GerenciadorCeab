import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography, CircularProgress } from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<{ [key: string]: boolean }>({});
  const [editMode, setEditMode] = useState(false);
  const [currentRow, setCurrentRow] = useState<ContaPagar | null>(null);

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
    setLoading(true);
    axios.get<ContaPagar[]>('/api/ApiContasPagar')
      .then(response => {
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map(row => ({
            ...row,
            dataPagamento: formatDateForDisplay(row.dataPagamento),
          }));

          // Ordenar as contas por data de pagamento em ordem crescente
          const sortedData = formattedData.sort((a, b) => new Date(a.dataPagamento).getTime() - new Date(b.dataPagamento).getTime());

          setRows(sortedData);
        } else {
          console.error('Data received is not an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  };
  
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const onSubmit = (data: ContaPagar) => {
    if (editMode && currentRow) {
      const updatedConta = {
        ...data,
        dataPagamento: new Date(data.dataPagamento).toISOString(), // Salvar como string ISO
        id: currentRow.id,
      };
      setLoading(true);
      axios.put('/api/ApiContasPagar', updatedConta)
        .then(response => {
          setRows(prevRows => {
            const updatedRows = prevRows.map(row => row.id === currentRow.id ? { ...updatedConta, dataPagamento: formatDateForDisplay(updatedConta.dataPagamento) } : row);
            return updatedRows.sort((a, b) => new Date(a.dataPagamento).getTime() - new Date(b.dataPagamento).getTime());
          });
          reset();
          setEditMode(false);
          setCurrentRow(null);
        })
        .catch(error => {
          console.error('Erro ao atualizar conta a pagar:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const newConta = {
        ...data,
        id: uuidv4(),
      };
      setLoading(true);
      axios.post('/api/ApiContasPagar', newConta)
        .then(response => {
          setRows(prevRows => {
            const updatedRows = [...prevRows, { ...newConta, dataPagamento: formatDateForDisplay(newConta.dataPagamento) }];
            return updatedRows.sort((a, b) => new Date(a.dataPagamento).getTime() - new Date(b.dataPagamento).getTime());
          });
          reset();
        })
        .catch(error => {
          console.error('Erro ao adicionar conta a pagar:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    axios.delete('/api/ApiContasPagar', { data: { id } })
      .then(response => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar conta a pagar:', error);
      })
      .finally(() => {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      });
  };

  const handleEdit = (row: ContaPagar) => {
    const formattedRow = {
      ...row,
      dataPagamento: formatDateForInput(row.dataPagamento),
    };
    setCurrentRow(formattedRow);
    setEditMode(true);
    reset(formattedRow);
  };

  const handleStatusChange = (id: string, status: string) => {
    const updatedConta = rows.find(row => row.id === id);
    if (updatedConta) {
      const updatedRow = { ...updatedConta, Status: status };
      setLoading(true);
      axios.put('/api/ApiContasPagar', updatedRow)
        .then(response => {
          setRows(prevRows => prevRows.map(row => row.id === id ? updatedRow : row));
        })
        .catch(error => {
          console.error('Erro ao atualizar status:', error);
        })
        .finally(() => {
          setLoading(false);
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
          disabled={loading}
        >
          <MenuItem value="em aberto">Em Aberto</MenuItem>
          <MenuItem value="pago">Pago</MenuItem>
        </Select>
      ),
    },
    {
      field: 'Editar',
      headerName: 'Editar',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(params.row)}
        >
          Editar
        </Button>
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
          disabled={deleteLoading[params.row.id] || loading}
        >
          {deleteLoading[params.row.id] ? <CircularProgress size={24} /> : 'Deletar'}
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
                  InputLabelProps={{ shrink: true }}
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
                      InputLabelProps={{ shrink: true }}
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
                <Controller
                  name="dataPagamento"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data de Pagamento"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={field.value}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('nNotaFiscal')}
                  label="N° Título/Nota Fiscal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('CNPJ')}
                  label="CNPJ"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
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
                        <MenuItem value="pix">Pix</MenuItem>
                        <MenuItem value="dinheiro">Dinheiro</MenuItem>
                        <MenuItem value="vale">Vale</MenuItem>
                        <MenuItem value="transferencia bancária">Transferência Bancária</MenuItem>
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (editMode ? 'Atualizar Conta' : 'Adicionar Conta a Pagar')}
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
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default ContasPagar;
