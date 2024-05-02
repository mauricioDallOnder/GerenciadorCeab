// app/components/CreateVolunteerAgreement.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export interface Volunteer {
  campoNome: string;
  campoRG: string;
  campoCPF: string;
  campoRua: string;
  campoNumero: string;
  campoBairro: string;
  campoDate?: string;
}

const getMonthName = (month: number): string => {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[month];
};

export const CreateVolunteerAgreement = async (volunteer: Volunteer) => {
  try {
    // Chama a API `GET` para obter a URL do documento
    const response = await fetch('/api/getDocxFromStorage');
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

    // Obtendo a data atual formatada
    const todayDate = new Date();
    const formattedDate = `Caxias do Sul, ${todayDate.getDate()} de ${getMonthName(todayDate.getMonth())} de ${todayDate.getFullYear()}.`;

    // Preenchendo o template com os dados do voluntário
    doc.setData({
      campoNome: volunteer.campoNome,
      campoRG: volunteer.campoRG,
      campoCPF: volunteer.campoCPF,
      campoRua: volunteer.campoRua,
      campoNumero: volunteer.campoNumero,
      campoBairro: volunteer.campoBairro,
      campoDate: formattedDate,
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
    saveAs(buf, `termo-voluntariado-${volunteer.campoNome}.docx`);
  } catch (error: any) {
    console.error("Error processing document:", error.message);
  }
};
