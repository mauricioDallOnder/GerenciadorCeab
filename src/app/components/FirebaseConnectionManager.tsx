// components/FirebaseConnectionManager.tsx
import { useEffect } from 'react';

import { onDisconnect, ref } from 'firebase/database';
import { database } from '@/config/firebase';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos de inatividade

const FirebaseConnectionManager: React.FC = () => {
  useEffect(() => {
    const userStatusDatabaseRef = ref(database, '/status/user1');

    const handleDisconnect = () => {
      onDisconnect(userStatusDatabaseRef).set('offline');
    };

    const handleActivity = () => {
      onDisconnect(userStatusDatabaseRef).cancel(); // Cancela o disconnect se houver atividade
      onDisconnect(userStatusDatabaseRef).set('offline');
    };

    handleDisconnect();

    const activityEvents: string[] = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'touchmove', 'touchend'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    const inactivityTimeout = setTimeout(() => {
      handleDisconnect();
    }, INACTIVITY_TIMEOUT);

    return () => {
      clearTimeout(inactivityTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return null;
};

export default FirebaseConnectionManager;
