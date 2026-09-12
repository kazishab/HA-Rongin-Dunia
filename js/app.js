/* HA রঙিন পাঠশালা — অ্যাপ লজিক */

const CAT_ICON = {
  vowels: "📖",
  consonants: "🔤",
  english: "🔡",
  fruits: "🍉",
  flowers: "🌼",
  numbers: "🔢",
  numbers_en: "💯",
  arabic: "🕌",
  rhymes: "🎵"
};

const LEVEL_SIZE = 15;
const STORAGE_KEY = "ha_rp_stars_v1";
const LEVEL_STORAGE_KEY = "ha_rp_levels_v1";

let totalStars = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
let levelStars = {};
try {
  levelStars = JSON.parse(localStorage.getItem(LEVEL_STORAGE_KEY) || "{}");
} catch (e) {
  levelStars = {};
}

let currentStack = ["home"];
let exitArmed = false;
let exitTimer = null;
let activeQuiz = null;

/* ---------------- DOM refs ---------------- */
const el = {
  backBtn: document.getElementById("backBtn"),
  headerTitle: document.getElementById("headerTitle"),
  scorePill: document.getElementById("scoreCount"),
  screenHome: document.getElementById("screen-home"),
  screenCategory: document.getElementById("screen-category"),
  screenLevels: document.getElementById("screen-levels"),
  catGrid: document.getElementById("catGrid"),
  catTitle: document.getElementById("catTitle"),
  itemGrid: document.getElementById("itemGrid"),
  quizLaunchBtn: document.getElementById("quizLaunchBtn"),
  screenQuiz: document.getElementById("screen-quiz"),
  quizBody: document.getElementById("quizBody"),
  levelsTitle: document.getElementById("levelsTitle"),
  levelsGrid: document.getElementById("levelsGrid"),
  detailOverlay: document.getElementById("detailOverlay"),
  detailCard: document.getElementById("detailCard"),
  quickToast: document.getElementById("quickToast"),
  quickToastEmoji: document.getElementById("quickToastEmoji"),
  quickToastWord: document.getElementById("quickToastWord"),
  exitToast: document.getElementById("exitToast"),
  splash: document.getElementById("splash")
};

/* ---------------- Utility: star burst ---------------- */
function burst(x, y, emojis) {
  const items = emojis || ["⭐", "✨", "🌟"];
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("div");
    s.className = "burst";
    s.textContent = items[Math.floor(Math.random() * items.length)];
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
    const dist = 60 + Math.random() * 40;
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    s.style.setProperty("--rot", Math.random() * 360 + "deg");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 850);
  }
}

function addStars(n) {
  totalStars += n;
  localStorage.setItem(STORAGE_KEY, String(totalStars));
  el.scorePill.textContent = totalStars;
}

function saveLevelStars(key, levelIdx, stars) {
  const k = key + ":" + levelIdx;
  if (!levelStars[k] || levelStars[k] < stars) {
    levelStars[k] = stars;
    localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(levelStars));
  }
}
function getLevelStars(key, levelIdx) {
  return levelStars[key + ":" + levelIdx] || 0;
}

/* ---------------- Speech (improved voice selection) ---------------- */
let voicesCache = [];
function loadVoices() {
  if ("speechSynthesis" in window) {
    voicesCache = window.speechSynthesis.getVoices() || [];
  }
}
if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice(langCode) {
  if (!voicesCache.length) return null;
  const baseLang = langCode.split("-")[0].toLowerCase();
  let candidates = voicesCache.filter((v) => v.lang && v.lang.toLowerCase() === langCode.toLowerCase());
  if (!candidates.length) {
    candidates = voicesCache.filter((v) => v.lang && v.lang.toLowerCase().startsWith(baseLang));
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const score = (v) => {
      let s = 0;
      if (/google/i.test(v.name)) s += 3;
      if (v.localService) s += 1;
      if (/natural|neural|premium/i.test(v.name)) s += 2;
      return s;
    };
    return score(b) - score(a);
  });
  return candidates[0];
}

function speak(text, langCode) {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langCode || "bn-BD";
  const v = pickVoice(u.lang);
  if (v) u.voice = v;
  const isAr = u.lang.startsWith("ar");
  const isBn = u.lang.startsWith("bn");
  u.rate = isAr ? 0.78 : isBn ? 0.85 : 0.92;
  u.pitch = 1.0;
  u.volume = 1.0;
  window.speechSynthesis.speak(u);
}

/* ---------------- Navigation core ---------------- */
function stackKey(stack) {
  return stack.join(">");
}

function pushScreen(stack) {
  currentStack = stack;
  history.pushState({ stack }, "", "#" + stackKey(stack));
  renderStack();
}

function initNav() {
  history.replaceState({ stack: ["home"] }, "", "#home");
  history.pushState({ stack: ["home"], buffered: true }, "", "#home");
  currentStack = ["home"];
}

function showExitToast() {
  el.exitToast.classList.add("show");
}
function hideExitToast() {
  el.exitToast.classList.remove("show");
}
function tryCloseApp() {
  window.close();
}

window.addEventListener("popstate", (e) => {
  const wasHome = currentStack.length === 1 && currentStack[0] === "home";
  const state = e.state;
  const newStack = state && state.stack ? state.stack : ["home"];
  const isHome = newStack.length === 1 && newStack[0] === "home";

  if (wasHome && isHome) {
    if (!exitArmed) {
      exitArmed = true;
      showExitToast();
      history.pushState({ stack: ["home"], buffered: true }, "", "#home");
      clearTimeout(exitTimer);
      exitTimer = setTimeout(() => {
        exitArmed = false;
        hideExitToast();
      }, 2200);
    } else {
      clearTimeout(exitTimer);
      hideExitToast();
      exitArmed = false;
      tryCloseApp();
    }
    currentStack = ["home"];
    renderStack();
    return;
  }

  currentStack = newStack;
  exitArmed = false;
  hideExitToast();
  renderStack();
});

function goBack() {
  history.back();
}
el.backBtn.addEventListener("click", goBack);

/* ---------------- Rendering ---------------- */
function topEntry() {
  return currentStack[currentStack.length - 1];
}
function baseEntry() {
  for (let i = currentStack.length - 1; i >= 0; i--) {
    if (!currentStack[i].startsWith("detail:")) return currentStack[i];
  }
  return "home";
}

function setActiveScreen(name) {
  [el.screenHome, el.screenCategory, el.screenLevels, el.screenQuiz].forEach((s) => s.classList.remove("active"));
  if (name === "home") el.screenHome.classList.add("active");
  else if (name.startsWith("cat:")) el.screenCategory.classList.add("active");
  else if (name.startsWith("lvls:")) el.screenLevels.classList.add("active");
  else if (name.startsWith("quiz:")) el.screenQuiz.classList.add("active");
}

function getLevels(key) {
  const items = DATA[key].items;
  const levels = [];
  for (let i = 0; i < items.length; i += LEVEL_SIZE) {
    levels.push({ index: levels.length, start: i, end: Math.min(i + LEVEL_SIZE, items.length), items: items.slice(i, i + LEVEL_SIZE) });
  }
  return levels;
}

function renderStack() {
  const base = baseEntry();
  setActiveScreen(base);

  if (base === "home") {
    el.backBtn.classList.remove("show");
    el.headerTitle.textContent = "HA রঙিন পাঠশালা";
  } else if (base.startsWith("cat:")) {
    const key = base.split(":")[1];
    el.backBtn.classList.add("show");
    el.headerTitle.textContent = DATA[key].title;
    renderCategory(key);
  } else if (base.startsWith("lvls:")) {
    const key = base.split(":")[1];
    el.backBtn.classList.add("show");
    el.headerTitle.textContent = DATA[key].title + " কুইজ";
    renderLevels(key);
  } else if (base.startsWith("quiz:")) {
    const parts = base.split(":");
    const key = parts[1];
    const levelIdx = parseInt(parts[2], 10);
    el.backBtn.classList.add("show");
    el.headerTitle.textContent = DATA[key].title + " - লেভেল " + (levelIdx + 1);
    if (!activeQuiz || activeQuiz.key !== key || activeQuiz.levelIdx !== levelIdx) {
      startQuiz(key, levelIdx);
    }
  }

  const top = topEntry();
  if (top.startsWith("detail:")) {
    const parts = top.split(":");
    openDetail(parts[1], parseInt(parts[2], 10));
  } else {
    closeDetail();
  }
}

/* ---------------- Home screen ---------------- */
function renderHome() {
  el.catGrid.innerHTML = "";
  CATEGORY_ORDER.forEach((key) => {
    const cat = DATA[key];
    const btn = document.createElement("button");
    btn.className = "cat-card";
    btn.style.background = cat.color;
    btn.innerHTML = `
      <div class="cat-emoji">${CAT_ICON[key]}</div>
      <div class="cat-name">${cat.title}</div>
      <div class="cat-count">${cat.items.length}টি</div>
    `;
    btn.addEventListener("click", () => pushScreen([...currentStack, "cat:" + key]));
    el.catGrid.appendChild(btn);
  });
}

/* ---------------- Quick tap-to-speak (instant, no navigation needed) ---------------- */
let quickToastTimer = null;
function quickSpeak(key, item, cat) {
  window.speechSynthesis && window.speechSynthesis.cancel();
  clearTimeout(quickToastTimer);

  el.quickToastEmoji.textContent = (key === "fruits" || key === "flowers" || key === "arabic" || key === "numbers" || key === "numbers_en" || key === "rhymes")
    ? item.char
    : (item.emoji || item.char);
  el.quickToastWord.textContent = item.word || item.char;
  el.quickToast.classList.add("show");

  const spokenText = item.speak || item.text || item.word || item.char;
  speak(spokenText, cat.lang);

  const duration = Math.min(9000, Math.max(1600, spokenText.length * 70));
  quickToastTimer = setTimeout(() => {
    el.quickToast.classList.remove("show");
  }, duration);
}

/* ---------------- Category screen ---------------- */
function renderCategory(key) {
  const cat = DATA[key];
  el.catTitle.textContent = cat.subtitle;
  el.itemGrid.innerHTML = "";
  el.itemGrid.classList.toggle("rtl-grid", key === "arabic");
  el.quizLaunchBtn.style.display = cat.noQuiz ? "none" : "";
  el.quizLaunchBtn.onclick = () => pushScreen([...currentStack, "lvls:" + key]);

  cat.items.forEach((item, idx) => {
    const card = document.createElement("button");
    card.className = "item-card";
    card.style.background = "#fff";

    if (key === "fruits" || key === "flowers") {
      card.innerHTML = `
        <div class="item-emoji" style="font-size:34px">${item.char}</div>
        <div class="item-word">${item.word}</div>
        <div class="speak-badge">🔊</div>
      `;
    } else if (key === "arabic") {
      card.innerHTML = `
        <div class="item-char" style="color:${cat.color};font-size:36px">${item.char}</div>
        <div class="item-word">${item.word}</div>
        <div class="speak-badge">🔊</div>
      `;
    } else if (key === "numbers" || key === "numbers_en") {
      const row = item.count <= 20 ? "🍎".repeat(Math.min(item.count, 10)) : "";
      card.innerHTML = `
        <div class="item-char" style="color:${cat.color}">${item.char}</div>
        ${row ? `<div class="num-emoji-row">${row}</div>` : ""}
        <div class="item-word">${item.word}</div>
      `;
    } else if (key === "rhymes") {
      card.innerHTML = `
        <div class="item-emoji" style="font-size:34px">${item.char}</div>
        <div class="item-word">${item.word}</div>
      `;
    } else {
      card.innerHTML = `
        <div class="item-char" style="color:${cat.color}">${item.char}</div>
        <div class="item-emoji">${item.emoji}</div>
        ${item.word ? `<div class="item-word">${item.word}</div>` : ""}
        <div class="speak-badge">🔊</div>
      `;
    }

    card.addEventListener("click", (ev) => {
      burst(ev.clientX, ev.clientY);
      card.classList.remove("tapped");
      void card.offsetWidth;
      card.classList.add("tapped");
      quickSpeak(key, item, cat);
    });
    el.itemGrid.appendChild(card);
  });
}

/* ---------------- Detail overlay ---------------- */
function openDetail(key, idx) {
  const cat = DATA[key];
  const item = cat.items[idx];
  const lang = cat.lang;

  let charHtml, emojiHtml, wordHtml, subHtml;

  if (key === "fruits" || key === "flowers") {
    charHtml = "";
    emojiHtml = `<div class="detail-emoji" style="font-size:80px">${item.char}</div>`;
    wordHtml = `<div class="detail-word">${item.word}</div>`;
    subHtml = `<div class="detail-sub en">${item.sub}</div>`;
  } else if (key === "arabic") {
    charHtml = `<div class="detail-char" style="color:${cat.color};font-size:88px">${item.char}</div>`;
    emojiHtml = "";
    wordHtml = `<div class="detail-word">${item.word}</div>`;
    subHtml = `<div class="detail-sub en">${item.sub}</div>`;
  } else if (key === "numbers" || key === "numbers_en") {
    charHtml = `<div class="detail-char" style="color:${cat.color}">${item.char}</div>`;
    emojiHtml = item.count <= 30 ? `<div class="detail-emoji" style="font-size:15px;line-height:1.6">${"🍎".repeat(item.count)}</div>` : "";
    wordHtml = `<div class="detail-word">${item.word}</div>`;
    subHtml = `<div class="detail-sub en">${item.sub}</div>`;
  } else if (key === "rhymes") {
    el.detailCard.className = "detail-card rhyme-card";
    el.detailCard.innerHTML = `
      <div class="rhyme-title">${item.char} ${item.word}</div>
      <div class="rhyme-text">${item.text}</div>
      <button class="speak-btn" id="detailSpeakBtn">🔊 শুনুন</button>
      <div><button class="detail-close" id="detailCloseBtn">বন্ধ করুন ✕</button></div>
    `;
    document.getElementById("detailSpeakBtn").addEventListener("click", () => {
      speak(item.speak || item.text, lang);
    });
    document.getElementById("detailCloseBtn").addEventListener("click", goBack);
    el.detailOverlay.onclick = (ev) => {
      if (ev.target === el.detailOverlay) goBack();
    };
    el.detailOverlay.classList.add("show");
    speak(item.speak || item.text, lang);
    return;
  } else {
    charHtml = `<div class="detail-char" style="color:${cat.color}">${item.char}</div>`;
    emojiHtml = `<div class="detail-emoji">${item.emoji}</div>`;
    wordHtml = item.word ? `<div class="detail-word">${item.word}</div>` : "";
    subHtml = "";
  }

  el.detailCard.className = "detail-card";
  el.detailCard.innerHTML = `
    ${charHtml}
    ${emojiHtml}
    ${wordHtml}
    ${subHtml}
    <button class="speak-btn" id="detailSpeakBtn">🔊 শুনুন</button>
    <div><button class="detail-close" id="detailCloseBtn">বন্ধ করুন ✕</button></div>
  `;

  document.getElementById("detailSpeakBtn").addEventListener("click", () => {
    speak(item.speak || item.word || item.char, lang);
  });
  document.getElementById("detailCloseBtn").addEventListener("click", goBack);
  el.detailOverlay.onclick = (ev) => {
    if (ev.target === el.detailOverlay) goBack();
  };

  el.detailOverlay.classList.add("show");
  speak(item.speak || item.word || item.char, lang);
}

function closeDetail() {
  el.detailOverlay.classList.remove("show");
}

/* ---------------- Level select screen ---------------- */
function renderLevels(key) {
  const cat = DATA[key];
  const levels = getLevels(key);
  el.levelsTitle.textContent = cat.title + " — লেভেল বাছাই করুন";
  el.levelsGrid.innerHTML = "";

  levels.forEach((lvl) => {
    const stars = getLevelStars(key, lvl.index);
    const btn = document.createElement("button");
    btn.className = "level-card";
    btn.style.borderColor = cat.color;
    btn.innerHTML = `
      <div class="level-num" style="background:${cat.color}">${lvl.index + 1}</div>
      <div class="level-range">${toBnNumeral(lvl.start + 1)} - ${toBnNumeral(lvl.end)}</div>
      <div class="level-stars">${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}</div>
    `;
    btn.addEventListener("click", () => pushScreen([...currentStack, "quiz:" + key + ":" + lvl.index]));
    el.levelsGrid.appendChild(btn);
  });
}

/* ---------------- Quiz ---------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz(key, levelIdx) {
  const cat = DATA[key];
  const levels = getLevels(key);
  const level = levels[levelIdx];
  const pool = level.items.filter((it) => it.word);
  const qCount = Math.min(8, pool.length);
  const chosen = shuffle(pool).slice(0, qCount);

  activeQuiz = { key, levelIdx, questions: chosen, index: 0, score: 0 };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = activeQuiz.questions[activeQuiz.index];
  const cat = DATA[activeQuiz.key];
  const lang = cat.lang;
  const levels = getLevels(activeQuiz.key);
  const levelPool = levels[activeQuiz.levelIdx].items.filter((it) => it.word && it.word !== q.word);
  let distractorSource = levelPool.length >= 3 ? levelPool : cat.items.filter((it) => it.word && it.word !== q.word);
  const distractors = shuffle(distractorSource).slice(0, 3);
  const options = shuffle([q, ...distractors]);

  const mainDisplay = q.char;

  el.quizBody.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-progress">প্রশ্ন ${activeQuiz.index + 1} / ${activeQuiz.questions.length} &nbsp;•&nbsp; স্কোর ${activeQuiz.score}</div>
      <div class="quiz-question">
        <div class="q-label">এটা কী?</div>
        <div class="q-main">${mainDisplay}</div>
      </div>
      <div class="quiz-options" id="quizOptions"></div>
    </div>
  `;

  const optWrap = document.getElementById("quizOptions");
  options.forEach((opt) => {
    const b = document.createElement("button");
    b.className = "quiz-opt";
    b.textContent = opt.word;
    b.addEventListener("click", () => handleAnswer(opt, q, b, optWrap, lang));
    optWrap.appendChild(b);
  });
}

function handleAnswer(chosenOpt, correctItem, btnEl, wrapEl, lang) {
  Array.from(wrapEl.children).forEach((c) => (c.onclick = null));
  const isCorrect = chosenOpt.word === correctItem.word;

  Array.from(wrapEl.children).forEach((c) => {
    if (c.textContent === correctItem.word) c.classList.add("correct");
    else if (c === btnEl) c.classList.add("wrong");
  });

  if (isCorrect) {
    activeQuiz.score++;
    const r = btnEl.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2);
  }
  speak(correctItem.speak || correctItem.word, lang);

  setTimeout(() => {
    activeQuiz.index++;
    if (activeQuiz.index >= activeQuiz.questions.length) {
      renderQuizResult();
    } else {
      renderQuizQuestion();
    }
  }, 900);
}

function renderQuizResult() {
  const total = activeQuiz.questions.length;
  const score = activeQuiz.score;
  const pct = score / total;
  let stars = 0;
  if (pct === 1) stars = 3;
  else if (pct >= 0.7) stars = 2;
  else if (pct >= 0.4) stars = 1;

  addStars(stars);
  saveLevelStars(activeQuiz.key, activeQuiz.levelIdx, stars);

  const key = activeQuiz.key;
  const levelIdx = activeQuiz.levelIdx;
  const levels = getLevels(key);
  const nextLevelIdx = levelIdx + 1;
  const hasNext = nextLevelIdx < levels.length;

  const msg = pct === 1 ? "চমৎকার! সব ঠিক! 🎉" : pct >= 0.6 ? "খুব ভালো হয়েছে! 👏" : "আরেকটু চেষ্টা করি! 💪";

  el.quizBody.innerHTML = `
    <div class="quiz-result">
      <div class="result-emoji">${pct === 1 ? "🏆" : pct >= 0.6 ? "🎉" : "🙂"}</div>
      <h2>${msg}</h2>
      <p>${score} / ${total} সঠিক উত্তর</p>
      <div class="stars">${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}</div>
      ${hasNext ? `<p class="next-level-note" id="nextLevelNote">পরের লেভেল শুরু হচ্ছে...</p>` : `<p class="next-level-note">🎉 এই ক্যাটেগরির সব লেভেল শেষ!</p>`}
      <div class="result-btns">
        ${hasNext ? `<button class="retry-btn" id="nextLevelBtn">পরের লেভেল ▶</button>` : ""}
        <button class="retry-btn" id="retryBtn">আবার খেলি</button>
        <button class="levels-btn" id="levelsBackBtn">লেভেল লিস্ট</button>
      </div>
    </div>
  `;

  let autoAdvanceTimer = null;
  const goToNextLevel = () => {
    clearTimeout(autoAdvanceTimer);
    pushScreen([...currentStack.slice(0, -1), "quiz:" + key + ":" + nextLevelIdx]);
  };

  if (hasNext) {
    autoAdvanceTimer = setTimeout(goToNextLevel, 2500);
    document.getElementById("nextLevelBtn").addEventListener("click", goToNextLevel);
  }
  document.getElementById("retryBtn").addEventListener("click", () => {
    clearTimeout(autoAdvanceTimer);
    startQuiz(activeQuiz.key, activeQuiz.levelIdx);
  });
  document.getElementById("levelsBackBtn").addEventListener("click", () => {
    clearTimeout(autoAdvanceTimer);
    goBack();
  });

  if (stars >= 2) {
    setTimeout(() => burst(window.innerWidth / 2, window.innerHeight / 2), 200);
  }
}

/* ---------------- Boot ---------------- */
function boot() {
  el.scorePill.textContent = totalStars;
  renderHome();
  initNav();
  renderStack();
}

window.addEventListener("DOMContentLoaded", () => {
  boot();
  setTimeout(() => {
    el.splash.classList.add("hide");
  }, 1900);
  el.splash.addEventListener("click", () => el.splash.classList.add("hide"));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
