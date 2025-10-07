import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from './firebase-config';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
