export const DiasSemanas=[
    'Segunda','Terça','Quarta','Quinta','Sexta','Sábado'
]
export const Typevinculo=['estudante','trabalhador','frequentador']
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
