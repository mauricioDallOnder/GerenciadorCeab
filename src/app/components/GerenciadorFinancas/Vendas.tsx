import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridRowModel, GridCellEditStopParams } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { BoxStyleFinanca, StyledDataGrid, StyledDataGridFinanceiro } from '@/utils/styles';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CustomPagination from '../TableCustomPagination';

interface Venda {
  id: string;
  produto: string;
  quantidade: number;
  valor: number;
  formaPagamento: string;
  valorTotal: number;
  dataVenda: string; // Novo campo para a data da venda
}

const Vendas: React.FC = () => {
  const [rows, setRows] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<{ [key: string]: boolean }>({});

  const { control, register, handleSubmit, reset } = useForm<Venda>({
    defaultValues: {
      id: '',
      produto: '',
      quantidade: 0,
      valor: 0,
      formaPagamento: '',
      valorTotal: 0,
      dataVenda: '', // Inicialização do campo dataVenda
    },
  });

  useEffect(() => {
    setLoading(true);
    axios.get<Venda[]>('/api/ApiVendas')
      .then(response => {
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map(row => ({
            ...row,
            dataVenda: formatDate(row.dataVenda),
          }));

          // Ordenar as vendas por dataVenda em ordem crescente
          const sortedData = formattedData.sort((a, b) => new Date(a.dataVenda).getTime() - new Date(b.dataVenda).getTime());

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const onSubmit = (data: Venda) => {
    const newVenda = {
      ...data,
      id: uuidv4(),
      valorTotal: data.quantidade * data.valor,
      dataVenda: formatDate(data.dataVenda), // Formatação da data
    };
    setLoading(true);
    axios.post('/api/ApiVendas', newVenda)
      .then(response => {
        setRows(prevRows => {
          const updatedRows = [...prevRows, newVenda];
          return updatedRows.sort((a, b) => new Date(a.dataVenda).getTime() - new Date(b.dataVenda).getTime());
        });
        reset();
      })
      .catch(error => {
        console.error('Erro ao adicionar venda:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    axios.delete('/api/ApiVendas', { data: { id } })
      .then(response => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar venda:', error);
      })
      .finally(() => {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      });
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as Venda;
    updatedRow.valorTotal = updatedRow.quantidade * updatedRow.valor;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleSaveChanges = () => {
    setLoading(true);
    const promises = rows.map(row =>
      axios.put('/api/ApiVendas', row)
    );
    Promise.all(promises)
      .then(() => {
        alert('Dados atualizados com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao atualizar dados:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: GridColDef[] = [
    { field: 'dataVenda', headerName: 'Data da Venda', width: 150, editable: true },
    { field: 'produto', headerName: 'Produto', width: 200, editable: true },
    { field: 'quantidade', headerName: 'Quantidade', width: 150, editable: true },
    { field: 'valor', headerName: 'Valor Unitário', width: 150, editable: true },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 200, editable: true },
    { field: 'valorTotal', headerName: 'Valor Total', width: 150 },
    {
      field: 'Deletar',
      headerName: 'Deletar Registro',
      width: 155,
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
    {
      field: 'Atualizar',
      headerName: 'Atualizar Registro',
      width: 155,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Atualizar'}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={BoxStyleFinanca}>
      <Typography variant="h6" gutterBottom>
        Vendas/Doações
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('produto')}
                  label="Produto"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  {...register('quantidade', { valueAsNumber: true })}
                  label="Quantidade"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
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
                      </Select>
                    )}
                    name="formaPagamento"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="dataVenda"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data da Venda"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}
                />
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
              {loading ? <CircularProgress size={24} /> : 'Adicionar Venda'}
            </Button>
          </CardActions>
        </Card>
      </form>
     
      <Box sx={{ height: 400, width: '100%' }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          loading={loading}
          processRowUpdate={processRowUpdate}
          slots={{
            pagination: CustomPagination,
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Vendas;
