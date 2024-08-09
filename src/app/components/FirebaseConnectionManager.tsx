import { useEffect, useState } from 'react';
import { onDisconnect, ref, get, query, orderByChild, limitToFirst, remove } from 'firebase/database';
import { database } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos de inatividade
const MAX_CONNECTIONS = 80; // Limite de conexões para começar a desconectar automaticamente

type UserStatus = {
  sessionId: string;
  status: 'online' | 'offline';
  lastActive: number;
};

const FirebaseConnectionManager: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserStatus[]>([]);

  useEffect(() => {
    // Somente execute no lado do cliente
    if (typeof window !== 'undefined') {
      const id = getSessionId();
      setSessionId(id);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const userStatusDatabaseRef = ref(database, `/status/${sessionId}`);

    const handleDisconnect = () => {
      onDisconnect(userStatusDatabaseRef).set({
        status: 'offline',
        lastActive: Date.now(),
      });
    };

    const handleActivity = () => {
      onDisconnect(userStatusDatabaseRef).cancel(); // Cancela o disconnect se houver atividade
      onDisconnect(userStatusDatabaseRef).set({
        status: 'online',
        lastActive: Date.now(),
      });
    };

    handleDisconnect();
    handleActivity();

    const activityEvents: string[] = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'touchmove', 'touchend'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    const inactivityTimeout = setTimeout(() => {
      handleDisconnect();
    }, INACTIVITY_TIMEOUT);

    // Função para monitorar conexões e desconectar inativos
    const monitorConnections = async () => {
      const statusRef = ref(database, '/status');
      const statusSnapshot = await get(statusRef);
      if (statusSnapshot.exists()) {
        const connections = statusSnapshot.val();
        const activeConnections = Object.keys(connections).length;

        if (activeConnections >= MAX_CONNECTIONS) {
          await disconnectInactiveUsers();
        }

        const userList: UserStatus[] = Object.keys(connections).map((key) => ({
          sessionId: key,
          status: connections[key].status,
          lastActive: connections[key].lastActive,
        }));
        setUsers(userList);
      }
    };

    const disconnectInactiveUsers = async () => {
      const statusRef = ref(database, '/status');
      const inactiveUsersQuery = query(statusRef, orderByChild('lastActive'), limitToFirst(10)); // Ordena por inatividade e pega os 10 primeiros
      const snapshot = await get(inactiveUsersQuery);

      if (snapshot.exists()) {
        const usersToDisconnect = snapshot.val();
        Object.keys(usersToDisconnect).forEach(async (userId) => {
          const userRef = ref(database, `/status/${userId}`);
          await remove(userRef); // Desconecta o usuário removendo sua conexão
        });
      }
    };

    const connectionCheckInterval = setInterval(() => {
      monitorConnections();
    }, 10000); // Verifica a cada 10 segundos

    return () => {
      clearTimeout(inactivityTimeout);
      clearInterval(connectionCheckInterval);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [sessionId]);

  // Renderiza a lista de usuários online e desconectados
  return (
    <div>
      <h3>Usuários Conectados</h3>
      <ul>
        {users.map((user) => (
          <li key={user.sessionId}>
            ID: {user.sessionId} - Status: {user.status} - Última Atividade: {new Date(user.lastActive).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FirebaseConnectionManager;

// Função para gerar ou recuperar um Session ID
const getSessionId = (): string => {
  if (typeof document === 'undefined') return ''; // Verifica se está no ambiente do navegador

  let sessionId = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sessionId='))
    ?.split('=')[1];

  if (!sessionId) {
    sessionId = uuidv4(); // Gera um UUID único
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias
    document.cookie = `sessionId=${sessionId};expires=${expires.toUTCString()};path=/`;
  }

  return sessionId;
};
