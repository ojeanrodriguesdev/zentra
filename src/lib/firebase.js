import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, addDoc, collection } from 'firebase/firestore';

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

// Função para criar dados iniciais para novo usuário
const createInitialUserData = async (userId, userName) => {
  try {
    // Criar projeto inicial
    await addDoc(collection(db, 'projects'), {
      name: `Projeto de Boas-vindas`,
      description: `Primeiro projeto criado automaticamente para ${userName}. Você pode editá-lo ou excluí-lo.`,
      status: 'active',
      priority: 'medium',
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Criar tarefa inicial
    await addDoc(collection(db, 'tasks'), {
      title: `Bem-vindo ao Zentra!`,
      description: `Esta é sua primeira tarefa. Explore o sistema e comece a organizar seus projetos.`,
      status: 'pending',
      priority: 'low',
      assignedTo: userId,
      assignedToName: userName,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Criar membro (o próprio usuário)
    await addDoc(collection(db, 'members'), {
      name: userName,
      email: auth.currentUser?.email,
      role: 'admin',
      active: true,
      userId: userId,
      joinedAt: new Date(),
      createdAt: new Date()
    });

    console.log('✅ Dados iniciais criados para novo usuário');
  } catch (error) {
    console.error('❌ Erro ao criar dados iniciais:', error);
    // Não falhar o registro se os dados iniciais falharem
  }
};

// Funções de autenticação
export const registerWithEmail = async (email, password, userData) => {
  try {
    // Criar conta no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar perfil com nome
    await updateProfile(user, {
      displayName: userData.fullName
    });

    // Salvar dados adicionais no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      createdAt: new Date(),
      uid: user.uid
    });

    // Criar dados iniciais para novo usuário
    await createInitialUserData(user.uid, userData.fullName);

    return user;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export default app;
