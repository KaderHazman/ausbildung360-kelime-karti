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

function showCard() {
  document.getElementById("word").textContent = cards[currentIndex].word;
  document.getElementById("meaning").textContent = cards[currentIndex].meaning;
  document.getElementById("sentence").textContent = cards[currentIndex].sentence;
  document.getElementById("translation").textContent = cards[currentIndex].translation;
}

function flipCard() {
  document.getElementById("cardInner").classList.toggle("flipped");
}

function nextCard() {
  currentIndex++;

  if (currentIndex >= cards.length) {
    currentIndex = 0;
  }

  document.getElementById("cardInner").classList.remove("flipped");
  showCard();
}

function markKnown() {
  known++;
  updateScore();
  nextCard();
}

function markUnknown() {
  unknown++;
  updateScore();
  nextCard();
}

function updateScore() {
  document.getElementById("score").textContent =
    "Bilinen: " + known + " | Bilinmeyen: " + unknown;
}

showCard();