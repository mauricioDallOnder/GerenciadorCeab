import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MenuItem, FormControl, InputLabel, Select, Box, SelectChangeEvent, Container } from '@mui/material';
import { gruposDeEstudo } from '@/utils/ultils';
import { GrupoDeEstudoSelectProps } from '../interfaces/interfaces';

const GrupoDeEstudoSelect: React.FC<GrupoDeEstudoSelectProps> = ({ register, setValue, initialValues }) => {
    const [selectedBook, setSelectedBook] = useState<string>(initialValues?.livro || '');
    const [selectedFacilitator, setSelectedFacilitator] = useState<string>(initialValues?.facilitador || '');
    const [selectedDia, setSelectedDia] = useState<string>(initialValues?.dia || '');
    const [selectedTurno, setSelectedTurno] = useState<string>(initialValues?.turno || '');
    const [selectedHorario, setSelectedHorario] = useState<string>(initialValues?.horario || '');
    const [selectedSala, setSelectedSala] = useState<string>(initialValues?.sala || '');
    const [filteredFacilitators, setFilteredFacilitators] = useState<string[]>([]);
    const [filteredDetails, setFilteredDetails] = useState<typeof gruposDeEstudo>([]);

    useEffect(() => {
        console.log('Initial Values:', initialValues);
        if (initialValues) {
            setSelectedBook(initialValues.livro);
            setSelectedFacilitator(initialValues.facilitador);
            setSelectedDia(initialValues.dia)
        }
    }, [initialValues]);

    // Atualizar facilitadores quando o livro é selecionado
    useEffect(() => {
        if (selectedBook) {
            const facilitators = gruposDeEstudo
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
        if (selectedFacilitator) {
            const details = gruposDeEstudo
                .filter(g => g.facilitador === selectedFacilitator && g.livro === selectedBook);
            setFilteredDetails(details);
        } else {
            setFilteredDetails([]);
        }
    }, [selectedFacilitator, selectedBook]);

    const uniqueOptions = (field: keyof typeof gruposDeEstudo[0]) => {
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
        <Container>
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
                    {gruposDeEstudo.map((g, index) => (
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
                    disabled={!selectedFacilitator}
                    onChange={handleDiaChange}
                    value={selectedDia}
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
                    disabled={!selectedFacilitator}
                    onChange={handleTurnoChange}
                    value={selectedTurno}
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
                    disabled={!selectedFacilitator}
                    onChange={handleHorarioChange}
                    value={selectedHorario}

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
                    disabled={!selectedFacilitator}
                    onChange={handleSalaChange}
                    value={selectedSala}
                >
                    {uniqueOptions('sala').map(sala => (
                        <MenuItem key={sala} value={sala}>{sala}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
};

export default GrupoDeEstudoSelect;
