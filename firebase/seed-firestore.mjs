import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const credentialsPath = process.env.FIREBASE_CREDENTIALS || process.argv[2];
const seedPath = process.argv[3] || path.resolve('firebase/seed-data.json');

if (!credentialsPath) {
  console.error('Missing Firebase service account. Set FIREBASE_CREDENTIALS or pass it as the first argument.');
  process.exit(1);
}

const [credentialsRaw, seedRaw] = await Promise.all([
  readFile(credentialsPath, 'utf8'),
  readFile(seedPath, 'utf8'),
]);

initializeApp({
  credential: cert(JSON.parse(credentialsRaw)),
});

const db = getFirestore();
const seed = JSON.parse(seedRaw);
const batch = db.batch();
let writes = 0;

for (const [collectionName, documents] of Object.entries(seed)) {
  for (const [id, data] of Object.entries(documents)) {
    const ref = db.collection(collectionName).doc(id);
    batch.set(ref, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    writes += 1;
  }
}

await batch.commit();
console.log(`Seeded ${writes} Firestore documents.`);
