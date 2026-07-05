import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const cards = [
  {
    word: "Haus",
    meaning: "Ev",
    sentence: "Das Haus ist groß.",
    translation: "Ev büyüktür."
  },
  {
    word: "Wasser",
    meaning: "Su",
    sentence: "Ich trinke Wasser.",
    translation: "Ben su içiyorum."
  },
  {
    word: "Buch",
    meaning: "Kitap",
    sentence: "Das Buch ist interessant.",
    translation: "Kitap ilginçtir."
  }
];

let currentIndex = 0;
let known = 0;
let unknown = 0;

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
    showCard();
  } else {
    document.getElementById("authBox").style.display = "block";
    document.getElementById("appBox").style.display = "none";
  }
});

function showCard() {
  document.getElementById("word").textContent = cards[currentIndex].word;
  document.getElementById("meaning").textContent = cards[currentIndex].meaning;
  document.getElementById("sentence").textContent = cards[currentIndex].sentence;
  document.getElementById("translation").textContent = cards[currentIndex].translation;
}

window.flipCard = function () {
  document.getElementById("cardInner").classList.toggle("flipped");
};

window.nextCard = function () {
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
// TEST