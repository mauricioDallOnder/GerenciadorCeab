import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { onDisconnect, ref, get, query, orderByChild, limitToFirst, remove, set } from 'firebase/database';
import { database } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos de inatividade
const MAX_CONNECTIONS = 80; // Limite de conexões para começar a desconectar automaticamente

type UserStatus = {
  sessionId: string;
  status: 'online' | 'offline';
  lastActive: number | null;
};

const FirebaseConnectionManager: React.FC = () => {
  const { data: session, status } = useSession();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserStatus[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = getSessionId();
      setSessionId(id);
    }
  }, []);

  useEffect(() => {
    if (!sessionId || status !== 'authenticated') return;

    const userStatusDatabaseRef = ref(database, `/status/${sessionId}`);

    const handleDisconnect = () => {
      onDisconnect(userStatusDatabaseRef).set({
        status: 'offline',
        lastActive: Date.now(),
      });
    };

    const handleActivity = () => {
      // Remove a entrada antiga para garantir que não haja duplicatas
      remove(ref(database, `/status/${sessionId}`)).then(() => {
        // Registra a nova conexão
        onDisconnect(userStatusDatabaseRef).cancel();
        set(userStatusDatabaseRef, {
          status: 'online',
          lastActive: Date.now(),
        });
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
          status: connections[key].status || 'offline',
          lastActive: connections[key].lastActive || null,
        }));
        setUsers(userList);
        console.log("Usuários Conectados:", userList);
      }
    };

    const disconnectInactiveUsers = async () => {
      const statusRef = ref(database, '/status');
      const inactiveUsersQuery = query(statusRef, orderByChild('lastActive'), limitToFirst(10));
      const snapshot = await get(inactiveUsersQuery);

      if (snapshot.exists()) {
        const usersToDisconnect = snapshot.val();
        Object.keys(usersToDisconnect).forEach(async (userId) => {
          const userRef = ref(database, `/status/${userId}`);
          await remove(userRef);
        });
      }
    };

    const connectionCheckInterval = setInterval(() => {
      monitorConnections();
    }, 10000);

    // Função de limpeza aprimorada para remover entradas inválidas ou antigas
    const cleanupOldConnections = async () => {
      const statusRef = ref(database, '/status');
      const snapshot = await get(statusRef);
      if (snapshot.exists()) {
        const connections = snapshot.val();
        const now = Date.now();

        Object.keys(connections).forEach(async (key) => {
          const lastActive = connections[key].lastActive;
          const status = connections[key].status;

          // Remove entradas que estão offline por muito tempo ou têm dados inválidos
          if ((status === 'offline' && now - lastActive > INACTIVITY_TIMEOUT) || !lastActive) {
            const userRef = ref(database, `/status/${key}`);
            await remove(userRef);
          }
        });
      }
    };

    cleanupOldConnections(); // Executa a limpeza ao iniciar

    return () => {
      clearTimeout(inactivityTimeout);
      clearInterval(connectionCheckInterval);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [sessionId, status]);

  if (status === 'loading') {
    console.log("Carregando...");
    return null;
  }

  return null;
};

export default FirebaseConnectionManager;

// Função para gerar ou recuperar um Session ID
const getSessionId = (): string => {
  if (typeof document === 'undefined') return '';

  let sessionId = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sessionId='))
    ?.split('=')[1];

  if (!sessionId) {
    sessionId = uuidv4();
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias
    document.cookie = `sessionId=${sessionId};expires=${expires.toUTCString()};path=/`;
  }

  return sessionId;
};
