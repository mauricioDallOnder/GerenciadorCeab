// app/components/CreateCarnes.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export interface IISocio {
  campoNome: string;
  numbS: string;
}

const getMonthName = (month: number): string => {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[month];
};

// Define uma interface para os dados de Mês/Ano
interface IMonthData {
  [key: string]: string; // Indica que qualquer string pode ser uma chave válida e o valor é uma string
}

export const CreateCarnes = async (socio: IISocio) => {
  try {
    // Chama a API `GET` para obter a URL do documento
    const response = await fetch('/api/getCarnesFromStorage');
    if (!response.ok) {
      console.error("Failed to fetch document URL:", response.status, response.statusText);
      return;
    }

    const { downloadURL } = await response.json();

    // Faz o download do documento diretamente da URL fornecida
    const docResponse = await fetch(downloadURL);
    if (!docResponse.ok) {
      console.error("Failed to download document template:", docResponse.status, docResponse.statusText);
      return;
    }

    const arrayBuffer = await docResponse.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater().loadZip(zip);

    // Define os dados de Mês/Ano para preencher o carnê
    const monthData: IMonthData = {}; // Inicializa a estrutura conforme definida
    for (let i = 0; i < 12; i++) {
      const monthName = getMonthName(i);
      monthData[`MesAno${i + 1}`] = `${monthName}/${new Date().getFullYear()}`;
    }

    // Dados adicionais do sócio
    doc.setData({
      campoNome: socio.campoNome,
      numbS: socio.numbS,
      ...monthData, // Adiciona os campos de Mês/Ano
    });

    // Renderiza o documento preenchido
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering document:", error);
      return;
    }

    // Gera e salva o documento localmente
    const buf = doc.getZip().generate({ type: "blob" });
    saveAs(buf, `carne-${socio.campoNome}.docx`);
  } catch (error: any) {
    console.error("Error processing document:", error.message);
  }
};
