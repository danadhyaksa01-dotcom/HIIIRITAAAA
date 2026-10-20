/*
  WEBSITE RITA — edit bagian CONFIG di bawah untuk personalisasi.
  File lagu yang diputar ada di folder assets: lagu-rita.mpeg
*/
const CONFIG = {
  trackTitle: "beadabuuuu",
  trackArtist: "miawwwwww",
  notes: [
    {
      label: "NOTE 01",
      title: "pesan dari author",
      text: "halooo ritaa, makasih ya udah mau buka website random ini WKWKWK. kamu resmi menjadi pengunjung kehormatan sekaligus tester utama. kalau nemu bug, mohon dimaklumi karena developernya masih belajar aoqkokwok"
    },
    {
      label: "NOTE 02",
      title: "kenapa ada website ini?",
      text: "karena kita barusan mengenang kenangan kitaa wkwk, terus aku kepikiran yaudah kenapa ga dicoba aja WKWKWK eh malah jadi beneran hehee"
    },
    {
      label: "NOTE 03",
      title: "disclaimerr",
      text: "website ini bukan hasil perusahaan teknologi multinasional, bukan tugas kuliah, dan bukan juga portal pendaftaran CPNS. ini cuma buatan aku untuk kamu eakkkk"
    },
    {
      label: "NOTE 04",
      title: "lil bit shy, but...",
      text: "I MISSS UU SOO MUCHH WANITA PSIKOLOGIII XIXIXII"
    }
  ],
  specialReply: "NAHH INII JAWABAN YGG AKUU HARAPKANN WKWKWK MISS UU RITAAAAAA.",
  friendReply: "aduhhh sakitt hatikuu..."
};

const screens = [...document.querySelectorAll(".screen")];
let currentScreen = 0;

function showScreen(index) {
  currentScreen = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, i) => {
    const active = i === currentScreen;
    screen.hidden = !active;
    screen.classList.toggle("active", active);
  });
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

document.getElementById("startBtn").addEventListener("click", () => {
  showScreen(1);
  if (audio.paused) void playAudio();
});
document.querySelectorAll(".next-btn").forEach(button => {
  button.addEventListener("click", () => showScreen(currentScreen + 1));
});
document.querySelectorAll(".back-btn").forEach(button => {
  button.addEventListener("click", () => showScreen(currentScreen - 1));
});
document.querySelectorAll(".wordmark").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showScreen(0);
  });
});

// Audio player
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const audioHint = document.getElementById("audioHint");
const musicCard = document.querySelector(".music-card");
document.getElementById("trackTitle").textContent = CONFIG.trackTitle;
document.getElementById("trackArtist").textContent = CONFIG.trackArtist;

async function playAudio() {
  try {
    await audio.play();
    audioHint.textContent = "oke lagu sedang diputar";
  } catch (error) {
    if (error.name === "NotAllowedError") {
      audioHint.textContent = "browser memblokir autoplay 😭 pencet tombol play atau tombol awal yaa";
      return;
    }
    audioHint.textContent = "lagu belum bisa diputar 😭 cek file assets/lagu-rita.mpeg yaa";
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await playAudio();
  } else {
    audio.pause();
  }
});
audio.addEventListener("play", () => {
  playBtn.textContent = "Ⅱ";
  playBtn.setAttribute("aria-label", "Jeda lagu");
  musicCard.classList.add("is-playing");
});
audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "Putar lagu");
  musicCard.classList.remove("is-playing");
});
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  if (audio.paused) audioHint.textContent = "siap diputar ✨";
});
audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
  }
});
seekBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
  }
});
audio.addEventListener("error", () => {
  audioHint.textContent = "lagu tidak bisa dimuat. cek file assets/lagu-rita.mpeg yaa ✨";
});

void playAudio();

// Notes modal
const modal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const modalOverline = document.getElementById("modalOverline");
const modalText = document.getElementById("modalText");
const closeModal = () => { modal.hidden = true; };
document.querySelectorAll("[data-note]").forEach(button => {
  button.addEventListener("click", () => {
    const note = CONFIG.notes[Number(button.dataset.note)];
    if (!note) return;
    modalOverline.textContent = note.label;
    modalTitle.textContent = note.title;
    modalText.textContent = note.text;
    modal.hidden = false;
    document.getElementById("closeModal").focus();
  });
});
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalDone").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

// Ending buttons: teasing, no pressure.
const answerResult = document.getElementById("answerResult");
const restartBtn = document.getElementById("restartBtn");
function showAnswer(message) {
  answerResult.textContent = message;
  answerResult.hidden = false;
  restartBtn.hidden = false;
}
document.getElementById("specialBtn").addEventListener("click", () => showAnswer(CONFIG.specialReply));
document.getElementById("friendBtn").addEventListener("click", () => showAnswer(CONFIG.friendReply));
restartBtn.addEventListener("click", () => {
  answerResult.hidden = true;
  restartBtn.hidden = true;
  showScreen(0);
});
