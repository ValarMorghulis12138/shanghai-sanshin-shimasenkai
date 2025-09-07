// Firebase configuration example
// To use Firebase:
// 1. Create a Firebase project at https://console.firebase.google.com
// 2. Enable Firestore Database
// 3. Copy your config and rename this file to firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

/* Example Firestore structure:
sessions/
  └── {sessionId}/
      ├── date: "2024-01-20"
      ├── location: "酒友(sakatomo)"
      ├── classes/
      │   └── {classId}/
      │       ├── type: "beginner"
      │       ├── startTime: "14:00"
      │       ├── duration: 50
      │       ├── maxParticipants: 15
      │       ├── instructor: "田中先生"
      │       └── registrations/
      │           └── {registrationId}/
      │               ├── name: "John Doe"
      │               └── timestamp: 1234567890
      └── createdBy: "teacherId"
      └── createdAt: timestamp
*/
