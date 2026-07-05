import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoI0prTIkgPHh6-7EzzMoAq1LJc4KH9Qw",
  authDomain: "ausbildung360.firebaseapp.com",
  projectId: "ausbildung360",
  storageBucket: "ausbildung360.firebasestorage.app",
  messagingSenderId: "127655457496",
  appId: "1:127655457496:web:fdaa0c2cb93e70639a1dad"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);