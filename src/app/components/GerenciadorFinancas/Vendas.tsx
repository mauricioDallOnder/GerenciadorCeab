import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
}

const Vendas: React.FC = () => {
  const { control, register, handleSubmit, reset } = useForm<{
    vendas: Venda[];
  }>({
    defaultValues: {
      vendas: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vendas',
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const columns: GridColDef[] = [
    { field: 'produto', headerName: 'Produto', width: 150 },
    { field: 'quantidade', headerName: 'Quantidade', width: 150 },
    { field: 'valor', headerName: 'Valor', width: 150 },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 200 },
  ];

  return (
    <Box sx={BoxStyleFinanca}>
      <Typography variant="h6" gutterBottom sx={TituloDaPagina}>
        Vendas
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Card key={field.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register(`vendas.${index}.produto`)}
                    label="Produto"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register(`vendas.${index}.quantidade`)}
                    label="Quantidade"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    {...register(`vendas.${index}.valor`)}
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
                      name={`vendas.${index}.formaPagamento`}
                      control={control}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => remove(index)}
              >
                Remover
              </Button>
            </CardActions>
          </Card>
        ))}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            color="primary"
            onClick={() =>
              append({
                id: String(Date.now()),
                produto: '',
                quantidade: 0,
                valor: 0,
                formaPagamento: '',
              })
            }
          >
            Adicionar Venda
          </Button>
          <Button variant="contained" color="secondary" type="submit">
            Salvar
          </Button>
        </Box>
      </form>
      <Box sx={{ height: 400, width: '100%' }}>
        <StyledDataGrid rows={fields} columns={columns}  disableRowSelectionOnClick />
      </Box>
    </Box>
  );
};

export default Vendas;
