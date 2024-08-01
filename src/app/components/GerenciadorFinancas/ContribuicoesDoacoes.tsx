import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface MesesPagos {
  [mes: string]: number; // Define que cada mês (string) tem um valor (number)
}

interface Transacao {
  id: string;
  tipo: string;
  nome?: string;
  valor: number;
  data?: string;
  formaPagamento?: string;
  valorTotal?: number;
  mesesPagos?: MesesPagos;
}

const ContribuicoesDoacoes: React.FC = () => {
  const [rows, setRows] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<{ [key: string]: boolean }>({});

  const { control, register, handleSubmit, reset, watch, setValue, getValues } = useForm<Transacao>({
    defaultValues: {
      id: '',
      tipo: 'doacao',
      nome: '',
      valor: 0,
      data: '',
      formaPagamento: '',
      valorTotal: 0,
      mesesPagos: {},
    },
  });

  const tipo = watch('tipo');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/ApiContribuicoesDoacoes')
      .then(response => {
        if (Array.isArray(response.data)) {
          setRows(response.data.map(item => ({ ...item, id: item.id || uuidv4() })));
        } else {
          console.error('Expected an array from API but received:', response.data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSubmit = (data: Transacao) => {
    const newTransacao = {
      ...data,
      id: uuidv4(),
    };
    setLoading(true);
    axios.post('/api/ApiContribuicoesDoacoes', newTransacao)
      .then(() => {
        setRows(prevRows => [...prevRows, newTransacao]);
        reset();
      })
      .catch(error => {
        console.error('Erro ao adicionar transação:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    axios.delete('/api/ApiContribuicoesDoacoes', { data: { id } })
      .then(() => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar transação:', error);
      })
      .finally(() => {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      });
  };

  const calcularValorPagoAteMomento = (mesesPagos: MesesPagos = {}) => {
    return Object.values(mesesPagos).reduce((acc, valor) => acc + valor, 0);
  };

  const updateTransacao = (updatedTransacao: Transacao) => {
    axios.put(`/api/ApiContribuicoesDoacoes/${updatedTransacao.id}`, updatedTransacao)
      .then(() => {
        setRows(prevRows => prevRows.map(row => row.id === updatedTransacao.id ? updatedTransacao : row));
      })
      .catch(error => {
        console.error('Erro ao atualizar transação:', error);
      });
  };

  const handleMesesPagosChange = (id: string, mes: string, valor: number) => {
    setRows(prevRows => {
      const updatedRows = prevRows.map(row => {
        if (row.id === id) {
          const updatedRow = {
            ...row,
            mesesPagos: {
              ...row.mesesPagos,
              [mes]: valor,
            },
          };
          updateTransacao(updatedRow);
          return updatedRow;
        }
        return row;
      });
      return updatedRows;
    });
  };

  const columns: GridColDef[] = [
    { field: 'tipo', headerName: 'Tipo', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'valor', headerName: 'Valor', width: 100 },
    { field: 'data', headerName: 'Data', width: 150 },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 180 },
    { field: 'valorTotal', headerName: 'Valor Total', width: 150 },
    {
      field: 'valorPagoAteMomento',
      headerName: 'Valor Pago Até o Momento',
      width: 200,
      renderCell: (params: GridRenderCellParams<Transacao>) => {
        if (!params.row) return '';
        return calcularValorPagoAteMomento(params.row.mesesPagos);
      },
    },
    {
      field: 'mesesPagos',
      headerName: 'Meses Pagos',
      width: 200,
      renderCell: (params: GridRenderCellParams<Transacao>) => {
        if (!params.row) return null;
        const mesesPagos = params.row.mesesPagos || {};
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(mesesPagos).map(([mes, valor]) => (
              <TextField
                key={mes}
                label={mes}
                value={valor}
                onChange={(e) => handleMesesPagosChange(params.row.id, mes, parseFloat(e.target.value))}
                type="number"
                inputMode="decimal"
                fullWidth
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: 'Deletar',
      headerName: 'Deletar Registro',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Transacao>) => (
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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contribuições/Doações
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select {...field} fullWidth>
                        <MenuItem value="doacao">Doação</MenuItem>
                        <MenuItem value="contribuicao">Contribuição</MenuItem>
                      </Select>
                    )}
                    name="tipo"
                    control={control}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('nome')}
                  label="Nome da Pessoa (Opcional)"
                  fullWidth
                />
              </Grid>

              {tipo === 'contribuicao' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('valor')}
                      label="Valor"
                      type="number"
                      inputMode="decimal"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('data')}
                      label="Data"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle1">Meses Pagos e Valores</Typography>
                    {Object.entries(getValues('mesesPagos') || {}).map(([mes, valor]) => (
                      <Grid container spacing={2} key={mes}>
                        <Grid item xs={6}>
                          <TextField
                            label={`Mês (${mes})`}
                            value={mes}
                            disabled
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name={`mesesPagos.${mes}`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={`Valor para ${mes}`}
                                type="number"
                                inputMode="decimal"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      variant="contained"
                      onClick={() => {
                        const newMes = prompt('Digite o mês (ex: janeiro, fevereiro, etc.):');
                        const newValue = parseFloat(prompt('Digite o valor para esse mês:') || '0');
                        if (newMes) {
                          setValue(`mesesPagos.${newMes}`, newValue);
                        }
                      }}
                    >
                      Adicionar Mês
                    </Button>
                  </Grid>
                </>
              )}

              {tipo === 'doacao' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('valorTotal')}
                      label="Valor Total"
                      type="number"
                      inputMode="decimal"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('formaPagamento')}
                      label="Forma de Pagamento"
                      fullWidth
                    />
                  </Grid>
                </>
              )}
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
              {loading ? <CircularProgress size={24} /> : 'Adicionar Transação'}
            </Button>
          </CardActions>
        </Card>
      </form>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default ContribuicoesDoacoes;
