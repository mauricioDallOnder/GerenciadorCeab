import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, Container } from '@mui/material';
import { GrupoDeEstudoSelectProps } from '@/app/interfaces/interfaces';
import { useCeabContext } from '@/context/context';
import { IIgruposDeEstudo } from '@/utils/ultils';



const UpdateSelectGroupe: React.FC<GrupoDeEstudoSelectProps> = ({ register, setValue, initialValues }) => {
    const { gruposEstudo, gruposEstudoCarregado } = useCeabContext();
    const [selectedBook, setSelectedBook] = useState<string>(initialValues?.livro || '');
    const [selectedFacilitator, setSelectedFacilitator] = useState<string>(initialValues?.facilitador || '');
    const [selectedDia, setSelectedDia] = useState<string>(initialValues?.dia || '');
    const [selectedTurno, setSelectedTurno] = useState<string>(initialValues?.turno || '');
    const [selectedHorario, setSelectedHorario] = useState<string>(initialValues?.horario || '');
    const [selectedSala, setSelectedSala] = useState<string>(initialValues?.sala || '');
    const [selectedUUid, setSelectedUUid] = useState<string>(initialValues?.uuid || '');
    const [filteredFacilitators, setFilteredFacilitators] = useState<string[]>([]);
    const [filteredDetails, setFilteredDetails] = useState<IIgruposDeEstudo[]>([]);

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
                setValue('GrupoEstudoInfoField.uuid', '');
            }
        }
    }, [selectedBook, selectedFacilitator, setValue]);

    useEffect(() => {
        if (selectedFacilitator) {
            const details = gruposEstudo.filter(g => g.facilitador === selectedFacilitator && g.livro === selectedBook);
            setFilteredDetails(details);
            if (details.length === 1) {
                setSelectedUUid(details[0].uuid);
                setValue('GrupoEstudoInfoField.uuid', details[0].uuid);
            }
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
            setSelectedUUid(filteredDetails[0].uuid);
            setValue("GrupoEstudoInfoField.uuid", filteredDetails[0].uuid);
        }
    }, [filteredDetails]);
    


    const uniqueOptions = (field: keyof typeof gruposEstudo[0]) => {
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
                    {gruposEstudo.map((g, index) => (
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
                defaultValue='-'
                sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
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
                  defaultValue='-'
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
                    defaultValue='-'

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
                      defaultValue='-'

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

export default UpdateSelectGroupe;