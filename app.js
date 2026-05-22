/* ═══════════════════════════════════════════════════════
   DECISION WHEEL — Main Application Script
   Features: Canvas wheel, spin physics, confetti, templates,
             share URL, sound, themes, FAQ accordion, reveal
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────── COLOR THEMES ─────────────────────── */
const COLOR_THEMES = {
  vibrant: ['#F4A261','#E76F51','#264653','#2A9D8F','#E9C46A','#F4A261','#D62828','#023E8A','#80B918','#F77F00'],
  sunset:  ['#FF6B6B','#FFA07A','#FFD700','#FF8C00','#DC143C','#FF4500','#FFB347','#FF69B4','#DB7093','#E55'],
  ocean:   ['#006994','#0099CC','#00CED1','#20B2AA','#4682B4','#1E90FF','#00BFFF','#87CEEB','#2E8B57','#3CB371'],
  candy:   ['#FF69B4','#FF1493','#9B59B6','#8E44AD','#F39C12','#FF6EB4','#DA70D6','#EE82EE','#D8BFD8','#BA55D3'],
  forest:  ['#2ECC71','#27AE60','#F39C12','#E67E22','#1ABC9C','#16A085','#F1C40F','#D35400','#28B463','#117A65'],
  mono:    ['#2c2c2c','#444','#666','#888','#aaa','#bbb','#999','#555','#333','#777'],
};

/* ─────────────────────── TEMPLATES ─────────────────────── */
const TEMPLATES = [
  { id: 'food', emoji: '🍕', name: 'Where to Eat', entries: ['Pizza','Sushi','Tacos','Burgers','Pasta','Ramen','Thai','Indian','Salad','BBQ'] },
  { id: 'yesno', emoji: '🤔', name: 'Yes or No', entries: ['Yes','No','Maybe','Ask Again','Definitely!','Nope'] },
  { id: 'movies', emoji: '🎬', name: 'Movie Night', entries: ['Action','Comedy','Horror','Thriller','Romance','Sci-Fi','Documentary','Animation','Drama'] },
  { id: 'chores', emoji: '🧹', name: 'Chore Wheel', entries: ['Dishes','Vacuum','Laundry','Trash','Groceries','Cook','Sweep','Mop','Dust','Garden'] },
  { id: 'games', emoji: '🎮', name: 'Game Night', entries: ['Chess','Scrabble','Poker','Uno','Monopoly','Catan','Jenga','Pictionary','Codenames','Sorry'] },
  { id: 'travel', emoji: '✈️', name: 'Travel Picker', entries: ['Paris','Tokyo','New York','Bali','London','Sydney','Dubai','Barcelona','Rome','Istanbul'] },
  { id: 'team', emoji: '👥', name: 'Team Names', entries: ['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Henry','Iris','Jack'] },
  { id: 'luck', emoji: '🍀', name: 'Lucky Number', entries: ['1','2','3','4','5','6','7','8','9','10','11','12'] },
];

/* ─────────────────────── APP STATE ─────────────────────── */
const state = {
  entries: ['Pizza', 'Sushi', 'Tacos', 'Burgers', 'Ramen'],
  currentTheme: 'vibrant',
  spinDuration: 6,
  spinMode: 'normal',
  confetti: true,
  removeAfterSpin: false,
  soundEnabled: true,
  isSpinning: false,
  rotation: 0,
  lastWinner: null,
};

/* ─────────────────────── DOM REFS ─────────────────────── */
const canvas = document.getElementById('wheel-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const spinBtn = document.getElementById('spin-btn');
const entryInput = document.getElementById('entry-input');
const addEntryBtn = document.getElementById('add-entry-btn');
const entriesList = document.getElementById('entries-list');
const entryCount = document.getElementById('entry-count');
const resultOverlay = document.getElementById('result-overlay');
const resultWinner = document.getElementById('result-winner');
const resultSpinAgain = document.getElementById('result-spin-again');
const resultClose = document.getElementById('result-close');
const spinDurationSlider = document.getElementById('spin-duration');
const spinDurationVal = document.getElementById('spin-duration-val');
const soundBtn = document.getElementById('sound-btn');
const shareBtn = document.getElementById('share-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const sortBtn = document.getElementById('sort-btn');
const confettiToggle = document.getElementById('confetti-toggle');
const removeAfterSpinToggle = document.getElementById('remove-after-spin');
const templatesGrid = document.getElementById('templates-grid');
const tmplShowcase = document.getElementById('tmpl-showcase');

/* ─────────────────────── HERO DEMO WHEEL ─────────────────────── */
function drawHeroDemoWheel() {
  const svg = document.getElementById('hero-wheel-demo');
  if (!svg) return;
  const items = ['Tacos', 'Movie Night', 'Hiking', 'Pizza', 'Board Games', 'Sushi', 'Netflix', 'Gym'];
  const colors = COLOR_THEMES.vibrant;
  const n = items.length;
  const cx = 150, cy = 150, r = 140;
  const sliceAngle = (2 * Math.PI) / n;
  let paths = '';
  let texts = '';

  for (let i = 0; i < n; i++) {
    const start = i * sliceAngle - Math.PI / 2;
    const end = start + sliceAngle;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

    const mid = start + sliceAngle / 2;
    const tr = r * 0.65;
    const tx = cx + tr * Math.cos(mid);
    const ty = cy + tr * Math.sin(mid);
    const deg = (mid * 180 / Math.PI) + 90;

    paths += `<path d="${d}" fill="${colors[i % colors.length]}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" opacity="0.85"/>`;
    texts += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${deg},${tx},${ty})" fill="white" font-size="9" font-weight="600" font-family="DM Sans,sans-serif" opacity="0.95">${items[i]}</text>`;
  }

  svg.innerHTML = `
    <defs>
      <filter id="wheelShadow"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/></filter>
    </defs>
    <g filter="url(#wheelShadow)">
      ${paths}
      <circle cx="${cx}" cy="${cy}" r="18" fill="#1c1c28" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#F4A261"/>
      ${texts}
    </g>
  `;

  // Auto-spin demo
  let angle = 0;
  const group = svg.querySelector('g');
  let lastT = null;
  function animateDemo(t) {
    if (!lastT) lastT = t;
    angle += (t - lastT) * 0.04;
    lastT = t;
    group.setAttribute('transform', `rotate(${angle},150,150)`);
    requestAnimationFrame(animateDemo);
  }
  requestAnimationFrame(animateDemo);
}

/* ─────────────────────── CANVAS WHEEL ─────────────────────── */
function drawWheel(rotationOverride) {
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, r = W / 2 - 6;
  ctx.clearRect(0, 0, W, H);

  const entries = state.entries.length > 0 ? state.entries : ['Add options below'];
  const n = entries.length;
  const sliceAngle = (2 * Math.PI) / n;
  const rot = (rotationOverride !== undefined ? rotationOverride : state.rotation) - Math.PI / 2;
  const colors = COLOR_THEMES[state.currentTheme] || COLOR_THEMES.vibrant;

  // Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(244,162,97,0.12)';
  ctx.shadowBlur = 30;

  for (let i = 0; i < n; i++) {
    const start = rot + i * sliceAngle;
    const end = start + sliceAngle;

    // Slice fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    // Slice border
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Text
  ctx.save();
  for (let i = 0; i < n; i++) {
    const mid = rot + i * sliceAngle + sliceAngle / 2;
    const tr = r * 0.62;
    const tx = cx + tr * Math.cos(mid);
    const ty = cy + tr * Math.sin(mid);

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(mid + Math.PI / 2);

    const fontSize = n <= 6 ? 14 : n <= 12 ? 11 : 9;
    ctx.font = `600 ${fontSize}px 'DM Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;

    let label = entries[i];
    const maxLen = n <= 6 ? 14 : n <= 12 ? 10 : 7;
    if (label.length > maxLen) label = label.slice(0, maxLen - 1) + '…';
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
  ctx.fillStyle = '#1c1c28';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

/* ─────────────────────── SPIN LOGIC ─────────────────────── */
let animFrameId = null;

function spinWheel() {
  if (state.isSpinning || state.entries.length < 2) {
    if (state.entries.length < 2) showToast('Add at least 2 options to spin!');
    return;
  }

  // Pick winner first (fair random)
  const n = state.entries.length;
  const winnerIdx = Math.floor(Math.random() * n);

  const sliceAngle = (2 * Math.PI) / n;
  const duration = state.spinDuration * 1000;

  // Calculate target rotation to land on winner
  const currentRot = state.rotation % (2 * Math.PI);
  const targetSliceCenter = -winnerIdx * sliceAngle - sliceAngle / 2;
  let extraSpins = (Math.PI * 2) * (8 + Math.floor(Math.random() * 6));
  let target = state.rotation + extraSpins + (targetSliceCenter - currentRot + Math.PI * 2 * 3) % (Math.PI * 2);

  state.isSpinning = true;
  spinBtn.classList.add('spinning');

  const startRot = state.rotation;
  const startTime = performance.now();

  // Play tick sound
  if (state.soundEnabled) startTickSound(duration);

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);

    state.rotation = startRot + (target - startRot) * eased;
    drawWheel();

    if (progress < 1) {
      animFrameId = requestAnimationFrame(animate);
    } else {
      state.rotation = target;
      drawWheel();
      state.isSpinning = false;
      spinBtn.classList.remove('spinning');
      stopTickSound();

      // Show result after brief pause
      setTimeout(() => {
        showResult(state.entries[winnerIdx], winnerIdx);
      }, 300);
    }
  }

  animFrameId = requestAnimationFrame(animate);
}

/* ─────────────────────── SOUND ─────────────────────── */
let audioCtx = null;
let tickInterval = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTick() {
  if (!state.soundEnabled) return;
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.06);
  } catch(e) {}
}

function playWin() {
  if (!state.soundEnabled) return;
  try {
    const ac = getAudioCtx();
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.value = f;
      const t = ac.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch(e) {}
}

function startTickSound(totalDuration) {
  let interval = 80;
  let elapsed = 0;
  function tick() {
    playTick();
    elapsed += interval;
    interval = 80 + (elapsed / totalDuration) * 200;
    if (elapsed < totalDuration) {
      tickInterval = setTimeout(tick, interval);
    }
  }
  tickInterval = setTimeout(tick, interval);
}

function stopTickSound() {
  clearTimeout(tickInterval);
}

/* ─────────────────────── RESULT ─────────────────────── */
function showResult(winner, idx) {
  state.lastWinner = { winner, idx };
  resultWinner.textContent = winner;
  resultOverlay.classList.add('show');
  resultOverlay.setAttribute('aria-hidden', 'false');
  playWin();

  if (state.confetti) launchConfetti();

  if (state.spinMode === 'elimination' || state.removeAfterSpin) {
    // Remove winner after modal closes
  }
}

function closeResult() {
  resultOverlay.classList.remove('show');
  resultOverlay.setAttribute('aria-hidden', 'true');
  clearConfetti();

  if (state.lastWinner && (state.spinMode === 'elimination' || state.removeAfterSpin)) {
    const idx = state.lastWinner.idx;
    state.entries.splice(idx, 1);
    if (state.entries.length === 0) showToast('All options eliminated!');
    renderEntries();
    drawWheel();
  }
}

resultSpinAgain && resultSpinAgain.addEventListener('click', () => {
  closeResult();
  setTimeout(spinWheel, 400);
});
resultClose && resultClose.addEventListener('click', closeResult);
resultOverlay && resultOverlay.addEventListener('click', (e) => {
  if (e.target === resultOverlay) closeResult();
});

/* ─────────────────────── CONFETTI ─────────────────────── */
let confettiParticles = [];

function launchConfetti() {
  const area = document.getElementById('result-confetti');
  if (!area) return;
  area.innerHTML = '';
  const colors = ['#F4A261','#E76F51','#2A9D8F','#E9C46A','#264653','#F77F00','#D62828'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const size = 6 + Math.random() * 8;
    p.style.cssText = `
      left:${Math.random()*100}%;
      width:${size}px;
      height:${size*0.6}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${1.2+Math.random()*1.2}s;
      animation-delay:${Math.random()*0.5}s;
      transform:rotate(${Math.random()*360}deg);
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    area.appendChild(p);
  }
}

function clearConfetti() {
  const area = document.getElementById('result-confetti');
  if (area) area.innerHTML = '';
}

/* ─────────────────────── ENTRIES ─────────────────────── */
function renderEntries() {
  if (!entriesList) return;
  const colors = COLOR_THEMES[state.currentTheme] || COLOR_THEMES.vibrant;
  entriesList.innerHTML = '';

  state.entries.forEach((entry, i) => {
    const li = document.createElement('li');
    li.className = 'entry-item';
    li.innerHTML = `
      <div class="entry-color" style="background:${colors[i % colors.length]}"></div>
      <span class="entry-text">${escapeHtml(entry)}</span>
      <button class="entry-del" data-idx="${i}" aria-label="Remove ${escapeHtml(entry)}" title="Remove">×</button>
    `;
    entriesList.appendChild(li);
  });

  entryCount && (entryCount.textContent = state.entries.length);
  drawWheel();
  saveToLocalStorage();
}

function addEntry(val) {
  val = val.trim();
  if (!val) return;
  if (val.length > 40) { showToast('Option too long (max 40 chars)'); return; }
  state.entries.push(val);
  renderEntries();
  if (entryInput) entryInput.value = '';
}

addEntryBtn && addEntryBtn.addEventListener('click', () => addEntry(entryInput.value));
entryInput && entryInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addEntry(entryInput.value);
});

entriesList && entriesList.addEventListener('click', e => {
  const btn = e.target.closest('.entry-del');
  if (btn) {
    const idx = parseInt(btn.dataset.idx);
    state.entries.splice(idx, 1);
    renderEntries();
  }
});

clearAllBtn && clearAllBtn.addEventListener('click', () => {
  if (state.entries.length === 0) return;
  if (confirm('Clear all entries?')) {
    state.entries = [];
    renderEntries();
  }
});

shuffleBtn && shuffleBtn.addEventListener('click', () => {
  for (let i = state.entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.entries[i], state.entries[j]] = [state.entries[j], state.entries[i]];
  }
  renderEntries();
});

sortBtn && sortBtn.addEventListener('click', () => {
  state.entries.sort((a, b) => a.localeCompare(b));
  renderEntries();
});

/* ─────────────────────── SPIN CONTROLS ─────────────────────── */
spinBtn && spinBtn.addEventListener('click', spinWheel);
canvas && canvas.addEventListener('click', spinWheel);
spinBtn && spinBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); spinWheel(); }
});

/* ─────────────────────── STYLE TAB ─────────────────────── */
// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`)?.classList.add('active');
  });
});

// Color themes
document.querySelectorAll('.theme-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    state.currentTheme = swatch.dataset.theme;
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    renderEntries();
  });
});

// Spin duration slider
spinDurationSlider && spinDurationSlider.addEventListener('input', () => {
  state.spinDuration = parseInt(spinDurationSlider.value);
  if (spinDurationVal) spinDurationVal.textContent = state.spinDuration;
});

// Spin mode
document.querySelectorAll('.toggle-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    state.spinMode = opt.dataset.mode;
    document.querySelectorAll('.toggle-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// Confetti toggle
confettiToggle && confettiToggle.addEventListener('change', () => {
  state.confetti = confettiToggle.checked;
});

// Remove after spin toggle
removeAfterSpinToggle && removeAfterSpinToggle.addEventListener('change', () => {
  state.removeAfterSpin = removeAfterSpinToggle.checked;
});

/* ─────────────────────── SOUND ─────────────────────── */
soundBtn && soundBtn.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  soundBtn.classList.toggle('active', state.soundEnabled);
  soundBtn.title = state.soundEnabled ? 'Sound On' : 'Sound Off';
  if (state.soundEnabled) {
    soundBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>`;
  } else {
    soundBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  }
});

/* ─────────────────────── FULLSCREEN ─────────────────────── */
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn && fullscreenBtn.addEventListener('click', () => {
  const el = document.getElementById('wheel-wrap');
  if (!document.fullscreenElement) {
    el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.();
  }
});

/* ─────────────────────── SHARE ─────────────────────── */
shareBtn && shareBtn.addEventListener('click', () => {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({
    entries: state.entries,
    theme: state.currentTheme,
  }))));
  const url = `${window.location.origin}${window.location.pathname}?wheel=${encoded}`;
  if (navigator.share) {
    navigator.share({ title: 'Decision Wheel', url }).catch(() => copyToClipboard(url));
  } else {
    copyToClipboard(url);
  }
});

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).then(() => {
    showToast('🔗 Link copied to clipboard!');
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('🔗 Link copied to clipboard!');
  });
}

/* ─────────────────────── TEMPLATES ─────────────────────── */
function loadTemplate(tmpl) {
  state.entries = [...tmpl.entries];
  renderEntries();
  showToast(`✓ Loaded "${tmpl.name}"`);
  document.querySelector('[data-tab="entries"]')?.click();
}

// Panel templates list
function renderPanelTemplates() {
  if (!templatesGrid) return;
  templatesGrid.innerHTML = TEMPLATES.map(t => `
    <div class="tmpl-item" data-id="${t.id}" role="button" tabindex="0" aria-label="Load ${t.name} template">
      <span class="tmpl-icon">${t.emoji}</span>
      <div class="tmpl-info">
        <div class="tmpl-name">${t.name}</div>
        <div class="tmpl-count">${t.entries.length} options</div>
      </div>
      <span class="tmpl-load">Load</span>
    </div>
  `).join('');

  templatesGrid.querySelectorAll('.tmpl-item').forEach(item => {
    item.addEventListener('click', () => {
      const tmpl = TEMPLATES.find(t => t.id === item.dataset.id);
      if (tmpl) loadTemplate(tmpl);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

// Showcase section templates
function renderTemplateShowcase() {
  if (!tmplShowcase) return;
  tmplShowcase.innerHTML = TEMPLATES.map(t => `
    <div class="tmpl-showcase-card reveal" data-id="${t.id}" role="button" tabindex="0" aria-label="Load ${t.name}">
      <div class="tmpl-sc-emoji">${t.emoji}</div>
      <div class="tmpl-sc-name">${t.name}</div>
      <div class="tmpl-sc-items">${t.entries.length} options</div>
      <div class="tmpl-sc-preview">
        ${t.entries.slice(0,4).map(e => `<span class="tmpl-sc-tag">${e}</span>`).join('')}
        ${t.entries.length > 4 ? `<span class="tmpl-sc-tag">+${t.entries.length-4} more</span>` : ''}
      </div>
      <div class="tmpl-sc-load">
        Load & Spin
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  `).join('');

  tmplShowcase.querySelectorAll('.tmpl-showcase-card').forEach(card => {
    card.addEventListener('click', () => {
      const tmpl = TEMPLATES.find(t => t.id === card.dataset.id);
      if (tmpl) {
        loadTemplate(tmpl);
        document.getElementById('app')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─────────────────────── FAQ ACCORDION ─────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn && btn.addEventListener('click', () => {
    const isOpen = item.dataset.open === 'true';
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.dataset.open = 'false';
      i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });
    // Toggle clicked
    if (!isOpen) {
      item.dataset.open = 'true';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ─────────────────────── SCROLL REVEAL ─────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─────────────────────── URL PARAMS ─────────────────────── */
function loadFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('wheel');
    if (encoded) {
      const data = JSON.parse(decodeURIComponent(escape(atob(encoded))));
      if (Array.isArray(data.entries)) state.entries = data.entries.slice(0, 100);
      if (data.theme && COLOR_THEMES[data.theme]) state.currentTheme = data.theme;
      showToast('✓ Shared wheel loaded!');
    }
  } catch(e) {}
}

/* ─────────────────────── LOCAL STORAGE ─────────────────────── */
function saveToLocalStorage() {
  try {
    localStorage.setItem('dw_entries', JSON.stringify(state.entries));
    localStorage.setItem('dw_theme', state.currentTheme);
  } catch(e) {}
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('dw_entries');
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length > 0) state.entries = arr;
    }
    const theme = localStorage.getItem('dw_theme');
    if (theme && COLOR_THEMES[theme]) state.currentTheme = theme;
  } catch(e) {}
}

/* ─────────────────────── TOAST ─────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ─────────────────────── UTILS ─────────────────────── */
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─────────────────────── INIT ─────────────────────── */
function init() {
  // Load data
  loadFromURL();
  if (state.entries.length === state.entries.length) {} // URL loaded
  else loadFromLocalStorage();
  if (new URLSearchParams(window.location.search).get('wheel') === null) loadFromLocalStorage();

  // Draw wheels
  drawHeroDemoWheel();
  renderEntries();
  renderPanelTemplates();
  renderTemplateShowcase();
  initReveal();

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Canvas resize handling
  function resizeCanvas() {
    const wrap = document.getElementById('wheel-wrap');
    if (!wrap || !canvas) return;
    const size = Math.min(wrap.offsetWidth, 460);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    drawWheel();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
