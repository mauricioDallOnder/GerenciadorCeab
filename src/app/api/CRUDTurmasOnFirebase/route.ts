import { database } from "@/config/firebase";
import { ref, update, get, query, orderByChild, equalTo, set, remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
interface Turma {
  dia: string;
  facilitador: string;
  horario: string;
  livro: string;
  sala: string;
  turno: string;
  uuid: string;
}

interface Usuario {
  GrupoEstudoInfoField: {
    dia: string;
    facilitador: string;
    horario: string;
    livro: string;
    sala: string;
    turno: string;
    uuid: string;
  };
  [key: string]: any;
}

export async function PUT(request: Request) {
  try {
    const { uuid, novosDados } = await request.json();

    const turmasRef = ref(database, `turmas/gruposDeEstudo`);
    const snapshot = await get(turmasRef);
    const turmas = snapshot.val() as { [key: string]: Turma };

    let turmaId: string | null = null;

    for (const [id, turma] of Object.entries(turmas)) {
      if (turma.uuid === uuid) {
        turmaId = id;
        break;
      }
    }

    if (!turmaId) {
      return new Response(JSON.stringify({ error: 'Turma não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const turmaRef = ref(database, `turmas/gruposDeEstudo/${turmaId}`);
    await update(turmaRef, novosDados);

    // Atualizar usuários relacionados
    const usuariosRef = ref(database, 'usuarios');
    const usuariosSnapshot = await get(usuariosRef);
    const usuarios = usuariosSnapshot.val() as { [key: string]: Usuario };

    for (const [id, usuario] of Object.entries(usuarios)) {
      if (usuario.GrupoEstudoInfoField?.uuid === uuid) {
        const usuarioRef = ref(database, `usuarios/${id}/GrupoEstudoInfoField`);
        await update(usuarioRef, novosDados);
      }
    }

    return new Response(JSON.stringify({ message: 'Turma e usuários atualizados com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar turma e usuários:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao atualizar turma e usuários',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



export async function POST(request: Request) {
  try {
    const turma = await request.json();
    turma.uuid = uuidv4(); // Gerar novo UUID para a turma

    const turmasRef = ref(database, 'turmas/gruposDeEstudo');
    const snapshot = await get(turmasRef);

    const turmas = snapshot.val();
    const newId = turmas ? Object.keys(turmas).length : 0;

    await set(ref(database, `turmas/gruposDeEstudo/${newId}`), turma);

    return new Response(JSON.stringify({ message: 'Turma adicionada com sucesso!', id: newId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro ao adicionar turma:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao adicionar turma',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { uuid } = await request.json();

    const turmasRef = ref(database, `turmas/gruposDeEstudo`);
    const snapshot = await get(turmasRef);
    const turmas = snapshot.val() as { [key: string]: Turma };

    let turmaId: string | null = null;

    for (const [id, turma] of Object.entries(turmas)) {
      if (turma.uuid === uuid) {
        turmaId = id;
        break;
      }
    }

    if (!turmaId) {
      return new Response(JSON.stringify({ error: 'Turma não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const turmaRef = ref(database, `turmas/gruposDeEstudo/${turmaId}`);
    await remove(turmaRef);

    // Remover referências em usuários
    const usuariosRef = ref(database, 'usuarios');
    const usuariosSnapshot = await get(usuariosRef);
    const usuarios = usuariosSnapshot.val() as { [key: string]: Usuario };

    for (const [id, usuario] of Object.entries(usuarios)) {
      if (usuario.GrupoEstudoInfoField?.uuid === uuid) {
        const usuarioRef = ref(database, `usuarios/${id}/GrupoEstudoInfoField`);
        await remove(usuarioRef);
      }
    }

    return new Response(JSON.stringify({ message: 'Turma e referências de usuários removidas com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro ao deletar turma:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao deletar turma',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}