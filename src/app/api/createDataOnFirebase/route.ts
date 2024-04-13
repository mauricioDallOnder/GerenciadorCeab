// app/api/adicionarUsuario.ts

import { database } from "@/config/firebase";
import { ref, push, set } from "firebase/database";

export async function POST(request: Request) {
  try {
    const usuario = await request.json();
    
    // Cria uma nova referência com um ID único no caminho 'usuarios'
    const newUserRef = push(ref(database, 'usuarios'));

    // Define os dados do novo usuário
    await set(newUserRef, usuario);

    // Retorna sucesso com o ID do novo usuário
    return new Response(JSON.stringify({ message: 'Usuário adicionado com sucesso!', id: newUserRef.key }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao adicionar usuário:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao adicionar usuário',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
