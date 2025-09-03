import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - Zentra
const firebaseConfig = {
  apiKey: "AIzaSyAvvBNUeYs3-arhUdZWwccdDH2eRLfQDmU",
  authDomain: "zentra-bca9f.firebaseapp.com",
  databaseURL: "https://zentra-bca9f-default-rtdb.firebaseio.com",
  projectId: "zentra-bca9f",
  storageBucket: "zentra-bca9f.firebasestorage.app",
  messagingSenderId: "316104049908",
  appId: "1:316104049908:web:798dec36902470c6d60aa1",
  measurementId: "G-7W6KDW5D6P"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar provedor do Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Inicializar Firestore
export const db = getFirestore(app);

export default app;
