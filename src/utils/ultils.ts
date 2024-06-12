export const DiasSemanas = [
  '-', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
]

export const tipoVinculoComCeab = [
  'Presidente',
  'Vice-Presidente',
  'Diretor de Área',
  'Vice-Diretor de Área',
  'Tesoureiro',
  'Segundo Tesoureiro',
  'Secretário de Direção',
  '2º Secretário de Direção',
  'Facilitador',
  'Monitor de Facilitador',
  "Dirigente",
  "Vice-Dirigente",
  "Recepcionista ",
  "Atendente Fraterno",
  "Expositor/Palestrante",
  "Evangelizador",
  "Monitor de Evangelizador",
  "outro-informe nas observações!"
]

export const livrosOrganizados = [
  'IEE - Introdução ao Estudo do Espiritismo',
  'ESDE - Estudo Sistematizado da Doutrina Espírita',
  'Tomo I',
  'Tomo II',
  'Tomo III',
  'EADE I',
  'EADE II',
  'EADE III',
  'EADE IV',
  'EADE V',
  'Estudo do Espiritismo',
  'Mediunidade: Estudo e Prática I',
  'Mediunidade: Estudo e Prática II',
  'Obras André Luiz',
  'Obras de Emmanuel',
  'Obras de Leon Denis',
  'Obras de Manoel Philomeno de Miranda',
  'O livro dos Espíritos',
  'Psicologia de Joanna de Angelis'
];



export const tipoMediunidade = [
'Médium de Efeitos Físicos', 
' Médium de Psicografia', 
'Médium de Psicofonia', 'Médium Sensitivo', 
'Médium de Vidência', ' Médium de Sonâmbulismo', 
'Médium de Cura',
'Médium de Intuitivo',
'Médium de Dialogador',
'Médium de Apoio',
'Médium de Audiência',
'Médium de Desdobramento',
'Aplicador de Passe']

export const siglas = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MS',
  'MT',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]
export const Typevinculo = ['facilitador', 'facilitador e trabalhador', 'estudante', 'estudante e trabalhador', 'trabalhador', 'frequentador']
export const normalizeFloatInputValue = (value: string): number => {
  // Normaliza a string para garantir que o separador decimal seja ponto
  const normalizedValue = value.replace(",", ".");
  // Tenta converter para float. Retorna 0 se falhar.
  const floatValue = parseFloat(normalizedValue);
  return isNaN(floatValue) ? 0 : floatValue;
};

export const FormasContribuicao = ['Pix', 'Dinheiro', 'Cartão', 'Vale Presente']

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuPropsMultiSelect = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



export function normalizeString(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export function compareNames(name1: string, name2: string): boolean {
  return normalizeString(name1) === normalizeString(name2);
}


export interface IIgruposDeEstudo {
  dia: string;
  facilitador: string;
  horario: string;
  livro: string;
  sala: string;
  turno: string;
  uuid: string;
}

export const refreshPage = () => {
  // Recarrega a página atual
  window.location.reload();
};


export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    // a data não é válida
    return "";
  }
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Janeiro é 0!
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export default function getMonthName(monthNumber: number) {
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ];
  return months[monthNumber];
}



