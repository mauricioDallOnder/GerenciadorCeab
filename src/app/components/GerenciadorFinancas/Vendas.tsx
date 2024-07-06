import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BoxStyleFinanca, StyledDataGrid, TituloDaPagina } from '@/utils/styles';

interface Venda {
  id: string;
  produto: string;
  quantidade: number;
  valor: number;
  formaPagamento: string;
  valorTotal: number; // Adicionando valorTotal
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
    },
  });

  const onSubmit = (data: Venda) => {
    const newVenda = {
      ...data,
      id: String(Date.now()),
      valorTotal: data.quantidade * data.valor,
    };
    setRows([...rows, newVenda]);
    reset();
  };

  const handleDelete = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const columns: GridColDef[] = [
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
      <Typography variant="h6" gutterBottom sx={TituloDaPagina}>
        Vendas
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
                  {...register('quantidade')}
                  label="Quantidade"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  {...register('valor')}
                  label="Valor"
                  type="number"
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
                        <MenuItem value="pix">Pix</MenuItem>
                      </Select>
                    )}
                    name="formaPagamento"
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
              Adicionar Venda
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
        />
      </Box>
    </Box>
  );
};

export default Vendas;
