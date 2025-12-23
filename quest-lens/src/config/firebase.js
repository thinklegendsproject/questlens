// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC59a8JVNH3KIYd6pPeQTgqwSVkb8WXKcU",
  authDomain: "quest-lens-b799a.firebaseapp.com",
  databaseURL: "https://quest-lens-b799a-default-rtdb.firebaseio.com",
  projectId: "quest-lens-b799a",
  storageBucket: "quest-lens-b799a.firebasestorage.app",
  messagingSenderId: "1021097661382",
  appId: "1:1021097661382:web:1b3d1ab003ebd7175ad8c7",
  measurementId: "G-JPDSWBP36Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
