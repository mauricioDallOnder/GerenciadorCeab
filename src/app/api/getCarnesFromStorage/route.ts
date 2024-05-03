// app/api/obterDocumento.ts
import { storage } from "@/config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      // Refere-se ao caminho do arquivo DOCX no Storage
      const filePath = "https://firebasestorage.googleapis.com/v0/b/bancodedadosceab.appspot.com/o/MODELO%20DE%20CARNE%CC%82%20NOVO.docx?alt=media&token=cdb3e7e6-9aca-4988-a98e-bce41cb99209";
      const fileRef = ref(storage, filePath);

      // Obtem a URL de download direto
      const downloadURL = await getDownloadURL(fileRef);

      if (!downloadURL) {
          return new NextResponse(JSON.stringify({ message: "Arquivo não encontrado." }), {
              status: 404,
              headers: {
                  'Content-Type': 'application/json',
              },
          });
      }

      // Retorna a URL para download
      return new NextResponse(JSON.stringify({ downloadURL }), {
          status: 200,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  } catch (error: any) {
      console.error('Erro ao obter documento:', error);
      return new NextResponse(JSON.stringify({
          error: 'Erro ao obter documento',
          message: error.message,
      }), {
          status: 500,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  }
}
