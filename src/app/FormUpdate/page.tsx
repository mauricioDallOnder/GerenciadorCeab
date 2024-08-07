'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { Associado, GrupoEstudoInfoFields } from '../interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Button,
    FormControl,
    SelectChangeEvent,
    Card, CardContent, CardActions, IconButton,
    Chip,
    OutlinedInput,
    FormHelperText,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
} from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    BoxStyleCadastro,
} from "@/utils/styles";
import { DiasSemanas, livrosOrganizados, MenuPropsMultiSelect, normalizeFloatInputValue, tipoMediunidade, tipoVinculoComCeab } from "@/utils/ultils";
import { FormHeader } from "../components/FormHeader";
import { FormSection } from "../components/FormSection";
import { UpdateInputField } from "../components/UpdateInputFields";
import GrupoDeEstudoSelect from '../components/GroupeSelectComponent/UpdateSelectGroupe';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCeabContext } from '@/context/context';

export default function UserUpdateForm() {

    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/Login');
        }
    });
    const { usuariosData } = useCeabContext();
    const { register, handleSubmit, setValue, reset, control, getValues, watch, formState: { errors, isSubmitted } } = useForm<Associado>({
        defaultValues: {
            associacao: {
                tipo: [],
                TipoMediunidade: [],
            },
        },
    });

    const { fields: contribuicaoFields, append: appendContribuicao, remove: removeContribuicao } = useFieldArray({
        control,
        name: "contribuicao",
    });

    const { fields: debitoFields, append: appendDebito, remove: removeDebito } = useFieldArray({
        control,
        name: "possuiDebito",
    });
    const { fields: trabahadorInfoField, append: appendtrabahadorInfo, remove: removetrabahadorInfo } = useFieldArray({
        control,
        name: "trabahadorInfoField",
    });

    const { fields: estudoFields, append: appendEstudo, remove: removeEstudo } = useFieldArray({
        control,
        name: "HistoricoEstudoField",
    });

    const { fields: trabalhoAnteriorFields, append: appendTrabalhoAnterior, remove: removeTrabalho } = useFieldArray({
        control,
        name: "HistoricoTrabalhoField",
    });

    const [loading, setLoading] = useState(false);
    const [VinculoCasa, setVinculoCasa] = React.useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<Associado | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (selectedUser) {
            reset(selectedUser);
            setValue('estadoCivil', selectedUser.estadoCivil);
            setValue('trabahadorInfoField', selectedUser.trabahadorInfoField || []);
            setValue('HistoricoTrabalhoField', selectedUser.HistoricoTrabalhoField || []);
        }
    }, [selectedUser, reset, setValue]);

    const handleChangeMediunidade = (event: SelectChangeEvent<typeof VinculoCasa>) => {
        const {
            target: { value },
        } = event;
        const newValue = typeof value === 'string' ? value.split(',') : value;
        setVinculoCasa(newValue);
        setValue('associacao.TipoMediunidade', newValue);
    };

    const handleChangeVinculoCasa = (event: SelectChangeEvent<typeof VinculoCasa>) => {
        const {
            target: { value },
        } = event;
        const newValue = typeof value === 'string' ? value.split(',') : value;
        setVinculoCasa(newValue);
        setValue('associacao.tipo', newValue);
    };

    const registerForGroup = (fieldName: keyof GrupoEstudoInfoFields) => register(`GrupoEstudoInfoField.${fieldName}` as const);

    const onSubmit: SubmitHandler<Associado> = data => {
        setLoading(true);
        const contribuicoes = data.contribuicao || [];
        const debitos = data.possuiDebito || [];
        const { nome, ...restoDosDados } = data;
        const contribuicoesComValoresConvertidos = contribuicoes.map((contribuicao) => ({
            ...contribuicao,
            valorContribuicao: normalizeFloatInputValue(contribuicao.valorContribuicao!.toString()),
        }));

        const DebitosComValoresConvertidos = debitos.map((debito) => ({
            ...debito,
            valorDebito: normalizeFloatInputValue(debito.valorDebito!.toString()),
        }));
        const novosDados = {
            ...restoDosDados,
            contribuicao: contribuicoesComValoresConvertidos,
            debito: DebitosComValoresConvertidos,
        };

        axios.put('/api/updateDataOnFirebase', { nome, novosDados })
            .then(response => {
                setSuccessMessage('Usuário atualizado com sucesso!');
            })
            .catch(error => {
                alert('Erro ao atualizar usuário');
                console.error('Erro:', error);
            })
            .finally(() => setLoading(false));
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage('');
        reset();
        window.location.reload(); // Recarregar a página
    };

    return (
        <Container
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={BoxStyleCadastro}>
                    <FormHeader titulo='Atualização Cadastral' />
                    <Autocomplete
                        options={usuariosData}
                        getOptionLabel={(option) => option.nome}
                        onChange={(event, value) => {
                            setSelectedUser(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar Usuário"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    <FormSection title="Seção 1 - Dados de Identificação do Associado">
                        <Grid container spacing={2}>
                            <UpdateInputField register={register} name="nome" label="Nome Completo" type='text' />
                            <UpdateInputField register={register} name="cpf" label="CPF" type='text' />
                            <UpdateInputField register={register} name="rg" label="RG" type='text' />
                            <UpdateInputField register={register} name="nascimento" label="Data de Nascimento" type='text' />
                            <UpdateInputField register={register} name="estadoCivil" label="Estado Civil" type='text' />
                            <UpdateInputField register={register} name="naturalidade.cidade" label="Naturalidade" type='text' />
                            <UpdateInputField register={register} name="naturalidade.uf" label="UF de Naturalidade" type='text' />
                            <UpdateInputField register={register} name="dataCadastro" label="Data de Cadastro no aplicativo" type='text' />
                        </Grid>
                    </FormSection>

                    <FormSection title="Seção 2 - Dados de Endereço e Contato">
                        <Grid container spacing={2}>
                            <UpdateInputField register={register} name="endereco.logradouro" label="Rua" type='text' />
                            <UpdateInputField register={register} name="endereco.numero" label="Número" type='number' />
                            <UpdateInputField register={register} name="endereco.cidade" label="Cidade" type='text' />
                            <UpdateInputField register={register} name="endereco.cep" label="CEP" type='text' />
                            <UpdateInputField register={register} name="endereco.uf" label="UF" type='text' />
                            <UpdateInputField register={register} name="endereco.complemento" label="Bairro" type='text' />
                            <UpdateInputField register={register} name="endereco.telefone" label="Telefone" type='text' />
                            <UpdateInputField register={register} name="endereco.email" label="Email" type='email' />
                        </Grid>
                    </FormSection >
                    <FormSection title="Seção 3 - Dados de Associação">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    control={control}
                                    name="associacao.TipoMediunidade"
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl fullWidth error={!!error}>
                                            <InputLabel>Selecione o tipo de mediunidade</InputLabel>
                                            <Select
                                                {...field}
                                                multiple
                                                label='Mediunidade'
                                                value={field.value}
                                                onChange={handleChangeMediunidade}
                                                input={<OutlinedInput label="Mediunidade" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuPropsMultiSelect}>
                                                {tipoMediunidade.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {error && <FormHelperText>{error.message}</FormHelperText>}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    control={control}
                                    name="associacao.tipo"
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl fullWidth error={!!error}>
                                            <InputLabel>Selecione o vínculo com a casa</InputLabel>
                                            <Select
                                                {...field}
                                                multiple
                                                label='Vínculo'
                                                value={field.value}
                                                onChange={handleChangeVinculoCasa}
                                                input={<OutlinedInput label="vínculo com a casa" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuPropsMultiSelect}>
                                                {tipoVinculoComCeab.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {error && <FormHelperText>{error.message}</FormHelperText>}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <UpdateInputField register={register} name="associacao.Tiposocio" label="Tipo de associação" />
                            <UpdateInputField register={register} name="associacao.dataEntrada" label="Data de entrada na casa" type='string' />
                            <UpdateInputField register={register} name="numeroRegistroAssociado" label="Número do Associado " type='number' />
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
                                    O usuário assinou o termo de voluntário?
                                </Typography>
                                <Grid container alignItems="center">
                                    <Controller
                                        name="associacao.assinoutermo"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={field.value === 'Sim'}
                                                            onChange={(e) => field.onChange(e.target.checked ? 'Sim' : '')}
                                                        />
                                                    }
                                                    label="Sim"
                                                    style={{ color: "black" }}
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={field.value === 'Não'}
                                                            onChange={(e) => field.onChange(e.target.checked ? 'Não' : '')}
                                                        />
                                                    }
                                                    label="Não"
                                                    style={{ color: "black" }}
                                                />
                                            </>
                                        )}
                                    />
                                </Grid>
                                <Typography sx={{ color: "red", fontSize: "0.75rem" }}>
                                    {errors.associacao?.assinoutermo ? "Resposta obrigatória" : ""}
                                </Typography>
                            </Grid>
                        </Grid>
                    </FormSection>
                    <>
                        <FormSection title="Seção 4 - Grupo de estudo">
                            <Grid container spacing={2}>
                                <Controller
                                    name={"GrupoEstudoInfoField"}
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <GrupoDeEstudoSelect
                                                {...field}
                                                register={registerForGroup}
                                                setValue={setValue}
                                                initialValues={selectedUser?.GrupoEstudoInfoField}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </FormSection>

                        <FormSection title="Seção 5 - Estudos Anteriores">
                            <Container >
                                <Grid container spacing={2}  >
                                    {estudoFields.map((field, index) => (
                                        <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, mt: 4, width: '100%' }}>
                                            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Selecione um livro que você já estudou</InputLabel>
                                                    <Controller
                                                        control={control}
                                                        name={`HistoricoEstudoField.${index}.livro`}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                label="Livro"
                                                                value={field.value || ''}
                                                                onChange={field.onChange}
                                                            >
                                                                {livrosOrganizados.map(livro => (
                                                                    <MenuItem key={livro} value={livro}>{livro}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                </FormControl>
                                                <TextField
                                                    {...register(`HistoricoEstudoField.${index}.ano`)}
                                                    label="Em qual ano você fez esse estudo? Ex: '2014 a 2016' ou apenas '2019'"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                                <TextareaAutosize
                                                    {...register(`HistoricoEstudoField.${index}.observacoes`)}
                                                    placeholder="Escreva aqui os cursos, seminários ou outros estudos que você já realizou"
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        resize: 'vertical',
                                                    }}
                                                />
                                            </CardContent>
                                            <CardActions>
                                                <IconButton color="error" onClick={() => removeEstudo(index)}>
                                                    <DeleteIcon />
                                                    <Typography sx={{ color: "red", ml: "2px" }}>Remover Estudos Adicionados</Typography>
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    ))}
                                </Grid>
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    variant="contained"
                                    color="success"
                                    onClick={() => appendEstudo({ livro: "", ano: "", observacoes: "" })}
                                    sx={{ mt: 2, width: '100%' }}
                                >
                                    Clique aqui para adicionar estudos já realizados
                                </Button>
                            </Container>
                        </FormSection>
                        <FormSection title="Seção 6 - Trabalho na casa">
                            <Grid container spacing={2}>
                                <Container>
                                    {trabahadorInfoField.map((field, index) => (
                                        <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, mt: 4, width: '100%' }}>
                                            <CardContent sx={{ mt: 1, display: "flex", gap: "10px" }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sx={{ width: "100%" }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel sx={{ mb: '2px', mt: '16px' }}>Selecione o Dia de Trabalho</InputLabel>
                                                            <Controller
                                                                name={`trabahadorInfoField.${index}.diaTrabalha`}
                                                                control={control}
                                                                defaultValue={field.diaTrabalha}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label="Selecione o Dia de Trabalho"
                                                                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                                                                    >
                                                                        <MenuItem value="-">-</MenuItem>
                                                                        <MenuItem value="Segunda">Segunda</MenuItem>
                                                                        <MenuItem value="Terça">Terça</MenuItem>
                                                                        <MenuItem value="Quarta">Quarta</MenuItem>
                                                                        <MenuItem value="Quinta">Quinta</MenuItem>
                                                                        <MenuItem value="Sexta">Sexta</MenuItem>
                                                                        <MenuItem value="Sábado">Sábado</MenuItem>
                                                                        <MenuItem value="Domingo">Domingo</MenuItem>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ width: "100%" }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel sx={{ mb: '2px', mt: '16px' }}>Selecione o Turno de Trabalho</InputLabel>
                                                            <Controller
                                                                name={`trabahadorInfoField.${index}.turnoDeTrabalho`}
                                                                control={control}
                                                                defaultValue={field.turnoDeTrabalho}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label='Selecione o Turno de Trabalho'
                                                                        sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                                                                    >
                                                                        <MenuItem value="-">-</MenuItem>
                                                                        <MenuItem value="Manhã">Manhã</MenuItem>
                                                                        <MenuItem value="Tarde">Tarde</MenuItem>
                                                                        <MenuItem value="Noite">Noite</MenuItem>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton color="error" onClick={() => removetrabahadorInfo(index)}>
                                                    <DeleteIcon />
                                                    <Typography sx={{ color: "red", ml: "2px" }}>Remover dia de trabalho</Typography>
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    ))}
                                    <Button
                                        startIcon={<AddCircleOutlineIcon />}
                                        variant="contained"
                                        color="success"
                                        onClick={() => appendtrabahadorInfo({ diaTrabalha: "", turnoDeTrabalho: "", id: uuidv4() })}
                                        sx={{ mt: 2, width: '100%' }}
                                    >
                                        Adicionar dia de trabalho
                                    </Button>
                                </Container>
                            </Grid>
                        </FormSection >

                        <FormSection title="Seção 7 - Trabalhos já realizados para a casa">
                            <Container>
                                <InputLabel sx={{ color: "black", mb: '2px', mt: '16px', textAlign: "center" }}>
                                    Você já realizou trabalhos anteriores para a casa?
                                </InputLabel>
                                <Select
                                    variant="filled"
                                    fullWidth
                                    {...register("trabalhosAnteriores")}
                                    sx={{ mb: "2px", marginLeft: '2px', mt: '12px', textAlign: "center" }}
                                    defaultValue="nao"
                                >
                                    <MenuItem value="sim">Sim</MenuItem>
                                    <MenuItem value="nao">Não</MenuItem>
                                </Select>
                                {watch("trabalhosAnteriores") === "sim" && (
                                    <FormSection title="Informe abaixo os trabalhos que você já realizou">
                                        <Grid container spacing={2}>
                                            {trabalhoAnteriorFields.map((field, index) => (
                                                <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, mt: 4, width: '100%' }}>
                                                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                        <FormControl fullWidth>

                                                            <TextField
                                                                {...register(`HistoricoTrabalhoField.${index}.funcao`)}
                                                                label="Exemplo: Eu trabalhei na portaria distribuindo fichas..."
                                                                variant="outlined"
                                                                fullWidth
                                                            />
                                                        </FormControl>
                                                        <TextField
                                                            {...register(`HistoricoTrabalhoField.${index}.ano`)}
                                                            label="Em qual ano/período você fez esse trabalho?"
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <TextareaAutosize
                                                            {...register(`HistoricoTrabalhoField.${index}.observacoes`)}
                                                            placeholder="Escreva aqui outras observações relevantes acerca do trabalho realizado"
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                resize: 'vertical',
                                                            }}
                                                        />
                                                    </CardContent>
                                                    <CardActions>
                                                        <IconButton color="error" onClick={() => removeTrabalho(index)}>
                                                            <DeleteIcon />
                                                            <Typography sx={{ color: "red", ml: "2px" }}>Remover Trabalho Adicionado</Typography>
                                                        </IconButton>
                                                    </CardActions>
                                                </Card>
                                            ))}
                                        </Grid>
                                        <Button
                                            startIcon={<AddCircleOutlineIcon />}
                                            variant="contained"
                                            color="success"
                                            onClick={() => appendTrabalhoAnterior({ funcao: "", ano: "", observacoes: "" })}
                                            sx={{ mt: 2, width: '100%' }}
                                        >
                                            Clique aqui para informar mais trabalhos que você já realizou.
                                        </Button>
                                    </FormSection>
                                )}
                            </Container>
                        </FormSection>
                    </>

                    <FormSection title="Seção 8 - Observações">
                        <Grid container spacing={2} sx={{ mt: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                                    '&:focus-within': {
                                        boxShadow: '0px 0px 0px 2px #1976d2',
                                    },
                                }}
                            >
                                <TextareaAutosize
                                    aria-label="Observações"
                                    minRows={3}
                                    placeholder="Digite suas observações aqui..."
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        resize: 'vertical',
                                        padding: '8px',
                                        borderRadius: '4px',
                                    }}
                                    {...register("observacoes")}
                                />
                            </Box>
                        </Grid>
                    </FormSection>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={loading}
                        sx={{ width: "100%" }}
                    >
                        {loading ? "Atualizando dados, aguarde..." : "Atualizar Cadastro"}
                    </Button>
                </Box>
            </form>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
