// app/api/obterDocumento.ts
import { storage } from "@/config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      // Refere-se ao caminho do arquivo DOCX no Storage
      const filePath = "https://firebasestorage.googleapis.com/v0/b/bancodedadosceab.appspot.com/o/termo_voluntariado.docx?alt=media&token=3ee742a9-a3ac-4faf-b848-1608a2ae0db9";
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
