// ===============================
// AOS Animation Init
// ===============================
AOS.init({ once: true });

// ===============================
// Theme Toggle
// ===============================
function toggleTheme() {
  document.body.classList.toggle("theme-light");
  document.body.classList.toggle("theme-dark");
}

// ===============================
// Vinyl Animation Control
// ===============================
const audio = document.getElementById("audio");
const vinyl = document.querySelector(".vinyl");

if (audio && vinyl) {
  audio.addEventListener("play", () => {
    vinyl.style.animation = "spin 4s linear infinite";
    vinyl.classList.add("active");
  });

  audio.addEventListener("pause", () => {
    vinyl.style.animationPlayState = "paused";
    vinyl.classList.remove("active");
  });

  audio.addEventListener("ended", () => {
    vinyl.style.animationPlayState = "paused";
    vinyl.classList.remove("active");
  });
}

//Do not show Try the demo section
const demoSection = document.getElementById('demo');
const demoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      demoSection.classList.add('demo-visible');
      demoSection.classList.remove('demo-hidden');
    }
  });
}, {
  threshold: 0.2
});

demoObserver.observe(demoSection);

// header 陰影效果
window.addEventListener("scroll", function() {
  const header = document.querySelector("header.navbar");
  if (window.scrollY > 50) { 
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


// ===============================
// Focus Timer (Pomodoro)
// ===============================
let timer;
let isRunning = false;
let isPaused = false;
let timeLeft = 0;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const customMinutes = document.getElementById("custom-minutes");
const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");
const playlistSelect = document.getElementById("playlist-select");
const focusSection = document.querySelector('.focus-container');

// Format MM:SS
function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}


// Update timer display
function updateDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(timeLeft);
  }
}
// 播放狀態切換（控制脈衝圈）
function setPlayingUI(on) {
  if (!focusSection) return;
  focusSection.classList.toggle('playing', !!on);
}



// Start timer
function startTimer() {
  if (isRunning && !isPaused) return;

  const inputMinutes = parseInt(customMinutes?.value || "25", 10);
  if (!isPaused) {
    timeLeft = inputMinutes * 60;
  }

  isRunning = true;
  isPaused = false;
  updateDisplay();
  audioPlayer?.play();

  clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused && timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else if (timeLeft === 0) {
      clearInterval(timer);
      isRunning = false;
      alert("Time’s up! Take a break.");
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
  if (audioPlayer) audioPlayer.pause();
}


// Reset timer
function resetTimer() {
  clearInterval(timer);
  const defaultMinutes = parseInt(customMinutes?.value || "25", 10);
  timeLeft = defaultMinutes * 60;
  isRunning = false;
  updateDisplay();
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
}

// Change playlist music
function changePlaylist() {
  if (!audioSource || !audioPlayer || !playlistSelect) return;
  const selected = playlistSelect.value;
  switch (selected) {
    case "study":
      audioSource.src = "songs/study.mp3";
      break;
    case "rain":
      audioSource.src = "songs/rain.mp3";
      break;
    case "night":
      audioSource.src = "songs/night.mp3";
      break;
  }
  audioPlayer.load();
}

// Event Listeners for Timer
if (startBtn && pauseBtn && resetBtn && customMinutes) {
  updateDisplay();
  changePlaylist();
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
  playlistSelect?.addEventListener("change", changePlaylist);
}

// ===============================
// Recently Played Songs (localStorage)
// ===============================
function saveToRecentSongs(songData) {
  const stored = JSON.parse(localStorage.getItem("recentSongs")) || [];
  const updated = [songData, ...stored.filter((s) => s.title !== songData.title)];
  const sliced = updated.slice(0, 5);
  localStorage.setItem("recentSongs", JSON.stringify(sliced));
}

function renderRecentSongs() {
  const recent = JSON.parse(localStorage.getItem("recentSongs")) || [];
  const container = document.getElementById("recent-list");

  if (!container) return;

  if (recent.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">No recent songs yet.</p>`;
    return;
  }

  container.innerHTML = recent
    .map(
      (song) => `
      <div class="col-md-2 col-5 text-center">
        <img src="${song.cover}" class="img-fluid rounded mb-2" alt="${song.title}" />
        <div class="fw-semibold">${song.title}</div>
        <div class="small text-muted">${song.artist}</div>
      </div>
    `
    )
    .join("");
}

renderRecentSongs();
