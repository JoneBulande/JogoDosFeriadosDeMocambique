const feriados = [
  { emoji: "🎆", celebra: "Ano Novo", data: "1 de Janeiro", curiosidade: "Celebrado com fogos de artifício em todo o país." },
  { emoji: "🦸", celebra: "Dia dos Heróis Moçambicanos", data: "3 de Fevereiro", curiosidade: "Homenageia Eduardo Mondlane, fundador da FRELIMO." },
  { emoji: "👩", celebra: "Dia da Mulher Moçambicana", data: "7 de Abril", curiosidade: "Homenageia Josina Machel e todas as mulheres que lutaram pela independência." },
  { emoji: "✊", celebra: "Dia Internacional dos Trabalhadores", data: "1 de Maio", curiosidade: "Celebrado em mais de 160 países ao redor do mundo." },
  { emoji: "🇲🇿", celebra: "Dia da Independência Nacional", data: "25 de Junho", curiosidade: "Moçambique tornou-se independente de Portugal em 1975." },
  { emoji: "🎗️", celebra: "Dia da Vitória", data: "7 de Setembro", curiosidade: "Marca o acordo de paz de Lusaka em 1974." },
  { emoji: "⚔️", celebra: "Dia das Forças Armadas", data: "25 de Setembro", curiosidade: "Início da luta armada de libertação nacional em 1964." },
  { emoji: "🕊️", celebra: "Dia da Paz e Reconciliação", data: "4 de Outubro", curiosidade: "Assinatura do Acordo Geral de Paz em Roma em 1992." },
  { emoji: "👨‍👩‍👧", celebra: "Dia da Família", data: "25 de Dezembro", curiosidade: "Coincide com o Natal e é celebrado como dia dedicado à família." },
];

const questionTypes = ["data", "nome"];

const TOTAL_QUESTIONS = 7;
const POINTS_CORRECT  = 100;
const STREAK_BONUS    = 50;

let score = 0, questionCount = 0, streak = 0, bestStreak = 0;
let currentN = -1, currentType = "data";
let startTime = Date.now();
let gameActive = false;
let answeredQ = 0;

/* ── GAME FLOW ── */

function reset() {
  if (questionCount >= TOTAL_QUESTIONS) {
    showFinalScore();
    return;
  }

  const card = document.getElementById("quiz-card");
  card.style.opacity = "0";
  card.style.transform = "scale(0.97)";

  setTimeout(() => {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    card.style.opacity = "1";
    card.style.transform = "scale(1)";
    buildQuestion();
  }, 200);
}

function buildQuestion() {
  const pergunta    = document.getElementById("pergunta");
  const opcoes      = document.getElementById("opcoes");
  const imgEl       = document.getElementById("img");
  const emojiEl     = document.getElementById("img-emoji");
  const badge       = document.getElementById("q-badge");
  const qCounter    = document.getElementById("q-counter");
  const progressBar = document.getElementById("progress-bar");

  // Pick a random holiday (avoid immediate repeat)
  let n;
  do { n = Math.floor(Math.random() * feriados.length); } while (n === currentN);
  currentN = n;

  // Pick question type randomly
  currentType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  // Show image or emoji
  if (feriados[n].img) {
    imgEl.src = feriados[n].img;
    imgEl.style.display = "block";
    emojiEl.style.display = "none";
  } else {
    imgEl.style.display = "none";
    emojiEl.style.display = "block";
    emojiEl.textContent = feriados[n].emoji;
  }

  // Question text
  if (currentType === "data") {
    badge.textContent = "Data";
    pergunta.innerHTML = `Em que data se celebra o <span class="holiday-name">${feriados[n].celebra}</span>?`;
  } else {
    badge.textContent = "Nome";
    pergunta.innerHTML = `Qual é o feriado celebrado no dia <span class="holiday-name">${feriados[n].data}</span>?`;
  }

  // Build answer options
  const extractFn     = currentType === "data" ? f => f.data : f => f.celebra;
  const correctAnswer = extractFn(feriados[n]);

  let pool = feriados.map(extractFn).filter(a => a !== correctAnswer);
  pool.sort(() => 0.5 - Math.random());
  let answersToShow = pool.slice(0, 3);
  answersToShow.push(correctAnswer);
  answersToShow.sort(() => 0.5 - Math.random());

  opcoes.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  answersToShow.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.className = "item";
    btn.innerHTML = `<span class="item-letter">${letters[i]}</span>${answer}`;
    btn.dataset.answer = answer;
    btn.onclick = () => responder(btn, answer, correctAnswer);

    // stagger entrance animation
    btn.style.opacity = "0";
    btn.style.transform = "translateX(-10px)";
    btn.style.transition = `opacity 0.25s ease ${i * 0.07}s, transform 0.25s ease ${i * 0.07}s`;
    opcoes.appendChild(btn);

    requestAnimationFrame(() => {
      btn.style.opacity = "1";
      btn.style.transform = "translateX(0)";
    });
  });

  // Update progress
  const pct = (questionCount / TOTAL_QUESTIONS) * 100;
  progressBar.style.width = pct + "%";
  qCounter.textContent = `Pergunta ${questionCount + 1} / ${TOTAL_QUESTIONS}`;

  gameActive = true;
}

function responder(btn, selectedAnswer, correctAnswer) {
  if (!gameActive) return;
  gameActive = false;

  const allBtns = document.querySelectorAll(".item");
  allBtns.forEach(b => (b.disabled = true));

  const ding     = document.getElementById("ding");
  const wrongSnd = document.getElementById("wrong");

  if (selectedAnswer === correctAnswer) {
    btn.classList.add("correct");
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    answeredQ++;

    let pts = POINTS_CORRECT;
    if (streak >= 2) pts += STREAK_BONUS;
    score += pts;

    // Bonus flash for streaks
    if (streak >= 2) {
      const flash = document.createElement("div");
      flash.className = "multiplier-flash";
      flash.textContent = `+${pts} pts 🔥`;
      document.getElementById("card-top").appendChild(flash);
      setTimeout(() => flash.remove(), 900);
    }

    updateScoreDisplay();
    updateStreakBadge();
    showToast(getCorrectMessage(), "correct-toast");

    try { ding.currentTime = 0; ding.play(); } catch (e) {}

    // Show curiosity fact after a short delay
    const curiosidade = feriados[currentN].curiosidade;
    setTimeout(() => {
      const p = document.getElementById("pergunta");
      p.innerHTML = `<span style="color:var(--verde);font-size:0.9rem;">💡 ${curiosidade}</span>`;
    }, 350);

  } else {
    btn.classList.add("wrong");
    streak = 0;
    updateStreakBadge();

    // Reveal the correct answer
    allBtns.forEach(b => {
      if (b.dataset.answer === correctAnswer) b.classList.add("reveal");
    });

    showToast("Não foi desta vez! 😕", "wrong-toast");
    try { wrongSnd.currentTime = 0; wrongSnd.play(); } catch (e) {}
  }

  questionCount++;
  setTimeout(reset, 1800);
}

/* ── UI HELPERS ── */

function updateScoreDisplay() {
  document.getElementById("score-val").textContent = score;
}

function updateStreakBadge() {
  const badge = document.getElementById("streak-badge");
  const num   = document.getElementById("streak-num");
  if (streak >= 2) {
    badge.classList.add("show");
    num.textContent = streak;
  } else {
    badge.classList.remove("show");
  }
}

function showToast(msg, cls) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast " + cls + " show";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "toast"; }, 1600);
}

function getCorrectMessage() {
  const msgs = ["Correto! 🎉", "Muito bem! ✨", "Excelente! 🌟", "Perfeito! 🇲🇿", "Ótimo! 🏆"];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

/* ── FINAL SCREEN ── */

function showFinalScore() {
  gameActive = false;
  const elapsed      = Math.round((Date.now() - startTime) / 1000);
  const quizCard     = document.getElementById("quiz-card");
  const finalScreen  = document.getElementById("final-screen");
  const scoreRow     = document.getElementById("score-row");
  const progressWrap = document.getElementById("progress-wrap");

  quizCard.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  quizCard.style.opacity    = "0";
  quizCard.style.transform  = "scale(0.95)";

  setTimeout(() => {
    quizCard.style.display    = "none";
    scoreRow.style.display    = "none";
    progressWrap.style.display = "none";
    finalScreen.classList.add("show");

    const pct = Math.round((answeredQ / TOTAL_QUESTIONS) * 100);

    // Choose trophy and message based on performance
    let trophy = "🏆", msg = "", stars = 0;
    if (pct === 100)    { trophy = "🥇"; msg = "Perfeito! És um especialista em feriados moçambicanos!"; stars = 3; }
    else if (pct >= 70) { trophy = "🏆"; msg = "Muito bom! Conheces bem o calendário nacional."; stars = 2; }
    else if (pct >= 40) { trophy = "🎖️"; msg = "Bom esforço! Continua a aprender sobre Moçambique."; stars = 1; }
    else                { trophy = "📚"; msg = "Continua a estudar os feriados nacionais!"; stars = 0; }

    document.getElementById("trophy-icon").textContent     = trophy;
    document.getElementById("final-score-big").textContent = score;
    document.getElementById("final-msg").textContent       = msg;

    // Render stars
    const starsRow = document.getElementById("stars-row");
    starsRow.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const s = document.createElement("div");
      s.className = "star" + (i < stars ? " lit" : "");
      s.style.animationDelay = (0.2 + i * 0.15) + "s";
      s.textContent = "⭐";
      starsRow.appendChild(s);
    }

    // Stats
    document.getElementById("stat-correct").textContent = `${answeredQ}/${TOTAL_QUESTIONS}`;
    document.getElementById("stat-acc").textContent     = pct + "%";
    document.getElementById("stat-streak").textContent  = bestStreak;
    document.getElementById("stat-time").textContent    = elapsed + "s";
  }, 450);
}

/* ── RESTART ── */

function restartGame() {
  score = 0; questionCount = 0; streak = 0; bestStreak = 0; answeredQ = 0;
  currentN  = -1;
  startTime = Date.now();

  const quizCard     = document.getElementById("quiz-card");
  const finalScreen  = document.getElementById("final-screen");
  const scoreRow     = document.getElementById("score-row");
  const progressWrap = document.getElementById("progress-wrap");

  finalScreen.classList.remove("show");
  finalScreen.style.display  = "";
  quizCard.style.display     = "";
  quizCard.style.opacity     = "1";
  quizCard.style.transform   = "scale(1)";
  scoreRow.style.display     = "";
  progressWrap.style.display = "";

  updateScoreDisplay();
  updateStreakBadge();
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("streak-badge").classList.remove("show");

  reset();
}

/* ── START ── */
window.onload = () => {
  startTime = Date.now();
  buildQuestion();
};
