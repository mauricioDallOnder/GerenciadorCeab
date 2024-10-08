'use client';

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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {
  BoxStyleCadastro,
} from "@/utils/styles";
import { DiasSemanas, livrosOrganizados, MenuPropsMultiSelect, normalizeFloatInputValue, normalizeString, siglas, tipoMediunidade, tipoVinculoComCeab } from "@/utils/ultils";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { FormHeader } from "../components/FormHeader";
import { FormSection } from "../components/FormSection";
import { InputField } from "../components/InputField";
import { Associado, associadoSchema, AssociadosResponse, GrupoEstudoInfoFields } from "../interfaces/interfaces";
import Footer from "../components/Footer";
import { SelectGroupRegistration } from "../components/GroupeSelectComponent/SelectGroupRegistration";
import { useCeabContext } from "@/context/context";
import FirebaseConnectionManager from "../components/FirebaseConnectionManager";

export default function FormRegistration() {
  const { usuariosData } = useCeabContext();
  const methods = useForm<Associado>({
    resolver: zodResolver(associadoSchema),
    mode: 'all',
    defaultValues: {
      associacao: {
        tipo: [],
        TipoMediunidade: [],
      },
      contribuicao: [
        {
          tipoContribuicao: "NaoContribuiu",
          valorContribuicao: "0",
          dataContribuicao: "09/09/9999",
        },
      ],
      possuiDebito: [
        {
          tipoDebito: "Pix",
          valorDebito: "0",
          dataDebito: "09/09/9999",
        },
      ],
      debito: "não",
      estudosAnteriores: "nao",
      evangelizacao: "não",
      contribuiu: "não",
      GrupoEstudoInfoField: {
        livro: "Não está estudando atualmente",
        facilitador: "-",
        dia: "-",
        turno: "-",
        horario: "-",
        sala: "-",
        uuid: "-",
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
    reset,
    formState: { errors, isValid },
  } = methods;

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
// salvar dados no local storage:
useEffect(() => {
  // Restaura os dados do formulário a partir do localStorage quando o componente for montado
  const savedData = localStorage.getItem('formData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    reset(parsedData);
  }

  // Salva os dados do formulário no localStorage sempre que houver uma mudança
  const subscription = watch((value) => {
    localStorage.setItem('formData', JSON.stringify(value));
  });

  // Limpa o localStorage ao submeter os dados com sucesso
  const clearLocalStorageOnSubmit = () => {
    localStorage.removeItem('formData');
  };

  // Event listener para salvar dados ao clicar no botão de voltar do navegador
  const handlePopState = () => {
    const formData = getValues();
    localStorage.setItem('formData', JSON.stringify(formData));
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    subscription.unsubscribe();
    window.removeEventListener('popstate', handlePopState);
  };
}, [reset, watch, getValues]);


//----------------------------------------


  const [estadoCivil, setEstadoCivil] = useState('');
  const [VinculoCasa, setVinculoCasa] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backButtonClicks, setBackButtonClicks] = useState(0);



// volta o formulario apenas se o usuario clicar 2 vezes no botao de voltar:

useEffect(() => {
  const handleBackButtonClick = () => {
    setBackButtonClicks((prev) => prev + 1);
  };

  window.addEventListener('popstate', handleBackButtonClick);

  return () => {
    window.removeEventListener('popstate', handleBackButtonClick);
  };
}, []);
useEffect(() => {
  if (backButtonClicks === 1) {
    alert("Clique novamente para voltar à página anterior.");
    const timer = setTimeout(() => setBackButtonClicks(0), 3000); // Reseta após 3 segundos
    return () => clearTimeout(timer);
  } else if (backButtonClicks >= 2) {
    window.history.back(); // Navega para a página anterior
  }
}, [backButtonClicks]);

//-------------------



  const handleChangeSelectEstadoCivil = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setEstadoCivil(value);
    setValue("estadoCivil", value);
  };

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

  watch("contribuiu", "nao");
  watch("debito", "nao");
  const estudosAnteriores = watch("estudosAnteriores");
  const trabalhosAnteriores = watch("trabalhosAnteriores");
  const selectedTipo = watch("associacao.tipo", []);

  const isOtherSpecified = selectedTipo.includes("outro-informe nas observações!");
  const disableButton = isSubmitting || (isOtherSpecified && !!errors.observacoes);

  const registerForGroup = (fieldName: keyof GrupoEstudoInfoFields) => register(`GrupoEstudoInfoField.${fieldName}` as const);

  useEffect(() => {
    if (trabalhosAnteriores === "sim" && trabalhoAnteriorFields.length === 0) {
      appendTrabalhoAnterior({ funcao: "", ano: "", observacoes: "" });
    }
  }, [trabalhosAnteriores, trabalhoAnteriorFields, appendTrabalhoAnterior]);



  
  
  const onSubmit = (data: Associado) => {
    const nomeJaExiste = usuariosData.some(usuario => normalizeString(usuario.nome) === normalizeString(data.nome));

    if (nomeJaExiste) {
      alert("Nome já cadastrado.");
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);

    let geraUUid = uuidv4();
    let dadosParaSubmissao;

    if (data.contribuiu === "nao" || data.debito === "nao") {
      dadosParaSubmissao = {
        ...data,
        id: geraUUid,
        contribuicao: [
          {
            tipoContribuicao: "NaoContribuiu",
            valorContribuicao: "0",
            dataContribuicao: "09/09/9999",
          },
        ],
        possuiDebito: [
          {
            tipoDebito: "Pix",
            valorDebito: "0",
            dataDebito: "09/09/9999",
          },
        ],
        debito: "não",
      };
    } else {
      const contribuicoes = data.contribuicao || [];
      const debitos = data.possuiDebito || [];

      const contribuicoesComValoresConvertidos = contribuicoes.map((contribuicao) => ({
        ...contribuicao,
        valorContribuicao: normalizeFloatInputValue(contribuicao.valorContribuicao!.toString()),
      }));

      const DebitosComValoresConvertidos = debitos.map((debito) => ({
        ...debito,
        valorDebito: normalizeFloatInputValue(debito.valorDebito!.toString()),
      }));
      const mycadastro = new Date(Date.now()).toLocaleString().split(",")[0];
      dadosParaSubmissao = {
        ...data,
        id: geraUUid,
        contribuicao: contribuicoesComValoresConvertidos,
        possuiDebito: DebitosComValoresConvertidos,
        dataCadastro: mycadastro
      };
    }
    console.log("Dados para submissão:", dadosParaSubmissao);

    axios.post('/api/createDataOnFirebase', dadosParaSubmissao)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        setIsSubmitting(false);
      });
    localStorage.removeItem('formData'); // Limpa os dados salvos no localStorage
    reset(); // Limpa os campos do formulário após a submissão
    alert('dados cadastrados com sucesso');
    setIsSubmitting(false);
  };

  console.log(errors);

  return (
    <>
     
   
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 0 }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Box sx={BoxStyleCadastro}>
            <FormHeader titulo='Cadastro de Associados' />
            <FormSection title="Seção 1 - Dados de Identificação">
              <Grid container spacing={2}>
                <InputField register={register} name="nome" label="Nome Completo" type='text' error={Boolean(errors.nome)}
                  helperText={errors.nome?.message} />
                <InputField register={register} name="cpf" label="CPF" type='text' error={Boolean(errors.cpf)}
                  helperText={errors.cpf?.message} />
                <InputField register={register} name="rg" label="RG" type='text' error={Boolean(errors.rg)}
                  helperText={errors.rg?.message} />
                <InputField register={register} name="nascimento" label="Data de nascimento" type='string' error={Boolean(errors.nascimento)}
                  helperText={errors.nascimento?.message} />
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
                </Grid>
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
                </Grid>
              </Grid>
            </FormSection>
            <FormSection title="Seção 2 - Endereço e Contatos">
              <Grid container spacing={2}>
                <InputField register={register} name="endereco.logradouro" label="Rua" type='text' helperText={errors.endereco?.logradouro?.message} error={Boolean(errors.endereco?.logradouro)} />
                <InputField register={register} name="endereco.numero" label="Número" type='text' helperText={errors.endereco?.numero?.message} error={Boolean(errors.endereco?.numero)} />
                <InputField register={register} name="endereco.cidade" label="Cidade" type='text' helperText={errors.endereco?.cidade?.message} error={Boolean(errors.endereco?.cidade)} />
                <InputField register={register} name="endereco.cep" label="CEP" type='text' helperText={errors.endereco?.cep?.message} error={Boolean(errors.endereco?.cep)} />
                <InputField register={register} name="endereco.uf" label="UF" type='text' helperText={errors.endereco?.uf?.message} error={Boolean(errors.endereco?.uf)} />
                <InputField register={register} name="endereco.complemento" label="Bairro" type='text' helperText={errors.endereco?.complemento?.message} error={Boolean(errors.endereco?.complemento)} />
                <InputField register={register} name="endereco.telefone" label="Telefone" type='text' helperText={errors.endereco?.telefone?.message} error={Boolean(errors.endereco?.telefone)} />
                <InputField register={register} name="endereco.email" label="Email" type='email' helperText={errors.endereco?.email?.message} error={Boolean(errors.endereco?.email)} />
              </Grid>
            </FormSection >
            <FormSection title="Seção 3 - Dados de Associação">
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="associacao.TipoMediunidade"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <InputLabel>Selecione sua mediunidade</InputLabel>
                        <Select
                          {...field}
                          multiple
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
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth >
                    <InputLabel >Você é sócio da casa?</InputLabel>
                    <Select
                      {...register("associacao.Tiposocio")}
                      label='selecione'
                    >
                      <MenuItem value="Sim">Sim</MenuItem>
                      <MenuItem value="Não">Não</MenuItem>
                    </Select>
                    <Typography sx={{ color: "red", fontSize: "0.75rem" }}>
                      {errors.associacao?.Tiposocio ? "Informe seu tipo de associação com a casa" : ""}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="associacao.tipo"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <InputLabel>Função na casa</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label='Vínculo'
                          value={field.value}
                          onChange={handleChangeVinculoCasa}
                          input={<OutlinedInput label="Função na casa" />}
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
                        <Typography sx={{ color: "red", fontSize: "0.75rem" }}>
                          {errors.associacao?.tipo ? "Informe sua função na casa" : ""}
                        </Typography>
                      </FormControl>
                    )}
                  />
                </Grid>

                <InputField register={register} name="associacao.dataEntrada" label="Data de entrada na casa" type='string' helperText={errors.associacao?.dataEntrada?.message} error={Boolean(errors.associacao?.dataEntrada)} />
                <InputField register={register} name="numeroRegistroAssociado" label="Nº do Associado(verificar no crachá/carnê de contibuição ) " type='text' />
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
                    Você assinou o termo de voluntáriado?
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
            <FormSection title="Seção 4 - Grupo de Estudo e Estudos Anteriores">
              <Container>
                <InputLabel sx={{ color: "black", mb: '2px', mt: '16px', textAlign: "center" }}>
                  Atualmente,você é estudante da casa?
                </InputLabel>
                <Select
                  variant="filled"
                  fullWidth
                  {...register("estudosAnteriores")}
                  sx={{ mb: "2px", marginLeft: '2px', mt: '12px', textAlign: "center" }}
                  defaultValue="nao"
                >
                  <MenuItem value="sim">Sim</MenuItem>
                  <MenuItem value="nao">Não</MenuItem>
                </Select>
                {estudosAnteriores === "sim" && (
                  <FormSection title="Seção 4.1 - Selecione o grupo de estudo em que você está estudando atualmente">
                    <Grid container spacing={2}>
                      <SelectGroupRegistration register={registerForGroup} setValue={setValue} />
                    </Grid>
                  </FormSection>
                )}
                <FormSection title="Seção 4.2 - Informe abaixo os estudos que você já realizou">
                  <Grid container spacing={2}>
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
                            label="Em qual ano/período você fez esse estudo?"
                            variant="outlined"
                            fullWidth
                          />
                          <TextareaAutosize
                            {...register(`HistoricoEstudoField.${index}.observacoes`)}
                            placeholder="Escreva aqui os cursos/estudos que você realizou nesse período"
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
                    color="secondary"
                    onClick={() => appendEstudo({ livro: "", ano: "", observacoes: "" })}
                    sx={{ mt: 2, width: '100%' }}
                  >
                    Clique aqui para informar mais estudos que você realizou.
                  </Button>
                </FormSection>
              </Container>
            </FormSection>
            <FormSection title="Seção 5 - Trabalhos que você realiza ATUALMENTE na casa!">
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
            <FormSection title="Seção 6 - Trabalhos que você já realizou para a casa (trabalhos que você fez mas não faz mais atualmente)">
              <Container>
                <InputLabel sx={{ color: "black", mb: '2px', mt: '16px', textAlign: "center" }}>
                  Se você já realizou trabalhos anteriores para a casa, selecione "sim"
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
                {trabalhosAnteriores === "sim" && (
                  <FormSection title="Informe abaixo os trabalhos que você já realizou">
                    <Grid container spacing={2}>
                      {trabalhoAnteriorFields.map((field, index) => (
                        <Card key={field.id} variant="outlined" sx={{ marginBottom: 2, mt: 4, width: '100%' }}>
                          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <FormControl fullWidth>
                              <TextField
                                {...register(`HistoricoTrabalhoField.${index}.funcao`)}
                                label="Descrição do trabalho. Ex: Eu trabalhei na portaria distribuindo fichas..."
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
                      color="primary"
                      onClick={() => appendTrabalhoAnterior({ funcao: "", ano: "", observacoes: "" })}
                      sx={{ mt: 2, width: '100%' }}
                    >
                      Adicionar trabalho anterior
                    </Button>
                  </FormSection>
                )}
              </Container>
            </FormSection>
            <FormSection title="Seção 7 - Observações">
              <Grid item xs={12}>
                <TextareaAutosize
                  aria-label="Observações"
                  minRows={3}
                  placeholder="Digite suas observações aqui..."
                  {...register("observacoes", {
                    required: isOtherSpecified ? "Campo obrigatório" : false,
                    minLength: {
                      value: 1,
                      message: "Este campo é obrigatório"
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    marginLeft: "6px",
                    borderColor: isOtherSpecified ? 'red' : '#ccc',
                    borderWidth: isOtherSpecified ? '2px' : '1px',
                  }}
                />
                {isOtherSpecified && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    Você escolheu "outro" no campo "função na casa", descreva aqui sua função.
                  </Typography>
                )}
              </Grid>
            </FormSection>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={disableButton}
                sx={{ width: "100%" }}
              >
                {isSubmitting ? "Enviando dados, aguarde..." : "Cadastrar Associado"}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
      <Footer />
    </Container>
    </>
  );
}
// <FirebaseConnectionManager />
