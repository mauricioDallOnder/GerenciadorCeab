import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, Container } from '@mui/material';
import { IIgruposDeEstudo } from '@/utils/ultils';
import { GrupoDeEstudoSelectProps } from '../interfaces/interfaces';
import { useCeabContext } from '@/context/context';

const GrupoDeEstudoSelect: React.FC<GrupoDeEstudoSelectProps> = ({ register, setValue, initialValues }) => {
    const [selectedBook, setSelectedBook] = useState<string>(initialValues?.livro || '');
    const [selectedFacilitator, setSelectedFacilitator] = useState<string>(initialValues?.facilitador || '');
    const [selectedDia, setSelectedDia] = useState<string>(initialValues?.dia || '');
    const [selectedTurno, setSelectedTurno] = useState<string>(initialValues?.turno || '');
    const [selectedHorario, setSelectedHorario] = useState<string>(initialValues?.horario || '');
    const [selectedSala, setSelectedSala] = useState<string>(initialValues?.sala || '');
    const [filteredFacilitators, setFilteredFacilitators] = useState<string[]>([]);
    const [filteredDetails, setFilteredDetails] = useState<IIgruposDeEstudo[]>([]);
   const { gruposEstudo, gruposEstudoCarregado } = useCeabContext();
  
    useEffect(() => {
       
        if (initialValues) {
            setSelectedBook(initialValues.livro);
            setSelectedFacilitator(initialValues.facilitador);
            setSelectedDia(initialValues.dia)
        }
    }, [initialValues]);

    // Atualizar facilitadores quando o livro é selecionado
    useEffect(() => {
        if (selectedBook) {
            const facilitators = gruposEstudo
                .filter(g => g.livro === selectedBook)
                .map(g => g.facilitador);

            setFilteredFacilitators(facilitators);

            // Mantém o facilitador selecionado se ainda estiver na lista filtrada
            if (!facilitators.includes(selectedFacilitator)) {
                setSelectedFacilitator('');
                // Resetar os campos dependentes
                setValue('GrupoEstudoInfoField.dia', '');
                setValue('GrupoEstudoInfoField.turno', '');
                setValue('GrupoEstudoInfoField.horario', '');
                setValue('GrupoEstudoInfoField.sala', '');
            }
        }
    }, [selectedBook, selectedFacilitator, setValue]);

    useEffect(() => {
        console.log('Selected Book:', selectedBook);
        console.log('Selected Facilitator:', selectedFacilitator);
        console.log('Filtered Facilitators:', filteredFacilitators);
        console.log('Filtered Details:', filteredDetails);
    }, [selectedBook, selectedFacilitator, filteredFacilitators, filteredDetails]);


    useEffect(() => {
        if (selectedFacilitator) {
            const details = gruposEstudo.filter(g => g.facilitador === selectedFacilitator && g.livro === selectedBook);
            setFilteredDetails(details);
        } else {
            setFilteredDetails([]);
        }
    }, [selectedFacilitator, selectedBook]);

    useEffect(() => {
        if (filteredDetails.length === 1) {
            setSelectedDia(filteredDetails[0].dia);
            setSelectedTurno(filteredDetails[0].turno);
            setSelectedHorario(filteredDetails[0].horario);
            setSelectedSala(filteredDetails[0].sala);
        }
    }, [filteredDetails]);

    const uniqueOptions = (field: keyof typeof gruposEstudo[0]) => {
        console.log(`Unique options for ${field}:`);
        return Array.from(new Set(filteredDetails.map(item => item[field])));
    };

    const handleBookChange = (event: SelectChangeEvent) => {
        const book = event.target.value as string;
        setSelectedBook(book);
        setValue('GrupoEstudoInfoField.facilitador', '');
        setValue('GrupoEstudoInfoField.dia', '');
        setValue('GrupoEstudoInfoField.turno', '');
        setValue('GrupoEstudoInfoField.horario', '');
        setValue('GrupoEstudoInfoField.sala', '');
    };

    const handleFacilitatorChange = (event: SelectChangeEvent) => {
        const facilitator = event.target.value as string;
        setSelectedFacilitator(facilitator);
        // Resetar os campos dependentes
        setValue('GrupoEstudoInfoField.dia', '');
        setValue('GrupoEstudoInfoField.turno', '');
        setValue('GrupoEstudoInfoField.horario', '');
        setValue('GrupoEstudoInfoField.sala', '');
    };

    const handleDiaChange = (event: SelectChangeEvent) => {
        const dia = event.target.value as string;
        setSelectedDia(dia);
    };

    const handleTurnoChange = (event: SelectChangeEvent) => {
        const turno = event.target.value as string;
        setSelectedTurno(turno);
    };

    const handleHorarioChange = (event: SelectChangeEvent) => {
        const horario = event.target.value as string;
        setSelectedHorario(horario);
    };

    const handleSalaChange = (event: SelectChangeEvent) => {
        const sala = event.target.value as string;
        setSelectedSala(sala);
    };

  


    return (
        <Container sx={{ mt: 1 }}>
        {gruposEstudoCarregado && Array.isArray(gruposEstudo) ? (
            <>
                <FormControl fullWidth>
                    <InputLabel id="book-select-label" sx={{ mb: '2px', mt: '16px' }}>Livro</InputLabel>
                    <Select
                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                        labelId="book-select-label"
                        {...register('livro')}
                        value={selectedBook}
                        label="Livro"
                        onChange={handleBookChange}
                    >
                        {gruposEstudo!.map((g, index) => (
                            <MenuItem key={index} value={g.livro}>{g.livro}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel sx={{ mb: '2px', mt: '16px' }}>Facilitador</InputLabel>
                    <Select
                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                        {...register('facilitador')}
                        value={selectedFacilitator}
                        label="Facilitador"
                        onChange={handleFacilitatorChange}
                        disabled={!selectedBook}
                    >
                        {filteredFacilitators.map(facilitator => (
                            <MenuItem key={facilitator} value={facilitator}>{facilitator}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel sx={{ mb: '2px', mt: '16px' }}>Dia</InputLabel>
                    <Select
                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                        {...register('dia')}
                        label="Dia"
                        value={selectedDia}
                        onChange={handleDiaChange}
                        disabled={filteredDetails.length === 0}
                    >
                        {uniqueOptions('dia').map(dia => (
                            <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel sx={{ mb: '2px', mt: '16px' }}>Turno</InputLabel>
                    <Select
                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                        {...register('turno')}
                        label="Turno"
                        onChange={handleTurnoChange}
                        value={selectedTurno}
                        disabled={!selectedFacilitator}
                    >
                        {uniqueOptions('turno').map(turno => (
                            <MenuItem key={turno} value={turno}>{turno}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel sx={{ mb: '2px', mt: '16px' }}>Horário</InputLabel>
                    <Select
                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                        {...register('horario')}
                        label="Horário"
                        onChange={handleHorarioChange}
                        value={selectedHorario}
                        disabled={!selectedFacilitator}
                    >
                        {uniqueOptions('horario').map(horario => (
                            <MenuItem key={horario} value={horario}>{horario}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel sx={{ mb: '2px', mt: '16px' }}>Sala</InputLabel>
                    <Select
                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                        {...register('sala')}
                        label="Sala"
                        onChange={handleSalaChange}
                        value={selectedSala}
                        disabled={!selectedFacilitator}
                    >
                        {uniqueOptions('sala').map(sala => (
                            <MenuItem key={sala} value={sala}>{sala}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </>
        ) : (
            <p>Carregando...</p>
        )}
    </Container>
    );
};

export default GrupoDeEstudoSelect;
