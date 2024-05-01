// app/api/obterUsuarios.ts
import { database } from "@/config/firebase";
import { ref, get, child } from "firebase/database";

export async function GET() {
  try {
    
      // Busca dados de todos os usuários
      const usersRef = ref(database, 'turmas/gruposDeEstudo');
      const dataSnapshot = await get(usersRef);
      if (dataSnapshot.exists()) {
        return new Response(JSON.stringify(dataSnapshot.val()), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        return new Response(JSON.stringify({ message: "Nenhum usuário encontrado." }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
  } catch (error: any) {
    console.error('Erro ao obter usuário(s):', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao obter usuário(s)',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
