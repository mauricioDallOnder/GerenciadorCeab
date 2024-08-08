import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Container, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

interface RowData {
  id: number;
  nome: string;
  valor: number;
  data: string;
  tipo: string;
  valorTotal: number;
  mesesPagos: number;
}

const ContribuicoesDoacoes: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    data: '',
    tipo: '',
    valorTotal: '',
    mesesPagos: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/ApiContribuicoesDoacoes');
      if (Array.isArray(response.data)) {
        setRows(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        setRows([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/ApiContribuicoesDoacoes', {
        ...formData,
      });
      fetchData();
      setFormData({
        nome: '',
        valor: '',
        data: '',
        tipo: '',
        valorTotal: '',
        mesesPagos: '',
      });
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('/api/ApiContribuicoesDoacoes', {
        ...formData,
      });
      fetchData();
      setFormData({
        nome: '',
        valor: '',
        data: '',
        tipo: '',
        valorTotal: '',
        mesesPagos: '',
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (id: GridRowId) => {
    try {
      await axios.delete('/api/ApiContribuicoesDoacoes', {
        data: { id },
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'valor', headerName: 'Valor', width: 110 },
    { field: 'data', headerName: 'Data de Pagamento', width: 160 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    { field: 'valorTotal', headerName: 'Valor Total', width: 130 },
    { field: 'mesesPagos', headerName: 'Meses Pagos', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <TextField
          name="nome"
          label="Nome"
          value={formData.nome}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="valor"
          label="Valor"
          value={formData.valor}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="data"
          label="Data de Pagamento"
          value={formData.data}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="tipo"
          label="Tipo"
          value={formData.tipo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="valorTotal"
          label="Valor Total"
          value={formData.valorTotal}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="mesesPagos"
          label="Meses Pagos"
          value={formData.mesesPagos}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mr: 2 }}>
            Create
          </Button>
          <Button variant="contained" color="warning" onClick={handleUpdate}>
            Update
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 400, width: '100%', mt: 4 }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection />
      </Box>
    </Container>
  );
};

export default ContribuicoesDoacoes;
