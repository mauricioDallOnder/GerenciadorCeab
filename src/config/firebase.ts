// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
apiKey: "AIzaSyCGuEHNYb0vUSw-ojk8GVpW-MuvUHptWtY",
  authDomain: "bancodedadosceab.firebaseapp.com",
  databaseURL: "https://bancodedadosceab-default-rtdb.firebaseio.com",
  projectId: "bancodedadosceab",
  storageBucket: "bancodedadosceab.appspot.com",
  messagingSenderId: "1069107759611",
  appId: "1:1069107759611:web:1ba395c5f374492d62635e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Firestore Realtime Database
export const database = getDatabase(app);
