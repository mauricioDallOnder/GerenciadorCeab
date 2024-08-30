import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Grid, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { BoxStyleFinanca, StyledDataGrid } from '@/utils/styles';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CustomPagination from '../TableCustomPagination';

interface ContribuicaoDoacao {
  id: string;
  tipo: string;
  nome: string;
  data: string; // Mantenha como string
  formaPagamento: string;
  valorPagoDoacao: number;
  valorTotalPagoContribuicao: number;
  ValorContribJan: number;
  ValorContribFev: number;
  ValorContribMar: number;
  ValorContribAbr: number;
  ValorContribMai: number;
  ValorContribJun: number;
  ValorContribJul: number;
  ValorContribAgo: number;
  ValorContribSet: number;
  ValorContribOut: number;
  ValorContribNov: number;
  ValorContribDez: number;
  observação?:string;
}

const ContribuicoesDoacoes: React.FC = () => {
  const [rows, setRows] = useState<ContribuicaoDoacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<{ [key: string]: boolean }>({});
  const { control, register, handleSubmit, reset, setValue, watch } = useForm<ContribuicaoDoacao>({
    defaultValues: {
      id: '',
      tipo: '',
      nome: '',
      data: '',
      formaPagamento: '',
      valorPagoDoacao: 0,
      valorTotalPagoContribuicao: 0,
      ValorContribJan: 0,
      ValorContribFev: 0,
      ValorContribMar: 0,
      ValorContribAbr: 0,
      ValorContribMai: 0,
      ValorContribJun: 0,
      ValorContribJul: 0,
      ValorContribAgo: 0,
      ValorContribSet: 0,
      ValorContribOut: 0,
      ValorContribNov: 0,
      ValorContribDez: 0,
      observação:""
    },
  });

  const selectedTipo = watch("tipo");

  const parseDateToSort = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };
  

  useEffect(() => {
    setLoading(true);
    axios.get<ContribuicaoDoacao[]>('/api/ApiContribuicoesDoacoes')
        .then(response => {
            if (Array.isArray(response.data)) {
                const formattedData = response.data.map(row => ({
                    ...row,
                    data: formatDate(new Date(row.data)), // Formata para dd/MM/yyyy
                }));
                const sortedData = formattedData.sort(
                    (a, b) => new Date(a.data.split('/').reverse().join('-')).getTime() - new Date(b.data.split('/').reverse().join('-')).getTime()
                );
                console.log(sortedData);
                setRows(sortedData); // Garante que data é string formatada
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

  


  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};



  const calculateTotalContributions = (data: ContribuicaoDoacao) => {
    return Object.keys(data)
      .filter(key => key.startsWith('ValorContrib'))
      .reduce((acc, key) => acc + Number(data[key as keyof ContribuicaoDoacao]), 0);
  };
  

  const onSubmit = (data: ContribuicaoDoacao) => {
    const dateObj = new Date(data.data); // Converte string para objeto Date
    const formattedDate = formatDate(dateObj); // Formata para dd/MM/yyyy

    const newContribuicaoDoacao = {
        ...data,
        id: uuidv4(),
        data: formattedDate, // Usa a data formatada
        valorTotalPagoContribuicao: calculateTotalContributions(data),
    };
    setLoading(true);
    axios.post('/api/ApiContribuicoesDoacoes', newContribuicaoDoacao)
        .then(response => {
            setRows(prevRows => [...prevRows, newContribuicaoDoacao]);
            reset();
        })
        .catch(error => {
            console.error('Erro ao adicionar contribuição/doação:', error);
        })
        .finally(() => {
            setLoading(false);
        });
};

  const handleDelete = (id: string) => {
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    axios.delete('/api/ApiContribuicoesDoacoes', { data: { id } })
      .then(response => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar contribuição/doação:', error);
      })
      .finally(() => {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      });
  };

  const handleRowClick = (params: GridRowParams) => {
    const selectedRow = params.row as ContribuicaoDoacao;
    Object.keys(selectedRow).forEach(key => {
      setValue(key as keyof ContribuicaoDoacao, selectedRow[key as keyof ContribuicaoDoacao]);
    });
  };

  const handleSaveChanges = async () => {
    const formData = watch();
    const updatedRow = {
      ...formData,
      valorTotalPagoContribuicao: calculateTotalContributions(formData),
    };
  
    setLoading(true);
    try {
      await axios.put('/api/ApiContribuicoesDoacoes', updatedRow); // Certifique-se de que o endpoint PUT é chamado aqui
      setRows(prevRows =>
        prevRows.map(row => (row.id === formData.id ? updatedRow : row))
      );
      reset();
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      alert('Erro ao atualizar dados.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const columns: GridColDef[] = [
    { field: 'data', headerName: 'Data', width: 150, editable: false },
    { field: 'tipo', headerName: 'Tipo', width: 150, editable: false },
    { field: 'nome', headerName: 'Nome', width: 200, editable: false },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 200, editable: false },
    { field: 'valorPagoDoacao', headerName: 'Valor Pago (Doação)', width: 150, editable: false },
    { field: 'valorTotalPagoContribuicao', headerName: 'Valor Total Pago (Contribuição)', width: 200 },
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
  ];

  return (
    <Box sx={BoxStyleFinanca}>
      <Typography variant="h6" gutterBottom>
        Contribuições/Doações
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('nome')}
                  label="Nome"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select {...field} fullWidth>
                        <MenuItem value="contribuicao">Contribuição</MenuItem>
                        <MenuItem value="doacao">Doação</MenuItem>
                      </Select>
                    )}
                    name="tipo"
                    control={control}
                  />
                </FormControl>
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
                  name="data"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              {selectedTipo === 'contribuicao' && (
                <>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribJan"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Janeiro"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribFev"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Fevereiro"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribMar"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Março"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribAbr"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Abril"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribMai"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Maio"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribJun"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Junho"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribJul"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Julho"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribAgo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Agosto"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribSet"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Setembro"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribOut"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Outubro"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribNov"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Novembro"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="ValorContribDez"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contribuição Dezembro"
                          type="number"
                          fullWidth
                          inputMode="decimal"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                <TextField
                  {...register('observação')}
                  label="observações"
                  fullWidth
                />
              </Grid>
                </>
              )}
              {selectedTipo === 'doacao' && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="valorPagoDoacao"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Valor Pago (Doação)"
                        type="number"
                        inputMode="decimal"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
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
              {loading ? <CircularProgress size={24} /> : 'Adicionar Contribuição/Doação'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Atualizar'}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => reset()} // Usando a função reset do react-hook-form
              disabled={loading}
            >
              Limpar os campos do formulário!
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
          onRowClick={handleRowClick}
          slots={{
            pagination: CustomPagination,
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default ContribuicoesDoacoes;