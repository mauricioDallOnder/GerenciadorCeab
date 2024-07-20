import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { BoxStyleFinanca, StyledDataGridFinanceiro } from '@/utils/styles';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
    axios.get<Venda[]>('/api/ApiVendas')
      .then(response => {
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map(row => ({
            ...row,
            dataVenda: formatDate(row.dataVenda),
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
    setRows(prevRows => [...prevRows, newVenda]);
    axios.post('/api/ApiVendas', newVenda)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erro ao adicionar venda:', error);
      });
    reset();
  };

  const handleDelete = (id: string) => {
    axios.delete('/api/ApiVendas', { data: { id } })
      .then(response => {
        console.log(response.data);
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar venda:', error);
      });
  };

  const columns: GridColDef[] = [
    { field: 'dataVenda', headerName: 'Data da Venda', width: 150 }, // Adicionando a coluna para a data da venda
    { field: 'produto', headerName: 'Produto', width: 200 },
    { field: 'quantidade', headerName: 'Quantidade', width: 150 },
    { field: 'valor', headerName: 'Valor Unitário', width: 150 },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 200 },
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
        >
          Deletar
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
            >
              Adicionar Venda
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
        />
      </Box>
    </Box>
  );
};

export default Vendas;
