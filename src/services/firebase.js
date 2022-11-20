import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcuje1lgWQr5cQRnUNVRPnlt7VopuiOZo",
  authDomain: "todolist-866ea.firebaseapp.com",
  databaseURL: "https://todolist-866ea-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "todolist-866ea",
  storageBucket: "todolist-866ea.appspot.com",
  messagingSenderId: "148378003858",
  appId: "1:148378003858:web:fe5201df4fea3f6b37794b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const getTasks = () => ref(db, 'tasks');
export const storage = getStorage();
