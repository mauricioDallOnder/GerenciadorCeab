import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { z } from 'zod';

export const cpfRegex = /^\d{11}$/; // CPF apenas com números

export const associadoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: "O campo nome é obrigatório" }),
  cpf: z.string().regex(cpfRegex, { message: "CPF inválido, verifique se usou apenas números e se o campo tem 11 números" }),
  nascimento: z.string().min(1, { message: "O campo nascimento é obrigatório" }),
  estadoCivil: z.string().min(1, { message: "O campo estado civil é obrigatório" }),
  naturalidade: z.object({
    cidade: z.string().min(1, { message: "O campo cidade é obrigatório" }),
    uf: z.string()
  }),
  endereco: z.object({
    logradouro: z.string().min(1, { message: "O campo rua é obrigatório" }),
    numero: z.string().min(1, { message: "O campo número é obrigatório" }),
    complemento: z.string().optional(),
    cidade: z.string().min(1, { message: "O campo cidade é obrigatório" }),
    cep: z.string().min(1, { message: "O campo CEP é obrigatório" }),
    uf: z.string(),
    telefone: z.string(),
    email: z.string().email({ message: "Email inválido" })
  }),
  associacao: z.object({
    tipo: z.array(z.string()).min(1, { message: "Selecione ao menos um tipo de associação" }),
    diaVinculo: z.array(z.string()).optional(),
    dataEntrada: z.string().min(1, { message: "O campo data de entrada é obrigatório" }),
  }),
  GrupoEstudoInfoField: z.object({
    livro: z.string(),
    facilitador: z.string(),
    dia: z.string(),
    turno: z.string(),
    horario: z.string(),
    sala: z.string(),
    turmaUUID: z.string().optional()
  }),
  trabahadorInfoField: z.array(z.object({
    id: z.string(),
    diaTrabalha: z.string(),
    funcao: z.string().min(1, { message: "A função é obrigatória" }),
    nomeDirigente: z.string().min(1, { message: "O nome do diregente é obrigatório" }),
    turnoDeTrabalho: z.string(),
    horarioDeTrabalho: z.string()
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
  numeroRegistroAssociado: z.string().optional()
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

