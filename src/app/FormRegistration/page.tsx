"use client";
import React from "react";
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
import { DiasSemanas, MenuPropsDiasSemanas, normalizeFloatInputValue, Typevinculo } from "@/utils/ultils";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { FormHeader } from "../components/FormHeader";
import { FormSection } from "../components/FormSection";
import { InputField } from "../components/InputField";
import { Associado, associadoSchema } from "../interfaces/interfaces";


export default function FormRegistration() {
  const methods = useForm<Associado>({
    resolver: zodResolver(associadoSchema),
    defaultValues: {
      associacao: {
        diaVinculo: [], // array vazio
      },
      trabahadorInfoField:{
       diaTrabalha:[]
      },
      GrupoEstudoInfoField:{
        diaEstuda:[]
      }
    },
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
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

  const [estadoCivil, setEstadoCivil] = React.useState('');
  const [DiaSemanaFrequentado, setDiaSemanaFrequentado] = React.useState<string[]>([]);
  const [DiaEstudoTrabalho, setDiaEstudoTrabalho] = React.useState<string[]>([]);

  const handleChangeSelect = (event: SelectChangeEvent) => {
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

  const handleChangeDiaTrabalho = (event: SelectChangeEvent<typeof DiaSemanaFrequentado>) => {
    const {
      target: { value },
    } = event;
    //console.log("Before split:", value); // Veja o que está recebendo antes do split
    const newValue = typeof value === 'string' ? value.split(',') : value;
    //console.log("After split:", newValue); // Confira o novo valor após o split
    setDiaEstudoTrabalho(newValue);
    setValue('trabahadorInfoField.diaTrabalha', newValue);
  };
  const handleChangeDiaEstudo = (event: SelectChangeEvent<typeof DiaSemanaFrequentado>) => {
    const {
      target: { value },
    } = event;
    //console.log("Before split:", value); // Veja o que está recebendo antes do split
    const newValue = typeof value === 'string' ? value.split(',') : value;
    //console.log("After split:", newValue); // Confira o novo valor após o split
    setDiaEstudoTrabalho(newValue);
    setValue('GrupoEstudoInfoField.diaEstuda', newValue);
  };



  watch("contribuiu", "nao"); // 'nao' é o valor padrão
  watch("debito", "nao"); // 'nao' é o valor padrão

  const onSubmit = (data: Associado) => {
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
      });
    alert('dados cadastrados com sucesso')
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
                      onChange={handleChangeSelect}
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
                <InputField register={register} name="naturalidade.uf" label="UF de Naturalidade" type='text' />
              </Grid>
            </FormSection>
            {/* Campos de Endereço */}
            <FormSection title="Seção 2 - Dados de Endereço e Contato">
              <Grid container spacing={2}>
                <InputField register={register} name="endereco.logradouro" label="Rua" type='text' />
                <InputField register={register} name="endereco.numero" label="Número" type='text' />
                <InputField register={register} name="endereco.cidade" label="Cidade" type='text' />
                <InputField register={register} name="endereco.cep" label="CEP" type='text' />
                <InputField register={register} name="endereco.uf" label="UF" type='text' />
                <InputField register={register} name="endereco.complemento" label="Complemento" type='text' />
                <InputField register={register} name="endereco.telefone" label="Telefone" type='text' />
                <InputField register={register} name="endereco.email" label="Email" type='email' />

              </Grid>
            </FormSection >
         
            {/* Campos de Associação */}
            <FormSection title="Seção 4 - Dados de Associação">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Tipo de vinculo com a casa</InputLabel>
                  <Select
                    {...register("associacao.tipo.0")}
                    fullWidth
                    error={!!errors.associacao?.tipo}
                    defaultValue="">
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="trabalhador">Trabalhador</MenuItem>
                    <MenuItem value="estudante">Estudante</MenuItem>
                    <MenuItem value="estudante e trabalhador">Estudante e Trabalhador</MenuItem>
                    <MenuItem value="frequentador">Frequentador</MenuItem>
                  </Select>
                  {errors.associacao?.tipo && (
                    <p>{errors.associacao.tipo.message}</p>
                  )}
                </Grid>
                {/* Select Multiplo para poder selecionar varios dias que o usuário frequentará a casa*/}
                <Grid item xs={12} sm={6}>
                  <InputLabel>Dia(s) que frenquenta a casa</InputLabel>
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
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <InputField register={register} name="associacao.dataEntrada" label="Data de entrada na casa" type='date' />
                <InputField register={register} name="numeroRegistroAssociado" label="Número do Associado " type='text' />
              </Grid>
            </FormSection>
              {/* Campos estudante */}
              <FormSection title="Seção 5 - Dados do Estudante">
              <Grid container spacing={2}>
                <InputField register={register} name="GrupoEstudoInfoField.turmaEstudo" label="Nome da Turma" type='text' />
                <InputField register={register} name="GrupoEstudoInfoField.nomeFacilitador" label="Nome do Facilitador" type='text' />
                <InputField register={register} name="GrupoEstudoInfoField.numeroSala" label="Nº da sala" type='text' />
                <Grid item xs={12} sm={6}>
                  <InputLabel>Dia(s) que estuda na casa</InputLabel>
                  <Controller
                    control={control}
                    name="GrupoEstudoInfoField.diaEstuda"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <Select
                          {...field}
                          multiple
                          value={field.value} // Use `field.value` em vez de `defaultValue`
                          onChange={handleChangeDiaEstudo}
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
              </Grid>
            </FormSection >
              {/* Campos trabalhador/voluntário */}
              <FormSection title="Seção 6 - Dados do Trabalhador/Voluntário">
              <Grid container spacing={2}>
                <InputField register={register} name="trabahadorInfoField.funcao" label="Função do trabalhador" type='text' />
                <InputField register={register} name="trabahadorInfoField.nomeDiregente" label="Nome do dirigente" type='text' />
                <Grid item xs={12} sm={6}>
                  <InputLabel>Dia(s) de Trabalho na casa</InputLabel>
                  <Controller
                    control={control}
                    name="trabahadorInfoField.diaTrabalha"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <Select
                          {...field}
                          multiple
                          value={field.value} // Use `field.value` em vez de `defaultValue`
                          onChange={handleChangeDiaTrabalho}
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
              </Grid>
            </FormSection >

            {/* Campos débito */}
            <FormSection title="Seção 6 - Dados referentes a débitos">
              <Grid container spacing={2}>
                <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <InputLabel sx={{ color: "black", mb: '2px', mt: '16px' }}>O associado possui débitos com a casa?</InputLabel>
                  <Select
                    {...register("debito")}
                    sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
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
                      onClick={() => appendDebito({ tipoDebito: "", valorDebito: "", dataDebito: "" })}
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
                    {...register("contribuiu")}
                    sx={{ mb: "2px", marginLeft: '2px', mt: '12px' }}
                    defaultValue="nao"
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
                                  defaultValue="forma de pagamento"
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
                      onClick={() => appendContribuicao({ tipoContribuicao: "", valorContribuicao: "", dataContribuicao: "" })}
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
                sx={{ width: "100%" }}
              >
                Cadastrar Associado
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
}
