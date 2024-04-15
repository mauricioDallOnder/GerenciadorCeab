"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import { FormHelperText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {
  BoxStyleCadastro,
} from "@/utils/styles";
import { DiasSemanas, MenuPropsDiasSemanas, normalizeFloatInputValue, normalizeString, siglas, Typevinculo } from "@/utils/ultils";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { FormHeader } from "../components/FormHeader";
import { FormSection } from "../components/FormSection";
import { InputField } from "../components/InputField";
import { Associado, associadoSchema, AssociadosResponse } from "../interfaces/interfaces";


export default function FormRegistration() {
  const methods = useForm<Associado>({
    resolver: zodResolver(associadoSchema),
    defaultValues: {
      associacao: {
        diaVinculo: [], // array vazio
      },

    },
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    getValues,
    formState: { errors},
  } = methods;
  // Dentro de FormRegistration
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

  const [estadoCivil, setEstadoCivil] = useState('');
  const [DiaSemanaFrequentado, setDiaSemanaFrequentado] = useState<string[]>([]);
  const [usuarios, setUsuarios] = useState<{ id: string, nome: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeSelectEstadoCivil = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setEstadoCivil(value);
    setValue("estadoCivil", value); // Sincroniza com o estado do formulário
  };

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

 
  useEffect(() => {
    axios.get<AssociadosResponse>('/api/getDataFromFirebase')
      .then(response => {
        const transformed = Object.entries(response.data).map(([key, value]) => {
          if (typeof value === 'object' && value.nome) { // Verifica se value é um objeto e possui a propriedade nome
            return { id: key, nome: value.nome };
          }
          return null; // ou retornar um valor padrão ou manipular de alguma outra forma
        }).filter((item): item is { id: string; nome: string } => item !== null);
        setUsuarios(transformed);
      })
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);
  

  watch("contribuiu", "nao");
  watch("debito", "nao");


  const onSubmit = (data: Associado) => {
     // Verificar se o nome já existe na lista de usuários
  const nomeJaExiste = usuarios.some(usuario => normalizeString(usuario.nome) === normalizeString(data.nome));


  if (nomeJaExiste) {
    alert("Nome já cadastrado.");
    setIsSubmitting(false); // Resetar o estado de submissão
    console.log(nomeJaExiste)
    return; // Interrompe a execução da função se o nome já existir
  }
    setIsSubmitting(true); // Iniciar a submissão
    let geraUUid = uuidv4()

    let dadosParaSubmissao;

    if (data.contribuiu === "nao" || data.debito === "nao") {
      // Sobrescreve os dados de contribuição com valores padrão para "não contribuiu"
      dadosParaSubmissao = {
        ...data,
        id: geraUUid,
        contribuicao: [
          {
            tipo: "NaoContribuiu",
            valor: 0,
            data: "-",
          },
        ],
        possuiDebito: [
          {
            tipo: "NaoPossuiDébito",
            valor: 0,
            data: "-",
          },
        ],

      };
    } else {
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

      // Cria um novo objeto de dados com os valores convertidos para os casos de "sim contribuiu"
      dadosParaSubmissao = {
        ...data,
        id: geraUUid,
        contribuicao: contribuicoesComValoresConvertidos,
        debito: DebitosComValoresConvertidos
      };
    }
    console.log("Dados para submissão:", dadosParaSubmissao);

    axios.post('/api/createDataOnFirebase', dadosParaSubmissao)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        setIsSubmitting(false); // Resetar o estado de submissão
      });
    alert('dados cadastrados com sucesso')
    methods.reset(); // Limpar os campos após o envio bem sucedido
    setIsSubmitting(false); // Resetar o estado de submissão
  };


  console.log(errors);

  return (
    <FormProvider {...methods}>
      <Container
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={BoxStyleCadastro}>
            <FormHeader titulo='Cadastro de Associados' />
            <FormSection title="Seção 1 - Dados de Identificação do Associado">
              <Grid container spacing={2}>
                <InputField register={register} name="nome" label="Nome Completo" type='text' />
                <InputField register={register} name="cpf" label="CPF" type='text' />
                <InputField register={register} name="nascimento" label="Data de nascimento" type='date' />
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="estado-civil-label">Estado Civil</InputLabel>
                    <Select
                      labelId="estado-civil-label"
                      id="estadoCivil"
                      value={estadoCivil}
                      label="Estado Civil"
                      onChange={handleChangeSelectEstadoCivil}
                      name="estadoCivil">
                      <MenuItem value={'solteiro'}>Solteiro(a)</MenuItem>
                      <MenuItem value={'casado'}>Casado(a)</MenuItem>
                      <MenuItem value={'divorciado'}>Divorciado(a)</MenuItem>
                      <MenuItem value={'viuvo'}>Viúvo(a)</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.estadoCivil && <p>{errors.estadoCivil.message}</p>}
                </Grid>
                {/* Campos de Naturalidade */}
                <InputField register={register} name="naturalidade.cidade" label="Naturalidade" type='text' />
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="naturalidade-uf-label">UF</InputLabel>
                    <Select
                      {...register("naturalidade.uf")}
                      label='naturalidade'
                      >
                       {siglas.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                  {errors.estadoCivil && <p>{errors.estadoCivil.message}</p>}
                </Grid>
              </Grid>
            </FormSection>
            {/* Campos de Endereço */}
            <FormSection title="Seção 2 - Dados de Endereço e Contato">
              <Grid container spacing={2}>
                <InputField register={register} name="endereco.logradouro" label="Rua" type='text' />
                <InputField register={register} name="endereco.numero" label="Número" type='text' />
                <InputField register={register} name="endereco.cidade" label="Cidade" type='text' />
                <InputField register={register} name="endereco.cep" label="CEP" type='text' />
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth >
                    <InputLabel id="endereco-uf-label">UF</InputLabel>
                    <Select
                    
                      {...register("endereco.uf")}
                      label='UF do endereço'
                      >
                       {siglas.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                  </Grid>
                <InputField register={register} name="endereco.complemento" label="Complemento" type='text' />
                <InputField register={register} name="endereco.telefone" label="Telefone" type='text' />
                <InputField register={register} name="endereco.email" label="Email" type='email' />

              </Grid>
            </FormSection >

            {/* Campos de Associação */}
            <FormSection title="Seção 4 - Dados de Associação">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de vinculo com a casa</InputLabel>
                    <Select
                      {...register("associacao.tipo.0")}
                      label='Tipo de vinculo com a casa'
                      fullWidth
                      error={!!errors.associacao?.tipo}
                      defaultValue="-">
                      <MenuItem value="-">-</MenuItem>
                      <MenuItem value="trabalhador">Trabalhador</MenuItem>
                      <MenuItem value="estudante">Estudante</MenuItem>
                      <MenuItem value="estudante e trabalhador">Estudante e Trabalhador</MenuItem>
                      <MenuItem value="frequentador">Frequentador</MenuItem>
                    </Select>
                    {errors.associacao?.tipo && (
                      <p>{errors.associacao.tipo.message}</p>
                    )}
                  </FormControl>
                </Grid>
                {/* Select Multiplo para poder selecionar varios dias que o usuário frequentará a casa*/}
                <Grid item xs={12} sm={6}>

                  <Controller
                    control={control}
                    name="associacao.diaVinculo"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <InputLabel>Dia(s) que frenquenta a casa</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label='Dia(s) que frenquenta a casa'
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
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <InputField register={register} name="associacao.dataEntrada" label="Data de entrada na casa" type='date' />
                <InputField register={register} name="numeroRegistroAssociado" label="Nº do Associado(verificar no crachá!) " type='text' />
              </Grid>
            </FormSection>
            {/* Campos estudante */}
            <FormSection title="Seção 5 - Dados do Estudante">
              <Grid container spacing={2}>
                <InputField register={register} name="GrupoEstudoInfoField.turmaEstudo" label="Nome da Turma" type='text' />
                <InputField register={register} name="GrupoEstudoInfoField.nomeFacilitador" label="Nome do Facilitador" type='text' />
                <InputField register={register} name="GrupoEstudoInfoField.numeroSala" label="Nº da sala" type='text' />
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ mb: '2px', mt: '12px' }}>Selecione o Dia do Estudo</InputLabel>
                    <Select
                      label="Selecione o Dia do Estudo"
                      {...register("GrupoEstudoInfoField.diaEstuda")}
                      sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                      defaultValue="-">
                        <MenuItem value="-">-</MenuItem>
                      <MenuItem value="Segunda">Segunda</MenuItem>
                      <MenuItem value="Terça">Terça</MenuItem>
                      <MenuItem value="Quarta">Quarta</MenuItem>
                      <MenuItem value="Quinta">Quinta</MenuItem>
                      <MenuItem value="Sexta">Sexta</MenuItem>
                      <MenuItem value="Sábado">Sábado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection >
            {/* Campos trabalhador/voluntário */}
            <FormSection title="Seção 6 - Dados do Trabalhador/Voluntário">
              <Grid container spacing={2}>
                <Container >
                  {trabahadorInfoField.map((field, index) => (
                    <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, width: '100%' }}>
                      <CardContent sx={{ mt: 2, display: "flex", gap: "10px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sx={{ width: "100%" }}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ mb: '2px', mt: '16px' }}>Selecione o Dia de Trabalho</InputLabel>
                              <Select
                                label="Selecione o Dia de Trabalho"
                                {...register(`trabahadorInfoField.${index}.diaTrabalha` as const)}
                                sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                                defaultValue="-">
                                <MenuItem value="-">-</MenuItem>
                                <MenuItem value="Segunda">Segunda</MenuItem>
                                <MenuItem value="Terça">Terça</MenuItem>
                                <MenuItem value="Quarta">Quarta</MenuItem>
                                <MenuItem value="Quinta">Quinta</MenuItem>
                                <MenuItem value="Sexta">Sexta</MenuItem>
                                <MenuItem value="Sábado">Sábado</MenuItem>
                                <MenuItem value="Domingo">Domingo</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sx={{ width: '100%' }}>
                            <TextField
                              {...register(`trabahadorInfoField.${index}.funcao` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                              label="Função que Exerce"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              variant="outlined"
                              defaultValue="-"
                            />
                          </Grid>

                          <Grid item xs={12} sx={{ width: '100%' }}>
                            <TextField
                              {...register(`trabahadorInfoField.${index}.nomeDirigente` as const)} // Corrigido para corresponder ao nome do seu array no esquema Zod
                              label="Nome do Dirigente do Trabalho"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              variant="outlined"
                              defaultValue="-"
                            />
                          </Grid>
                          <Grid item xs={12} sx={{ width: "100%" }}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ mb: '2px', mt: '16px' }}>Selecione o Turno de Trabalho</InputLabel>
                              <Select
                                label='Selecione o Turno de Trabalho'
                                {...register(`trabahadorInfoField.${index}.turnoDeTrabalho` as const)}
                                sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                                defaultValue="-">
                                   <MenuItem value="-">-</MenuItem>
                                <MenuItem value="Manhã">Manhã</MenuItem>
                                <MenuItem value="Tarde">Tarde</MenuItem>
                                <MenuItem value="Noite">Noite</MenuItem>
                              </Select>
                            </FormControl>
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
                    onClick={() => appendtrabahadorInfo({ diaTrabalha: "", funcao: "", nomeDirigente: "", turnoDeTrabalho: "", horarioDeTrabalho: "",id:uuidv4() })}
                    sx={{ mt: 2, width: '100%' }}
                  >
                    Adicionar dia de trabalho
                  </Button>
                </Container>


              </Grid>
            </FormSection >

            {/* Campos débito */}
            <FormSection title="Seção 6 - Dados referentes a débitos">
              <Grid container spacing={2}>
                <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <InputLabel sx={{ color: "black", mb: '2px', mt: '16px',textAlign:"center" }}>O associado possui débitos com a casa?</InputLabel>
                  <Select
                  variant="filled"
                  disabled
                  fullWidth
                    {...register("debito")}
                    sx={{ mb: "2px", marginLeft: '2px', mt: '12px',textAlign:"center" }}
                    defaultValue="nao">
                    <MenuItem value="sim">Sim</MenuItem>
                    <MenuItem value="nao">Não</MenuItem>
                  </Select>
                </Container>
                {getValues("debito") === "sim" && (
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
                      onClick={() => appendDebito({ tipoDebito: "-", valorDebito: "0", dataDebito: "2999/12/12" })}
                      sx={{ mt: 2, width: '100%' }}
                    >
                      Adicionar Débitos
                    </Button>
                  </Container>
                )}
              </Grid>
            </FormSection>
            {/* Campos de contribuição com a casa */}
            <FormSection title="Seção 7 - Dados referentes a contribuições">
              <Grid container spacing={2}>
                <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <InputLabel sx={{ color: "black", mb: '2px', mt: '16px' }}>O associado ajudou a casa com algum valor?</InputLabel>
                  <Select
                   variant="filled"
                   fullWidth
                    {...register("contribuiu")}
                    sx={{ mb: "2px", marginLeft: '2px', mt: '12px',textAlign:"center" }}
                    defaultValue="nao"
                    disabled
                  >
                    <MenuItem value="sim">Sim</MenuItem>
                    <MenuItem value="nao">Não</MenuItem>
                  </Select>
                </Container>
                {getValues("contribuiu") === "sim" && (
                  <Container >
                    {contribuicaoFields.map((field, index) => (
                      <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, width: '100%' }}>
                        <CardContent sx={{ mt: 2, display: "flex", gap: "10px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ width: '100%' }}>
                              <FormControl fullWidth>
                                <InputLabel >Forma de contribuição</InputLabel>
                                <Select
                                  {...register(`contribuicao.${index}.tipoContribuicao`)}
                                  fullWidth
                                  id='forma de pagamento'
                                  label="Tipo de Contribuição"
                                  defaultValue="Dinheiro"
                                >
                                  <MenuItem value="pix">Pix</MenuItem>
                                  <MenuItem value="dinheiro">Dinheiro</MenuItem>
                                  <MenuItem value="cartao">Cartão</MenuItem>
                                  <MenuItem value="vale presente">
                                    Vale Presente
                                  </MenuItem>
                                </Select>
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
                      onClick={() => appendContribuicao({ tipoContribuicao: "Pix", valorContribuicao: "0", dataContribuicao: "12/12/2999" })}
                      sx={{ mt: 2, width: '100%' }}
                    >
                      Adicionar contribuições
                    </Button>

                  </Container>
                )}
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
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            sx={{ width: "100%" }}
          >
            {isSubmitting ? "Enviando dados, aguarde..." : "Cadastrar Associado"}
          </Button>
              
            </Box>
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
}
