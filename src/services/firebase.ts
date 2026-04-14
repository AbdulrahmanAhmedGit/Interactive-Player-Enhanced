import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs
} from 'firebase/firestore';
import { Question, AnswerEvent } from '../types';

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;

export const initFirebase = (config: any) => {
  if (!config || Object.keys(config).length === 0) return false;
  
  try {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    return true;
  } catch (error) {
    console.error("Firebase init failed:", error);
    return false;
  }
};

export const signIn = async () => {
  if (!auth) return null;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.error("Auth failed:", err);
    return null;
  }
};

export const fetchQuestions = async (appId: string): Promise<Question[]> => {
  if (!db) return [];
  try {
    const qRef = collection(db, 'artifacts', appId, 'public', 'data', 'questions');
    const snapshot = await getDocs(qRef);
    const questions = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Question));
    return questions.sort((a, b) => a.time - b.time);
  } catch (err) {
    console.error("Firestore read error:", err);
    return [];
  }
};

export const subscribeToQuestions = (appId: string, callback: (q: Question[]) => void) => {
  if (!db) return () => {};
  const qRef = collection(db, 'artifacts', appId, 'public', 'data', 'questions');
  return onSnapshot(qRef, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    questions.sort((a, b) => a.time - b.time);
    callback(questions);
  });
};

export const saveAnswer = async (appId: string, userId: string, answer: AnswerEvent) => {
  if (!db || !userId) return;
  try {
    const answersRef = collection(db, 'artifacts', appId, 'users', userId, 'answers');
    await addDoc(answersRef, answer);
  } catch (err) {
    console.error("Error saving answer to Firestore:", err);
  }
};

export const adminAddQuestion = async (appId: string, question: Omit<Question, 'id'>) => {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'questions'), question);
    return docRef.id;
  } catch (err) {
    console.error("Error adding doc:", err);
    return null;
  }
};

export const adminDeleteQuestion = async (appId: string, id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'questions', id));
    return true;
  } catch (err) {
    console.error("Error deleting doc:", err);
    return false;
  }
};
