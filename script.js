console.log("script.js çalıştı");
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let cards = [];
let currentIndex = 0;
let known = 0;
let unknown = 0;

async function loadCardsFromFirestore() {
  cards = [];

  const querySnapshot = await getDocs(collection(db, "words"));

  querySnapshot.forEach((doc) => {
    cards.push(doc.data());
  });

  if (cards.length === 0) {
    document.getElementById("word").textContent = "Kelime bulunamadı";
    return;
  }

  showCard();
}

window.register = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("authMessage").textContent = "Kayıt başarılı.";
    })
    .catch((error) => {
      document.getElementById("authMessage").textContent = error.message;
    });
};

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("authMessage").textContent = "Giriş başarılı.";
    })
    .catch((error) => {
      document.getElementById("authMessage").textContent = error.message;
    });
};

window.logout = function () {
  signOut(auth);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("appBox").style.display = "block";
    document.getElementById("userInfo").textContent = "Giriş yapan: " + user.email;

    loadCardsFromFirestore();
  } else {
    document.getElementById("authBox").style.display = "block";
    document.getElementById("appBox").style.display = "none";
  }
});

function showCard() {
  const card = cards[currentIndex];
  console.log(card);
  console.log(card.artikel);
  console.log(card.kelime);

  document.getElementById("word").textContent =
  card.artikel + " " + card.kelime;

  document.getElementById("meaning").textContent = card.anlam;
  document.getElementById("sentence").textContent = card.cumle;
  document.getElementById("translation").textContent = card.ceviri;
}

window.flipCard = function () {
  document.getElementById("cardInner").classList.toggle("flipped");
};

window.nextCard = function () {
  if (cards.length === 0) return;

  currentIndex++;

  if (currentIndex >= cards.length) {
    currentIndex = 0;
  }

  document.getElementById("cardInner").classList.remove("flipped");
  showCard();
};

window.markKnown = function () {
  known++;
  updateScore();
  window.nextCard();
};

window.markUnknown = function () {
  unknown++;
  updateScore();
  window.nextCard();
};

function updateScore() {
  document.getElementById("score").textContent =
    "Bilinen: " + known + " | Bilinmeyen: " + unknown;
}