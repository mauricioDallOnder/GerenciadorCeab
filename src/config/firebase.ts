// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCdtpnYGptLaci2DGicmrVv0dxwZ3abejU",
  authDomain: "imagens-9116b.firebaseapp.com",
  databaseURL: "https://imagens-9116b-default-rtdb.firebaseio.com",
  projectId: "imagens-9116b",
  storageBucket: "imagens-9116b.appspot.com",
  messagingSenderId: "338656406998",
  appId: "1:338656406998:web:0f91517e6fccb1b94e4877"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o Firestore Realtime Database
export const database = getDatabase(app);
