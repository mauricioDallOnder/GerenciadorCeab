'use client'
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray, FormProvider, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { Associado } from '../interfaces/interfaces';
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
} from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    BoxStyleCadastro,
} from "@/utils/styles";
import { DiasSemanas, MenuPropsDiasSemanas, normalizeFloatInputValue, Typevinculo } from "@/utils/ultils";
import { FormHeader } from "../components/FormHeader";
import { FormSection } from "../components/FormSection";
import { UpdateInputField } from "../components/UpdateInputFields";

export default function UserUpdateForm() {
    const { register, handleSubmit, setValue, reset, control, getValues, formState: { errors, isSubmitted } } = useForm<Associado>({
        defaultValues: {
            associacao: {
                diaVinculo: [], // array vazio
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
    const [usuarios, setUsuarios] = useState<Associado[]>([]);
    const [loading, setLoading] = useState(false);
    const [DiaSemanaFrequentado, setDiaSemanaFrequentado] = React.useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<Associado | null>(null);

    useEffect(() => {
        if (selectedUser) {
            // Reset de todos os campos
            reset(selectedUser);
            // Configuração individual dos campos
            setValue('estadoCivil', selectedUser.estadoCivil);
            setValue('GrupoEstudoInfoField.diaEstuda', selectedUser.GrupoEstudoInfoField.diaEstuda)
            // Repita para outros campos conforme necessário
        }
    }, [selectedUser, reset, setValue]);



    useEffect(() => {
        // Carregar a lista de usuários para o Autocomplete
        axios.get('/api/getDataFromFirebase') // Substitua por sua URL de API real para buscar usuários
            .then(response => {
                // Verificar se a resposta não é um array e convertê-la em array
                if (!Array.isArray(response.data)) {
                    const transformed = Object.entries(response.data).map(([key, value]) => ({
                        id: key,
                        ...value as Associado
                    }));
                    setUsuarios(transformed);
                } else {
                    console.error('Resposta não é um array:', response.data);
                }
            })
            .catch(error => console.error('Erro ao buscar usuários:', error));
    }, []);


    const handleChangeDiaSemanaFrequentado = (event: SelectChangeEvent<typeof DiaSemanaFrequentado>) => {
        const {
            target: { value },
        } = event;
        //console.log("Before split:", value); // Veja o que está recebendo antes do split
        const newValue = typeof value === 'string' ? value.split(',') : value;
        //console.log("After split:", newValue); // Confira o novo valor após o split
        setDiaSemanaFrequentado(newValue);
        setValue('associacao.diaVinculo', newValue);
    };


    const onSubmit: SubmitHandler<Associado> = data => {
        setLoading(true);
        const { nome, ...restoDosDados } = data;
        // Itera sobre cada contribuição para converter os valores de string para número
        const contribuicoesComValoresConvertidos = data.contribuicao!.map(
            (contribuicao) => ({
                ...contribuicao,
                valorContribuicao: normalizeFloatInputValue(contribuicao.valorContribuicao!.toString()),
            })
        );

        const DebitosComValoresConvertidos = data.possuiDebito!.map(
            (debito) => ({
                ...debito,
                valorDebito: normalizeFloatInputValue(debito.valorDebito!.toString()),
            })
        );
        const novosDados = {
            ...restoDosDados,
            contribuicao: contribuicoesComValoresConvertidos,
            debito: DebitosComValoresConvertidos
        };


        axios.put('/api/updateDataOnFirebase', { nome, novosDados })
            .then(response => {
                alert('Usuário atualizado com sucesso!');
                reset()
                console.log(response.data);
            })
            .catch(error => {
                alert('Erro ao atualizar usuário');
                console.error('Erro:', error);
            })
            .finally(() => setLoading(false));
    };




    return (
        <Container
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={BoxStyleCadastro}>
                    <FormHeader titulo='Atualização Cadastral' />
                    <Autocomplete
                        options={usuarios}
                        getOptionLabel={(option) => option.nome}
                        onChange={(event, value) => {
                            setSelectedUser(value); // Atualiza o usuário selecionado
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
                            <UpdateInputField register={register} name="nascimento" label="Data de Nascimento" type='date' />
                            <UpdateInputField register={register} name="estadoCivil" label="Estado Civil" type='text' />
                            <UpdateInputField register={register} name="naturalidade.cidade" label="Naturalidade" type='text' />
                            <UpdateInputField register={register} name="naturalidade.uf" label="UF de Naturalidade" type='text' />
                        </Grid>
                    </FormSection>

                    <FormSection title="Seção 2 - Dados de Endereço e Contato">
                        <Grid container spacing={2}>
                            <UpdateInputField register={register} name="endereco.logradouro" label="Rua" type='text' />
                            <UpdateInputField register={register} name="endereco.numero" label="Número" type='number' />
                            <UpdateInputField register={register} name="endereco.cidade" label="Cidade" type='text' />
                            <UpdateInputField register={register} name="endereco.cep" label="CEP" type='text' />
                            <UpdateInputField register={register} name="endereco.uf" label="UF" type='text' />
                            <UpdateInputField register={register} name="endereco.complemento" label="Complemento" type='text' />
                            <UpdateInputField register={register} name="endereco.telefone" label="Telefone" type='text' />
                            <UpdateInputField register={register} name="endereco.email" label="Email" type='email' />
                        </Grid>
                    </FormSection >
                    <FormSection title="Seção 3 - Dados de Associação">
                        <Grid container spacing={2}>
                            <UpdateInputField register={register} name="associacao.tipo.0" label="Vinculo" type='text' />
                            {/* Select Multiplo para poder selecionar varios dias que o usuário frequentará a casa*/}
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Dia(s) que ele frequentará a casa</InputLabel>
                                <Controller
                                    control={control}
                                    name="associacao.diaVinculo"
                                    render={({ field, fieldState: { error } }) => (
                                        <FormControl fullWidth error={!!error}>
                                            <Select
                                                {...field}
                                                multiple
                                                value={field.value} // Use `field.value` em vez de `defaultValue`
                                                onChange={handleChangeDiaSemanaFrequentado}
                                                input={<OutlinedInput label="Dia(s) que ele frequentará a casa" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuPropsDiasSemanas}>
                                                {DiasSemanas.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <UpdateInputField register={register} name="associacao.dataEntrada" label="Data de entrada na casa" type='date' />
                            <UpdateInputField register={register} name="numeroRegistroAssociado" label="Número do Associado " type='number' />
                        </Grid>
                    </FormSection>

                    {/* Campos estudante */}
                    <FormSection title="Seção 5 - Dados do Estudante">
                        <Grid container spacing={2}>
                            <UpdateInputField register={register} name="GrupoEstudoInfoField.turmaEstudo" label="Nome da Turma" type='text' />
                            <UpdateInputField register={register} name="GrupoEstudoInfoField.nomeFacilitador" label="Nome do Facilitador" type='text' />
                            <UpdateInputField register={register} name="GrupoEstudoInfoField.numeroSala" label="Nº da sala" type='number' />
                            <UpdateInputField register={register} name=" GrupoEstudoInfoField.diaEstuda" label="Dia que estuda na casa" type='text' />
                        </Grid>
                    </FormSection >
                    {/* Campos trabalhador/voluntário */}
                    <FormSection title="Seção 6 - Dados do Trabalhador/Voluntário">
                        <Grid container spacing={2}>
                            <Container>
                                {trabahadorInfoField.map((field, index) => (
                                    <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, width: '100%' }}>
                                        <CardContent sx={{ mt: 2, display: "flex", gap: "10px" }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sx={{ width: "100%" }}>
                                                    <Controller
                                                        name={`trabahadorInfoField.${index}.diaTrabalha`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                <InputLabel>Dia de Trabalho</InputLabel>
                                                                <Select
                                                                    {...field}
                                                                    label="Dia de Trabalho"
                                                                    defaultValue="-"
                                                                >
                                                                    {DiasSemanas.map((name) => (
                                                                        <MenuItem key={name} value={name}>{name}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    />

                                                </Grid>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`trabahadorInfoField.${index}.funcao` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Função que Exerce"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`trabahadorInfoField.${index}.nomeDirigente` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Nome do Dirigente do Trabalho"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ width: "100%" }}>
                                                    <Controller
                                                        name={`trabahadorInfoField.${index}.turnoDeTrabalho`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                <InputLabel sx={{ mb: '2px', mt: '16px' }}>Selecione o Turno de Trabalho</InputLabel>
                                                                <Select
                                                                    {...field}
                                                                    label="Selecione o Turno de Trabalho"
                                                                    sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                                                                    defaultValue=""
                                                                >
                                                                    <MenuItem value="Manhã">Manhã</MenuItem>
                                                                    <MenuItem value="Tarde">Tarde</MenuItem>
                                                                    <MenuItem value="Noite">Noite</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`trabahadorInfoField.${index}.horarioDeTrabalho` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Horário de Trabalho"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        type='time'
                                                        variant="outlined"
                                                    />
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
                                    onClick={() => appendtrabahadorInfo({ diaTrabalha: "", funcao: "", nomeDirigente: "", turnoDeTrabalho: "", horarioDeTrabalho: "", id: uuidv4() })}
                                    sx={{ mt: 2, width: '100%' }}
                                >
                                    Adicionar dia de trabalho
                                </Button>
                            </Container>
                        </Grid>
                    </FormSection>

                    <FormSection title="Seção 7 - Dados referentes a débitos">
                        <Grid container spacing={2}>


                            <Container >
                                {debitoFields.map((field, index) => (
                                    <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, width: '100%' }}>
                                        <CardContent sx={{ mt: 2, display: "flex", gap: "10px" }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`possuiDebito.${index}.valorDebito` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Valor devido"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`possuiDebito.${index}.dataDebito` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Data do débito"
                                                        type="date"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <FormControl fullWidth>

                                                        <TextField
                                                            label='Adicione aqui observações ou descrições sobre o débito'
                                                            InputLabelProps={{ shrink: true }}
                                                            fullWidth
                                                            id={`tipo-debito-${index}`}
                                                            {...register(`possuiDebito.${index}.tipoDebito` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        >
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton color="error" onClick={() => removeDebito(index)}>
                                                <DeleteIcon />
                                                <Typography sx={{ color: "red", ml: "2px" }}>Remover Débito</Typography>
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    variant="contained"
                                    color="success"
                                    onClick={() => appendDebito({ tipoDebito: "", valorDebito: "", dataDebito: "" })}
                                    sx={{ mt: 2, width: '100%' }}
                                >
                                    Adicionar Débitos
                                </Button>
                            </Container>

                        </Grid>
                    </FormSection>
                    {/* Campos de contribuição com a casa */}
                    <FormSection title="Seção 8 - Dados referentes a contribuições">
                        <Grid container spacing={2}>


                            <Container >
                                {contribuicaoFields.map((field, index) => (
                                    <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, width: '100%' }}>
                                        <CardContent sx={{ mt: 2, display: "flex", gap: "10px" }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <FormControl fullWidth>
                                                        <Controller
                                                            name={`contribuicao.${index}.tipoContribuicao`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <FormControl fullWidth>
                                                                    <InputLabel>Tipo de Contribuição</InputLabel>
                                                                    <Select
                                                                        {...field}
                                                                        label="Tipo de Contribuição"
                                                                        defaultValue="-"
                                                                    >
                                                                        <MenuItem value="pix">Pix</MenuItem>
                                                                        <MenuItem value="dinheiro">Dinheiro</MenuItem>
                                                                        <MenuItem value="cartao">Cartão</MenuItem>
                                                                        <MenuItem value="vale presente">
                                                                            Vale Presente
                                                                        </MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            )}
                                                        />


                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`contribuicao.${index}.valorContribuicao` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Valor devido"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ width: '100%' }}>
                                                    <TextField
                                                        {...register(`contribuicao.${index}.dataContribuicao` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                                                        label="Data do débito"
                                                        type="date"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton color="error" onClick={() => removeContribuicao(index)}>
                                                <DeleteIcon />
                                                <Typography sx={{ color: "red", ml: "2px" }}>Excluir contribuição adicionada</Typography>
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    variant="contained"
                                    color="success"
                                    onClick={() => appendContribuicao({ tipoContribuicao: "", valorContribuicao: "", dataContribuicao: "" })}
                                    sx={{ mt: 2, width: '100%' }}
                                >
                                    Adicionar contribuições
                                </Button>

                            </Container>

                        </Grid>
                    </FormSection>

                    <FormSection title="Seção 8 - Observações">
                        <Grid container spacing={2} sx={{ mt: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box
                                sx={{
                                    width: '100%', // Ajusta a largura conforme necessário
                                    padding: '8px', // Espaçamento interno para não colar o texto nas bordas
                                    border: '1px solid #ccc', // Borda cinza leve
                                    borderRadius: '4px', // Bordas arredondadas
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', // Sombra suave para profundidade
                                    '&:focus-within': {
                                        boxShadow: '0px 0px 0px 2px #1976d2', // Sombra de foco para indicar ativação
                                    },
                                }}
                            >
                                <TextareaAutosize
                                    aria-label="Observações"
                                    minRows={3}
                                    placeholder="Digite suas observações aqui..."
                                    style={{
                                        width: '100%', // Ajusta a largura para preencher o Box
                                        border: 'none', // Remove a borda padrão do textarea
                                        outline: 'none', // Remove o outline padrão para foco
                                        resize: 'vertical', // Permite redimensionar apenas verticalmente
                                        padding: '8px', // Espaçamento interno adicional
                                        borderRadius: '4px', // Bordas arredondadas
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
                        disabled={isSubmitted}
                        sx={{ width: "100%" }}
                    >
                        {isSubmitted ? "Atualizando dados, aguarde..." : "Atualizar Cadastro"}
                    </Button>
                </Box>
            </form>

        </Container>
    );
}
