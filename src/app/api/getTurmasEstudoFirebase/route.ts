// app/api/obterUsuarios.ts
import { database } from "@/config/firebase";
import { ref, get, child } from "firebase/database";

export async function GET() {
  try {
      const usersRef = ref(database, 'turmas/gruposDeEstudo');
      const dataSnapshot = await get(usersRef);

      if (dataSnapshot.exists()) {
          const data = dataSnapshot.val();

          // Converta o objeto em um array de valores
          const dataArray = Object.values(data);
          console.log(dataArray)
          return new Response(JSON.stringify(dataArray), {
              status: 200,
              headers: {
                  'Content-Type': 'application/json',
              },
          });
      } else {
          return new Response(JSON.stringify({ message: "Nenhum dado encontrado." }), {
              status: 404,
              headers: {
                  'Content-Type': 'application/json',
              },
          });
      }
  } catch (error:any) {
      console.error('Erro ao obter dados:', error);
      return new Response(JSON.stringify({
          error: 'Erro ao obter dados',
          message: error.message,
      }), {
          status: 500,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  }
  
}


