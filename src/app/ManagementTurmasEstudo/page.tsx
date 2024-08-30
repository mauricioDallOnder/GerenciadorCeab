'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent, Box, AppBar, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useCeabContext } from '@/context/context';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BoxStyleCadastro } from '@/utils/styles';
import { FormHeader } from '../components/FormHeader';

interface Turma {
  dia: string;
  facilitador: string;
  horario: string;
  livro: string;
  sala: string;
  turno: string;
  uuid?: string;
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, bgcolor: 'transparent', borderRadius: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ManageTurmas() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/Login');
    }
  });

  const { gruposEstudoCarregado } = useCeabContext(); // Modifique para apenas carregar dados uma vez
  const [gruposEstudo, setGruposEstudo] = useState<Turma[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [formValues, setFormValues] = useState<Omit<Turma, 'uuid'>>({
    dia: '',
    facilitador: '',
    horario: '',
    livro: '',
    sala: '',
    turno: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Função para carregar os dados das turmas
  const loadTurmas = async () => {
    try {
      const response = await axios.get('/api/getTurmasEstudoFirebase');
      setGruposEstudo(response.data);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    }
  };

  useEffect(() => {
    if (!gruposEstudoCarregado) {
      loadTurmas(); // Carrega turmas se não estiverem carregadas ainda
    }
  }, [gruposEstudoCarregado]);

  const turmas = gruposEstudo.map(grupo => ({
    ...grupo,
    nomeTurma: `${grupo.livro} - ${grupo.dia} - ${grupo.horario}`,
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const selected = turmas.find(turma => turma.uuid === e.target.value);
    if (selected) {
      setSelectedTurma(selected);
      setFormValues(selected);
    } else {
      setSelectedTurma(null);
      setFormValues({
        dia: '',
        facilitador: '',
        horario: '',
        livro: '',
        sala: '',
        turno: '',
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedTurma) {
        await axios.put('/api/CRUDTurmasOnFirebase', {
          uuid: selectedTurma.uuid,
          novosDados: formValues,
        });
        setSuccessMessage('Turma atualizada com sucesso!');
      } else {
        const newTurma = { ...formValues };
        await axios.post('/api/CRUDTurmasOnFirebase', newTurma);
        setSuccessMessage('Turma criada com sucesso!');
      }
      await loadTurmas(); // Recarrega as turmas para atualizar a lista
    } catch (error) {
      console.error('Erro ao realizar operação:', error);
    } finally {
      setLoading(false);
      setFormValues({
        dia: '',
        facilitador: '',
        horario: '',
        livro: '',
        sala: '',
        turno: '',
      });
      setSelectedTurma(null);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (selectedTurma && selectedTurma.uuid) {
        await axios.delete('/api/CRUDTurmasOnFirebase', {
          data: { uuid: selectedTurma.uuid },
        });
        setSuccessMessage('Turma deletada com sucesso!');
      }
      await loadTurmas(); // Recarrega as turmas para atualizar a lista
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
    } finally {
      setLoading(false);
      setFormValues({
        dia: '',
        facilitador: '',
        horario: '',
        livro: '',
        sala: '',
        turno: '',
      });
      setSelectedTurma(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    // Não recarregar a página inteira, apenas atualizar a lista
    loadTurmas();
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 0 }}>
      <Box sx={BoxStyleCadastro}>
        <FormHeader titulo='Gerenciador de Turmas' />
        <AppBar position="static" sx={{ backgroundColor: '#2e3b55', mt:"10px" }}>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Criar Turma" />
            <Tab label="Atualizar Turma" />
            <Tab label="Excluir Turma" />
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Dia"
              name="dia"
              value={formValues.dia}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Facilitador"
              name="facilitador"
              value={formValues.facilitador}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Horário"
              name="horario"
              value={formValues.horario}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Livro"
              name="livro"
              value={formValues.livro}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Sala"
              name="sala"
              value={formValues.sala}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Turno"
              name="turno"
              value={formValues.turno}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Aguarde, criando a nova turma" : "Criar Nova Turma"}
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <FormControl fullWidth>
            <InputLabel id="turma-select-label">Selecionar Turma para Atualizar</InputLabel>
            <Select
              labelId="turma-select-label"
              value={selectedTurma ? selectedTurma.uuid : ''}
              onChange={handleSelectChange}
              sx={{ color: 'black' }}
            >
              {turmas.map((turma) => (
                <MenuItem sx={{ color: 'black' }} key={turma.uuid} value={turma.uuid}>{turma.nomeTurma}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Dia"
              name="dia"
              value={formValues.dia}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Facilitador"
              name="facilitador"
              value={formValues.facilitador}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Horário"
              name="horario"
              value={formValues.horario}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Livro"
              name="livro"
              value={formValues.livro}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Sala"
              name="sala"
              value={formValues.sala}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Turno"
              name="turno"
              value={formValues.turno}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Aguarde, atualizando turma" : "Atualizar Turma"}
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <FormControl fullWidth>
            <InputLabel id="turma-delete-select-label">Selecionar Turma para Excluir</InputLabel>
            <Select
              labelId="turma-delete-select-label"
              value={selectedTurma ? selectedTurma.uuid : ''}
              onChange={handleSelectChange}
              sx={{ color: 'black' }}
            >
              {turmas.map((turma) => (
                <MenuItem sx={{ color: 'black' }} key={turma.uuid} value={turma.uuid}>{turma.nomeTurma}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedTurma && (
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              sx={{ marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? "Aguarde, deletando turma" : "Deletar Turma"}
            </Button>
          )}
        </TabPanel>
      </Box>
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
