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
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let cards = [];
let currentIndex = 0;
let known = 0;
let unknown = 0;

let selectedLevel = "";
let selectedCategory = "";

let seconds = 0;
let timer = null;
let paused = false;

function showScreen(screenId) {
  const screens = [
    "homeBox",
    "levelBox",
    "categoryBox",
    "cardBox",
    "resultBox",
    "settingsBox"
  ];

  screens.forEach((id) => {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(screenId).style.display = "block";
}

window.showLevelScreen = function () {
  showScreen("levelBox");
};

window.showCategoryScreen = function () {
  clearInterval(timer);
  timer = null;
  showScreen("categoryBox");
};

window.showSettings = function () {
  showScreen("settingsBox");
};

window.goHome = function () {
  clearInterval(timer);
  timer = null;

  selectedLevel = "";
  selectedCategory = "";
  cards = [];
  currentIndex = 0;
  known = 0;
  unknown = 0;
  seconds = 0;
  paused = false;

  updateScore();
  showScreen("homeBox");
};

window.selectLevel = function (level) {
  selectedLevel = level;
  document.getElementById("selectedLevelText").textContent =
    "Seviye: " + selectedLevel;

  showScreen("categoryBox");
};

window.selectCategory = async function (category) {
  selectedCategory = category;

  document.getElementById("studyInfo").textContent =
    selectedLevel + " | " + selectedCategory;

  showScreen("cardBox");

  await loadCardsByLevelAndCategory(selectedLevel, selectedCategory);
  startTimer();
};

async function loadCardsByLevelAndCategory(level, category) {
  cards = [];
  currentIndex = 0;
  known = 0;
  unknown = 0;
  updateScore();

  const q = query(
    collection(db, "words"),
    where("seviye", "==", level),
    where("kategori", "==", category)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    cards.push(doc.data());
  });

  if (cards.length === 0) {
    document.getElementById("word").textContent = "Kelime bulunamadı";
    document.getElementById("meaning").textContent = "";
    document.getElementById("sentence").textContent = "";
    document.getElementById("translation").textContent = "";
    return;
  }

  showCard();
}

function showCard() {
  if (cards.length === 0) return;

  const card = cards[currentIndex];

  document.getElementById("word").textContent =
    "🇩🇪 " + (card.artikel || "") + " " + (card.kelime || "");

  document.getElementById("meaning").textContent =
    "🇹🇷 " + (card.anlam || "");

  document.getElementById("sentence").textContent = card.cumle || "";
  document.getElementById("translation").textContent = card.ceviri || "";
}

function startTimer() {
  seconds = 0;
  paused = false;
  document.getElementById("timer").textContent = "00:00";

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    if (paused) return;

    seconds++;

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    document.getElementById("timer").textContent =
      String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }, 1000);
}

window.pauseStudy = function () {
  paused = !paused;
};

window.finishStudy = function () {
  clearInterval(timer);
  timer = null;

  const result =
    "Seviye: " + selectedLevel + "<br>" +
    "Kategori: " + selectedCategory + "<br>" +
    "⏱ Süre: " + document.getElementById("timer").textContent + "<br>" +
    "✅ Doğru: " + known + "<br>" +
    "❌ Yanlış: " + unknown;

  document.getElementById("resultText").innerHTML = result;
  showScreen("resultBox");
};

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
  const score = document.getElementById("score");

  if (score) {
    score.textContent =
      "Bilinen: " + known + " | Bilinmeyen: " + unknown;
  }
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
    document.getElementById("userInfo").textContent =
      "Giriş yapan: " + user.email;

    showScreen("homeBox");
  } else {
    document.getElementById("authBox").style.display = "block";
    document.getElementById("appBox").style.display = "none";
  }
});