export const DiasSemanas=[
    '-','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'
]

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
export const Typevinculo=['facilitador','facilitador e trabalhador','estudante','estudante e trabalhador','trabalhador','frequentador']
export const normalizeFloatInputValue = (value: string): number => {
    // Normaliza a string para garantir que o separador decimal seja ponto
    const normalizedValue = value.replace(",", ".");
    // Tenta converter para float. Retorna 0 se falhar.
    const floatValue = parseFloat(normalizedValue);
    return isNaN(floatValue) ? 0 : floatValue;
  };

  export const FormasContribuicao=['Pix','Dinheiro','Cartão','Vale Presente']

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuPropsDiasSemanas = {
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


export const gruposDeEstudo = [
  { livro: 'Não está estudando atualmente', facilitador: '-', dia: '-', turno: '-', horario: "-", sala: '-' },
  { livro: 'Tomo II', facilitador: 'Nadir Carniel', dia: 'Segunda', turno: 'Tarde', horario: "15h30 às 17h", sala: '302' },
  { livro: 'Obras André Luiz', facilitador: 'Teresinha Leonardo/ Liane Silveira', dia: 'Segunda', turno: 'Tarde', horario: "15h30 às 17h", sala: '12' },
  { livro: 'IEE-Introdução ao Estudo do Espiritismo', facilitador: 'César Diehl', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '302' },
  { livro: 'Tomo I', facilitador: 'Luciano Gonem', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '30' },
  { livro: 'Tomo II', facilitador: 'Ilsa Loviamara de Andrade', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '23' },
  { livro: 'EADE I', facilitador: 'Cristian Cunha', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '3' },
  { livro: 'EADE II', facilitador: 'Adriana Salvador', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '203' },
  { livro: 'EADE II', facilitador: 'Ernesto Aguzzoli', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '200' },
  { livro: 'EADE III', facilitador: 'Fabiano Aita/ Roberto Sbravatti', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '301' },
  { livro: 'EADE IV', facilitador: 'Elda/Gilmar Passos', dia: 'Segunda', turno: 'Noite', horario: "19h30 às 21h", sala: '21' },
  { livro: 'Psicologia de Joanna de Angelis', facilitador: 'Severino Ferrari', dia: 'Terça', turno: 'Tarde', horario: "14h45 às 16h15", sala: '202' },
  { livro: 'EADE II', facilitador: 'Vanderlei de Moura / Nara Pires', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '12' },
  { livro: 'IEE-Introdução ao Estudo do Espiritismo', facilitador: 'Andres Arruda', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '302' },
  { livro: 'Tomo I', facilitador: 'Elias R da Silva/Sabrina Braghini', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '30' },
  { livro: 'Tomo II', facilitador: 'Marilene Rizzon', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '201' },
  { livro: 'EADE I', facilitador: 'Orisia Bianchini/ Márcia Leite', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '202' },
  { livro: 'Tomo III', facilitador: 'Sérgio Dambros', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '301' },
  { livro: 'EADE II', facilitador: 'Denise Mota/ Eliani de Avis', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '200' },
  { livro: 'EADE III', facilitador: 'Jair Xavier/ Antônio Zarur', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '23' },
  { livro: 'EADE IV', facilitador: 'Juvenal Alves Teixeira', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '21' },
  { livro: 'EADE V', facilitador: 'Mauro de Barros/ Grace Pereira', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '203' },
  { livro: 'EADE IV', facilitador: 'Maria Joseane B. Chamalé', dia: 'Quarta', turno: 'Noite', horario: "19h30 às 21h", sala: '22' },
  { livro: 'EADE V', facilitador: 'Maria Lorena P. Chamello', dia: 'Quinta', turno: 'Tarde', horario: "16h30 às 17h50", sala: '203' },
  { livro: 'O Livro dos Espíritos', facilitador: 'Maria Lorena P. Chamello', dia: 'Quinta', turno: 'Noite', horario: "19h30 às 21h", sala: '12' },
  { livro: 'Estudo do Espiritismo', facilitador: 'Ronaldo Cardoso', dia: 'Sábado', turno: 'Tarde', horario: "14h00 às 15h30", sala: '302' },
  { livro: 'EADE I', facilitador: 'Fabiano Volpato', dia: 'Sábado', turno: 'Tarde', horario: "14h00 às 15h30", sala: '23' },
  { livro: 'EADE II', facilitador: 'James Dalla Santa da Silva', dia: 'Sábado', turno: 'Tarde', horario: "14h00 às 15h30", sala: '30' },
  { livro: 'Mediunidade: Estudo e Prática I', facilitador: 'Fernando Secco', dia: 'Terça', turno: 'Noite', horario: "19h30 às 21h00", sala: '200' },
  { livro: 'Mediunidade: Estudo e Prática II', facilitador: 'Ernesto Tadeu Aguzzoli', dia: 'Terça', turno: 'Noite', horario: "19h30 às 21h00", sala: '201' },
  { livro: 'Mediunidade: Estudo e Prática III', facilitador: 'Vanderlei Moura / Márcia Teixeira', dia: 'Terça', turno: 'Noite', horario: "19h30 às 21h00", sala: '30' },
  { livro: 'Mediunidade: Estudo e Prática II', facilitador: 'Vanderlei Moura', dia: 'Quinta', turno: 'Noite', horario: "19h30 às 21h00", sala: '200' },
];


export const refreshPage = () => {
  // Recarrega a página atual
  window.location.reload();
};