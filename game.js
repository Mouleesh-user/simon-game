(function () {
  const colors = ["green", "red", "yellow", "blue"];
  const tones = { green: 329.63, red: 261.63, yellow: 220.00, blue: 164.81 };
  const STORAGE_KEY = "simon-best-score";

  const titleEl = document.getElementById("level-title");
  const levelValueEl = document.getElementById("level-value");
  const bestValueEl = document.getElementById("best-value");
  const startBtn = document.getElementById("start-btn");
  const buttons = document.querySelectorAll(".btn");
  const overlay = document.getElementById("game-over-overlay");
  const finalLevelEl = document.getElementById("final-level");
  const finalBestEl = document.getElementById("final-best");

  let sequence = [];
  let userPattern = [];
  let level = 0;
  let playing = false;
  let playerTurn = false;
  let audioCtx = null;

  let best = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  bestValueEl.textContent = best;

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function playTone(c) {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = tones[c];
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  }

  function flash(color) {
    const btn = document.getElementById(color);
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 180);
  }

  function flashWithSound(color) {
    flash(color);
    playTone(color);
  }

  // Sequence speeds up as level rises, capped at 220ms.
  function stepInterval() {
    return Math.max(220, 620 - level * 25);
  }

  function nextRound() {
    level++;
    levelValueEl.textContent = level;
    titleEl.textContent = "Level " + level;
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    userPattern = [];
    playSequence();
  }

  function playSequence() {
    playerTurn = false;
    let i = 0;
    const interval = stepInterval();
    const step = () => {
      if (i >= sequence.length) {
        playerTurn = true;
        return;
      }
      flashWithSound(sequence[i]);
      i++;
      setTimeout(step, interval);
    };
    setTimeout(step, 500);
  }

  function checkAnswer() {
    const i = userPattern.length - 1;
    if (userPattern[i] !== sequence[i]) {
      gameOver();
      return;
    }
    if (userPattern.length === sequence.length) {
      setTimeout(nextRound, 800);
    }
  }

  function gameOver() {
    document.body.classList.add("game-over");
    setTimeout(() => document.body.classList.remove("game-over"), 600);

    const reached = level;
    if (reached > best) {
      best = reached;
      localStorage.setItem(STORAGE_KEY, String(best));
      bestValueEl.textContent = best;
      titleEl.textContent = "New Best · " + reached;
    } else {
      titleEl.textContent = "Game Over · " + reached;
    }

    finalLevelEl.textContent = reached;
    finalBestEl.textContent = best;
    overlay.hidden = false;

    playing = false;
    playerTurn = false;
    startBtn.textContent = "Play Again";
    startBtn.classList.add("play-again");
    setTimeout(() => { startBtn.hidden = false; }, 650);
  }

  function startGame() {
    if (playing) return;
    ensureAudio();
    sequence = [];
    userPattern = [];
    level = 0;
    levelValueEl.textContent = "—";
    titleEl.textContent = "Simon";
    startBtn.hidden = true;
    startBtn.classList.remove("play-again");
    overlay.hidden = true;
    playing = true;
    nextRound();
  }

  startBtn.addEventListener("click", startGame);

  document.addEventListener("keydown", () => {
    if (!playing && !startBtn.hidden) startGame();
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!playing || !playerTurn) return;
      const color = btn.id;
      userPattern.push(color);
      flashWithSound(color);
      checkAnswer();
    });
  });
})();
