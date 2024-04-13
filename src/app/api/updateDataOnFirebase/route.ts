import { database } from "@/config/firebase";
import { ref, update, get } from "firebase/database";

// Definição da interface do usuário conforme a estrutura esperada
interface Usuario {
  nome: string;
  [key: string]: any; // Permite outras propriedades dinâmicas
}

export async function PUT(request: Request) {
  try {
    const { nome, novosDados } = await request.json();

    const usuariosRef = ref(database, 'usuarios');
    const snapshot = await get(usuariosRef);
    const usuarios = snapshot.val() as { [key: string]: Usuario }; // Usando a interface aqui
    let idEncontrado: string | null = null;

    for (const [id, usuario] of Object.entries(usuarios)) {
      if (usuario.nome === nome) {
        idEncontrado = id;
        break;
      }
    }

    if (!idEncontrado) {
      return new Response(JSON.stringify({
        error: 'Usuário não encontrado'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const usuarioRef = ref(database, `usuarios/${idEncontrado}`);
    await update(usuarioRef, novosDados);

    return new Response(JSON.stringify({ message: 'Usuário atualizado com sucesso!', id: idEncontrado }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao atualizar usuário',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
