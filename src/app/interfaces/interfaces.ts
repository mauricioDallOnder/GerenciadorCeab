import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { z } from 'zod';

export const cpfRegex = /^\d{11}$/; // CPF apenas com números

export const associadoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: "Informe seu nome" }),
  cpf: z.string().regex(cpfRegex, { message: "CPF inválido, verifique se usou apenas números e se há 11 digitos" }),
  rg: z.string().min(1, { message: "Informe seu RG" }),
  nascimento: z.string().min(1, { message: "Informe sua data de nascimento" }),
  estadoCivil: z.string().min(1, { message: "Informe seu estado civil" }),
  naturalidade: z.object({
    cidade: z.string().min(1, { message: "Informe sua cidade natal" }),
    uf: z.string().min(1, { message: "Informe a UF" }),
  }),
  dataCadastro:z.string().optional(),
  endereco: z.object({
    logradouro: z.string().min(1, { message: "Informe a rua" }),
    numero: z.string().min(1, { message: "Informe o nº" }),
    complemento:z.string().min(1, { message: "Informe o bairro" }),
    cidade: z.string().min(1, { message: "Informe a cidade" }),
    cep: z.string().min(1, { message: "Informe o CEP" }),
    uf: z.string().min(1, { message: "Informe a UF" }),
    telefone: z.string().min(1, { message: " Informe ao menos 1 telefone" }),
    email: z.string().email({ message: "Email inválido" })
  }),
  associacao: z.object({
    tipo: z.array(z.string().min(1, { message: "Informe sua função na casa" })),
    TipoMediunidade: z.array(z.string().min(1, { message: "Informe seu tipo de mediunidade" })),
    dataEntrada: z.string().min(1, { message: "Informe a data de entrada na casa" }),
    Tiposocio:z.string().min(1, { message: "Informe seu tipo de associação com a casa" }),
  }),
  GrupoEstudoInfoField: z.object({
    livro: z.string(),
    facilitador: z.string(),
    dia: z.string(),
    turno: z.string(),
    horario: z.string(),
    sala: z.string(),
    uuid: z.string().optional()
  }),
  HistoricoEstudoField:  z.array(z.object({
    livro: z.string(),
    ano: z.string(),
    observacoes: z.string(),
  })).optional(),
  HistoricoTrabalhoField:  z.array(z.object({
    funcao: z.string(),
    ano: z.string(),
    observacoes: z.string(),
  })).optional(),
  trabahadorInfoField: z.array(z.object({
    id: z.string(),
    diaTrabalha: z.string(),
    turnoDeTrabalho: z.string(),
  })).optional(),
  contribuicao: z.array(z.object({
    tipoContribuicao: z.string(),
    valorContribuicao: z.string(),
    dataContribuicao: z.string()
  })).optional(),
  possuiDebito: z.array(z.object({
    tipoDebito: z.string(),
    valorDebito: z.string(),
    dataDebito: z.string()
  })).optional(),
  contribuiu: z.string().optional(),
  debito: z.string().optional(),
  observacoes: z.string().optional(),
  numeroRegistroAssociado: z.string().optional(),
  estudosAnteriores:z.string().optional(),
  trabalhosAnteriores:z.string().optional(),
  evangelizacao:z.string().optional(),
});

export type Associado = z.infer<typeof associadoSchema>;

export type DynamicDataType = {
  [key: string]: any;
};

export type FieldCountType = { [key: string]: number };


export interface TrabahadorInfoField {
  id: string;
  diaTrabalha: string;
  funcao: string;
  nomeDirigente: string;
  turnoDeTrabalho: string;
  horarioDeTrabalho: string;
}

export interface HistoricoEstudoField{
  livro: string;
  ano: string;
  observacoes: string;
}

export interface HistoricoEstudoModalProps{
  open: boolean;
  onClose: () => void;
  details: HistoricoEstudoField[];
}

export interface WorkerDetailsModalProps {
  open: boolean;
  onClose: () => void;
  details: TrabahadorInfoField[];
}

export interface AssociadosResponse {
  [key: string]: Associado;
}

export const grupoEstudoInfoFieldSchema = associadoSchema.pick({
  GrupoEstudoInfoField: true
});

export type GrupoEstudoInfoFields = z.infer<typeof grupoEstudoInfoFieldSchema>['GrupoEstudoInfoField'];

// Props do GrupoDeEstudoSelect
export interface GrupoDeEstudoSelectProps {
  register: (fieldName: keyof GrupoEstudoInfoFields) => ReturnType<UseFormRegister<Associado>>;
  setValue: UseFormSetValue<Associado>;
  initialValues?: GrupoEstudoInfoFields;
}


export interface LoaderData {
  session: {
    user: {
      name: string;
      role: string;
    };
  };
}

