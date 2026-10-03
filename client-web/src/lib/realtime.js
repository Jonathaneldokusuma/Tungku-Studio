import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export function subscribeCollection(collectionName, callback, options = {}) {
  const filters = options.filters || [];
  const sort = options.sort || ['updatedAt', 'desc'];
  const constraints = [
    ...filters.map(([field, operator, value]) => where(field, operator, value)),
    ...(sort ? [orderBy(sort[0], sort[1])] : []),
  ];
  return onSnapshot(query(collection(db, collectionName), ...constraints), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function subscribeDocument(collectionName, id, callback) {
  return onSnapshot(doc(db, collectionName, id), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  });
}

export function createRealtimeDocument(collectionName, payload) {
  return addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function saveRealtimeDocument(collectionName, id, payload) {
  return setDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function updateRealtimeDocument(collectionName, id, payload) {
  return updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export function deleteRealtimeDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}
