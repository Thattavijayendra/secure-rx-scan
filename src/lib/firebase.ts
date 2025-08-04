// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// // Your Firebase configuration
// // Replace these with your actual Firebase config values
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "your-app-id"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);

// // Initialize Cloud Firestore and get a reference to the service
// export const db = getFirestore(app);

// export default app;


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_-I_X7g_S9V-p5qn0KDXHct3zI3nJynQ",
  authDomain: "samraksha-8fdfa.firebaseapp.com",
  projectId: "samraksha-8fdfa",
  storageBucket: "samraksha-8fdfa.appspot.com",
  messagingSenderId: "558244153990",
  appId: "1:558244153990:web:6822e3e2cb5e9652e91f07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
