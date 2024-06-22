import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BoxStyleCadastro, BoxStyleFinanca, StyledDataGrid, TituloDaPagina } from '@/utils/styles';

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

export default function ContasPagar () {
  const { control, register, handleSubmit, reset } = useForm<{
    contasPagar: ContaPagar[];
  }>({
    defaultValues: {
      contasPagar: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contasPagar',
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const columns: GridColDef[] = [
    { field: 'empresa', headerName: 'Empresa', width: 150 },
    { field: 'valor', headerName: 'Valor', width: 100 },
    { field: 'dataPagamento', headerName: 'Data de Pagamento', width: 150 },
    { field: 'tituloNotaFiscal', headerName: 'N° Título/Nota Fiscal', width: 180 },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 180 },
    { field: 'cnpj', headerName: 'CNPJ', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Box sx={ BoxStyleFinanca }>
      <Typography variant="h6" gutterBottom sx={TituloDaPagina}>
        Contas a Pagar
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Card key={field.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register(`contasPagar.${index}.empresa`)}
                    label="Empresa"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register(`contasPagar.${index}.valor`)}
                    label="Valor"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register(`contasPagar.${index}.dataPagamento`)}
                    label="Data de Pagamento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register(`contasPagar.${index}.tituloNotaFiscal`)}
                    label="N° Título/Nota Fiscal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register(`contasPagar.${index}.cnpj`)}
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
                      name={`contasPagar.${index}.formaPagamento`}
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
                      name={`contasPagar.${index}.status`}
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
                empresa: '',
                valor: 0,
                dataPagamento: '',
                tituloNotaFiscal: '',
                formaPagamento: '',
                cnpj: '',
                status: 'em aberto',
              })
            }
          >
            Adicionar Conta a Pagar
          </Button>
          <Button variant="contained" color="secondary" type="submit">
            Salvar
          </Button>
        </Box>
      </form>
      <Box sx={{ height: 400, width: '100%' }}>
        <StyledDataGrid  rows={fields} columns={columns}  disableRowSelectionOnClick />
      </Box>
    </Box>
  );
};


