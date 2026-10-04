import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC7C1K-FdxnOmflPn7wkjq8YHvPZVodZmM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ruangtungku.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ruangtungku',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ruangtungku.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '435724583591',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:435724583591:web:92863b877bd96101871182',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-W5GNGZ5KTB',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const messagingPromise = isSupported().then((supported) => supported ? getMessaging(firebaseApp) : null);
