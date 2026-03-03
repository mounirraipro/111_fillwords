import { CATEGORIES } from './levels.js';

// ==========================================
// SOUND ENGINE
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }
  _note(freq, type, duration, volume, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }
  click() { this._note(600, 'sine', 0.1, 0.05); }
  select() { this._note(400, 'sine', 0.1, 0.02); }
  found() { 
    this._note(523.25, 'sine', 0.15, 0.1, 0); // C5
    this._note(659.25, 'sine', 0.15, 0.1, 0.1); // E5
    this._note(783.99, 'sine', 0.3, 0.1, 0.2); // G5
  }
  error() { this._note(150, 'sawtooth', 0.2, 0.05); }
  win() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this._note(freq, 'sine', 0.4, 0.1, i * 0.15);
    });
  }
  setMute(isMuted) {
    this.enabled = !isMuted;
  }
}

// ==========================================
// CONFETTI SYSTEM
// ==========================================
class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.colors = ['#FFD700', '#0ea5e9', '#e6b800', '#0e7490', '#ffffff'];
  }
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  burst(count = 100) {
    this.resize();
    for (let i = 0; i < count; i++) {
        this.particles.push({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rv: (Math.random() - 0.5) * 10
        });
    }
    if (!this.running) {
        this.running = true;
        this._animate();
    }
  }
  _animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let active = false;
    for (let p of this.particles) {
        p.vy += 0.4; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rv;
        if (p.y < this.canvas.height) active = true;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        this.ctx.restore();
    }
    if (active) requestAnimationFrame(() => this._animate());
    else this.running = false;
  }
  stop() { this.running = false; this.particles = []; }
}

// ==========================================
// BOARD GENERATOR — Robust with diagonal bias
// Retries entire board if any word can't be placed
// ==========================================
function generateBoard(cols, rows, words) {
  // 8 directions: 4 diagonals + 4 cardinal
  const DIAGS = [[1,1],[-1,1],[1,-1],[-1,-1]];
  const CARDS = [[0,1],[1,0],[0,-1],[-1,0]];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Build a direction list with strong diagonal preference:
  // 70% chance diagonals come first
  function getDirs() {
    const d = shuffle([...DIAGS]);
    const c = shuffle([...CARDS]);
    if (Math.random() < 0.7) return [...d, ...c];
    return shuffle([...d, ...c]);
  }

  function tryGenerate() {
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(''));
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const placedWords = [];

    for (const word of sortedWords) {
      const w = word.toUpperCase();
      const placed = tryPlaceWord(grid, w, cols, rows);
      if (!placed) return null; // total failure — retry entire board
      placedWords.push({ word: w, positions: placed });
    }

    return { grid, placedWords };
  }

  function tryPlaceWord(grid, word, cols, rows) {
    // Build all possible start positions, shuffled for variety
    const starts = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        starts.push([r, c]);
    shuffle(starts);

    const directions = getDirs();

    for (const [r, c] of starts) {
      for (const [dr, dc] of directions) {
        const endR = r + dr * (word.length - 1);
        const endC = c + dc * (word.length - 1);
        // Bounds check
        if (endR < 0 || endR >= rows || endC < 0 || endC >= cols) continue;

        // Check all cells: must be empty or already have the same letter
        let valid = true;
        for (let i = 0; i < word.length; i++) {
          const cell = grid[r + dr * i][c + dc * i];
          if (cell !== '' && cell !== word[i]) { valid = false; break; }
        }
        if (!valid) continue;

        // Place the word
        const positions = [];
        for (let i = 0; i < word.length; i++) {
          grid[r + dr * i][c + dc * i] = word[i];
          positions.push({ r: r + dr * i, c: c + dc * i });
        }
        return positions;
      }
    }
    return null;
  }

  // Retry up to 50 times to get a valid board
  let result = null;
  for (let attempt = 0; attempt < 50; attempt++) {
    result = tryGenerate();
    if (result) break;
  }

  // Absolute fallback (should never happen with reasonable grid sizes)
  if (!result) {
    result = { grid: Array(rows).fill(null).map(() => Array(cols).fill('')), placedWords: [] };
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    // Force horizontal placements as last resort
    let r = 0, c = 0;
    for (const word of sortedWords) {
      const w = word.toUpperCase();
      const positions = [];
      for (let i = 0; i < w.length; i++) {
        if (c >= cols) { c = 0; r++; }
        if (r >= rows) break;
        result.grid[r][c] = w[i];
        positions.push({ r, c });
        c++;
      }
      result.placedWords.push({ word: w, positions });
    }
  }

  // Fill blanks with rare letters
  const RARE = "JQXZKVWYBFHM";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (result.grid[r][c] === '') {
        result.grid[r][c] = RARE[Math.floor(Math.random() * RARE.length)];
      }
    }
  }

  return result;
}

// ==========================================
// GAME ENGINE
// ==========================================
class GameEngine {
  constructor() {
    this.sound = new SoundEngine();
    this.confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));
    this.state = {
        level: null,
        board: null, // {grid, placedWords}
        foundWords: new Set(),
        
        // Interaction state
        isDragging: false,
        startTile: null,
        currentPath: [], // Array of {r,c}
        svgLines: [], // permanently drawn lines for found words
        
        // Progress & Tutorial
        unlockedLevels: this.loadProgress(),
        tutorialShown: localStorage.getItem('fillwords_tutorial') === 'true'
    };
    
    this.initDOM();
    this.bindEvents();
    this.renderMenu();
  }

  initDOM() {
    this.screens = {
        menu: document.getElementById('menu-screen'),
        level: document.getElementById('level-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };
    
    // Toggles
    this.soundToggles = document.querySelectorAll('.sound-toggle');
    this.volumeSliders = document.querySelectorAll('input[type="range"]');
    
    // UI elements
    this.catGrid = document.getElementById('category-grid');
    this.lvlGrid = document.getElementById('level-grid');
    
    // Game elements
    this.gridEl = document.getElementById('letter-grid');
    this.wordListEl = document.getElementById('word-list');
    this.svgOverlay = document.getElementById('swipe-overlay');
    this.tutorialEl = document.getElementById('game-tutorial');
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('fillwords_progress');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    const progress = {};
    CATEGORIES.forEach(cat => {
      progress[cat.slug] = [cat.levels[0].id];
    });
    return progress;
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('fillwords_stats');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { levelsCompleted: 0, wordsFound: 0, lastPlayedDate: null, streak: 0 };
  }

  saveStats(stats) {
    localStorage.setItem('fillwords_stats', JSON.stringify(stats));
  }

  updateStats(wordsFoundInLevel) {
    const stats = this.loadStats();
    stats.levelsCompleted = (stats.levelsCompleted || 0) + 1;
    stats.wordsFound = (stats.wordsFound || 0) + wordsFoundInLevel;
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastPlayedDate === today) {
      // already played today, streak stays
    } else if (stats.lastPlayedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      stats.streak = (stats.streak || 0) + 1;
    } else {
      stats.streak = 1;
    }
    stats.lastPlayedDate = today;
    this.saveStats(stats);
  }

  getDailyPuzzle() {
    // Seed by day: YYYYMMDD → index into all levels across all categories
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const allLevels = CATEGORIES.flatMap(cat => cat.levels.map(lvl => ({ cat, lvl })));
    const idx = seed % allLevels.length;
    return allLevels[idx];
  }

  saveProgress() {
    localStorage.setItem('fillwords_progress', JSON.stringify(this.state.unlockedLevels));
  }
  
  unlockNextLevel(currentLevel) {
    let catSlug = null;
    let nextLvlId = null;
    
    // Find category and next level
    for (const cat of CATEGORIES) {
      const idx = cat.levels.findIndex(l => l.id === currentLevel.id);
      if (idx !== -1) {
        catSlug = cat.slug;
        if (idx < cat.levels.length - 1) {
          nextLvlId = cat.levels[idx + 1].id;
        }
        break;
      }
    }
    
    if (catSlug && nextLvlId) {
      if (!this.state.unlockedLevels[catSlug]) this.state.unlockedLevels[catSlug] = [];
      if (!this.state.unlockedLevels[catSlug].includes(nextLvlId)) {
        this.state.unlockedLevels[catSlug].push(nextLvlId);
        this.saveProgress();
      }
    }
  }

  switchScreen(id) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[id].classList.add('active');
  }

  bindEvents() {
    // Nav buttons
    document.getElementById('back-to-menu').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu');
    });
    document.getElementById('back-to-levels').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('level');
    });
    
    document.getElementById('back-to-menu-win').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu');
    });
    document.getElementById('play-again').addEventListener('click', () => {
        this.sound.click(); this.loadLevel(this.state.level);
    });
    document.getElementById('next-level').addEventListener('click', () => {
        this.sound.click();
        const cat = CATEGORIES.find(c => c.levels.some(l => l.id === this.state.level.id));
        const idx = cat.levels.findIndex(l => l.id === this.state.level.id);
        if (idx < cat.levels.length - 1) {
            this.loadLevel(cat.levels[idx + 1]);
        } else {
            this.switchScreen('menu');
        }
    });

    // Sound Toggles
    this.soundToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if(e.target.tagName.toLowerCase() === 'input') return;
        this.sound.enabled = !this.sound.enabled;
        this.updateSoundToggles();
        if (this.sound.enabled) { this.sound.init(); this.sound.click(); }
      });
    });

    // Board interaction
    const boardPanel = document.getElementById('board-container');
    boardPanel.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    
    // Prevent context menu
    boardPanel.addEventListener('contextmenu', e => e.preventDefault());
  }

  updateSoundToggles() {
    this.soundToggles.forEach(btn => {
      if (this.sound.enabled) {
        btn.classList.add('active');
        const lb = btn.querySelector('span');
        if (lb) lb.innerText = "Sound On";
      } else {
        btn.classList.remove('active');
        const lb = btn.querySelector('span');
        if (lb) lb.innerText = "Sound Off";
      }
    });
  }

  // --- Rendering UI --- //
  renderMenu() {
    // Populate inline stats
    const stats = this.loadStats();
    const el = (id) => document.getElementById(id);
    if (el('stat-levels')) el('stat-levels').textContent = stats.levelsCompleted || 0;
    if (el('stat-words')) el('stat-words').textContent = stats.wordsFound || 0;
    if (el('stat-streak')) el('stat-streak').textContent = stats.streak || 0;

    // Hero play button = Puzzle of the Day
    const daily = this.getDailyPuzzle();
    if (el('potd-title')) el('potd-title').textContent = `▶  Play Today's Puzzle`;
    if (el('potd-meta')) el('potd-meta').textContent = `${daily.cat.name} · ${daily.lvl.title} · ${daily.lvl.difficulty}`;
    const potdBtn = el('potd-play-btn');
    if (potdBtn) {
      potdBtn.onclick = () => {
        this.sound.init();
        this.sound.click();
        if (!this.state.unlockedLevels[daily.cat.slug]) this.state.unlockedLevels[daily.cat.slug] = [];
        if (!this.state.unlockedLevels[daily.cat.slug].includes(daily.lvl.id)) {
          this.state.unlockedLevels[daily.cat.slug].push(daily.lvl.id);
          this.saveProgress();
        }
        this.loadLevel(daily.lvl);
      };
    }

    // Category pills
    this.catGrid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'category-card';
      pill.innerHTML = `
        <div class="cat-body">
          <span class="cat-emoji">${cat.emoji || '🔤'}</span>
          <span class="cat-name">${cat.name}</span>
        </div>
      `;
      pill.addEventListener('click', () => {
        this.sound.init();
        this.sound.click();
        this.renderLevelSelect(cat);
      });
      this.catGrid.appendChild(pill);
    });
  }

  renderLevelSelect(cat) {
    document.getElementById('level-cat-name').textContent = `${cat.emoji || ''} ${cat.name}`;
    this.lvlGrid.innerHTML = '';
    
    cat.levels.forEach((lvl, idx) => {
      const isUnlocked = this.state.unlockedLevels[cat.slug]?.includes(lvl.id);
      
      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="level-title">
          ${isUnlocked ? '' : '🔒 '}
          ${lvl.title}
        </div>
        <div class="level-meta-right">
          <span class="level-diff">${lvl.difficulty}</span>
        </div>
      `;
      
      if (isUnlocked) {
        card.addEventListener('click', () => {
          this.sound.click();
          this.loadLevel(lvl);
        });
      }
      this.lvlGrid.appendChild(card);
    });
    
    this.switchScreen('level');
  }

  // --- Game State --- //
  loadLevel(level) {
    this.state.level = level;
    this.state.foundWords.clear();
    this.state.svgLines = [];
    this.state.board = generateBoard(level.cols, level.rows, level.words);
    
    document.getElementById('game-level-title').textContent = level.title;
    
    // Setup Grid UI
    this.gridEl.style.gridTemplateColumns = `repeat(${level.cols}, 1fr)`;
    this.gridEl.innerHTML = '';
    
    for (let r=0; r<level.rows; r++) {
        for (let c=0; c<level.cols; c++) {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.dataset.r = r;
            tile.dataset.c = c;
            tile.textContent = this.state.board.grid[r][c];
            this.gridEl.appendChild(tile);
        }
    }
    
    // Setup Word List UI
    this.wordListEl.innerHTML = '';
    level.words.forEach(word => {
        const span = document.createElement('div');
        span.className = 'word-item';
        span.id = `word-${word}`;
        span.textContent = word;
        this.wordListEl.appendChild(span);
    });
    
    this.updateSVG();
    this.switchScreen('game');
    
    // GSAP Intro
    gsap.fromTo('.letter-tile', 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, stagger: 0.02, duration: 0.4, ease: 'back.out(1.5)' }
    );
    
    this.showTutorialIfNeeded();
  }

  showTutorialIfNeeded() {
    // Show tutorial only on the first level
    if (this.state.level.id !== 1 || this.state.foundWords.size > 0) return;
    
    const wordObj = this.state.board.placedWords[0];
    if (!wordObj) return;

    // We only show tutorial once
    this.tutorialEl.style.display = 'flex';
    this.tutorialEl.style.opacity = '1';
    
    // Animate hand over the first word
    const startPos = this.getTileCenter(wordObj.positions[0].r, wordObj.positions[0].c);
    const endPos = this.getTileCenter(wordObj.positions[wordObj.positions.length-1].r, wordObj.positions[wordObj.positions.length-1].c);
    
    if (startPos && endPos) {
      const hand = document.getElementById('tutorial-hand');
      
      const overlayBox = this.svgOverlay.getBoundingClientRect();
      const parentBox = this.tutorialEl.getBoundingClientRect();
      
      // We offset the finger tip slightly
      const sX = overlayBox.left + startPos.x - parentBox.left - 10;
      const sY = overlayBox.top + startPos.y - parentBox.top + 10;
      const eX = overlayBox.left + endPos.x - parentBox.left - 10;
      const eY = overlayBox.top + endPos.y - parentBox.top + 10;
      
      gsap.set(hand, { x: sX + 40, y: sY + 40, opacity: 0, scale: 0.5 });
      
      this.tutorialAnim = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
        .to(hand, { x: sX, y: sY, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
        .to(hand, { scale: 0.9, duration: 0.2 })
        .to(hand, { x: eX, y: eY, duration: 1.2, ease: 'power1.inOut' })
        .to(hand, { scale: 1, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }
  
  hideTutorial() {
    if (this.tutorialEl.style.display !== 'none') {
      if (this.tutorialAnim) this.tutorialAnim.kill();
      gsap.to(this.tutorialEl, { opacity: 0, duration: 0.3, onComplete: () => {
        this.tutorialEl.style.display = 'none';
      }});
    }
  }

  // --- Interaction --- //
  resetIdleTimer() {
    if (this._idleTimer) clearTimeout(this._idleTimer);
    if (this.state.foundWords.size === this.state.level?.words.length) return; // game over
    
    this._idleTimer = setTimeout(() => {
        this.showHint();
    }, 10000); // 10 seconds
  }

  showHint() {
    if (this.state.isDragging) return;
    
    // Find an un-found word
    const expectedWords = this.state.level.words;
    const missingWord = expectedWords.find(w => !this.state.foundWords.has(w));
    if (!missingWord) return;
    
    // Find its positions
    const wordObj = this.state.board.placedWords.find(pw => pw.word === missingWord);
    if (wordObj && wordObj.positions.length > 0) {
        // Shake the first letter
        const startPos = wordObj.positions[0];
        const el = this.getTileElement(startPos.r, startPos.c);
        if (el) {
            el.classList.add('hint-shake');
            setTimeout(() => el.classList.remove('hint-shake'), 600);
        }
    }
    this.resetIdleTimer();
  }

  getTileFromEvent(e) {
    const touch = e.touches ? e.touches[0] : e;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('letter-tile')) {
        return {
            r: parseInt(el.dataset.r),
            c: parseInt(el.dataset.c),
            el: el
        };
    }
    return null;
  }

  onPointerDown(e) {
    const tile = this.getTileFromEvent(e);
    if (!tile) return;
    
    // Prevent dragging over already found tiles
    if (tile.el.classList.contains('found')) return;

    this.resetIdleTimer();
    this.hideTutorial();

    this.sound.init(); // ensure active
    
    this.state.isDragging = true;
    this.state.startTile = tile;
    this.state.currentPath = [tile];
    this.sound.select();
    this.highlightPath();
  }

  onPointerMove(e) {
    if (!this.state.isDragging) return;
    e.preventDefault(); // prevent scrolling
    const tile = this.getTileFromEvent(e);
    if (!tile) return;
    
    // Check if tile is in straight line from start
    const sr = this.state.startTile.r;
    const sc = this.state.startTile.c;
    const cr = tile.r;
    const cc = tile.c;
    
    const dr = cr - sr;
    const dc = cc - sc;
    
    // Valid directions: horiz, vert, diagonal
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
        const len = Math.max(Math.abs(dr), Math.abs(dc));
        const stepR = len === 0 ? 0 : dr / len;
        const stepC = len === 0 ? 0 : dc / len;
        
        const newPath = [];
        let valid = true;
        for (let i = 0; i <= len; i++) {
            const tr = sr + stepR * i;
            const tc = sc + stepC * i;
            // Prevent dragging path over found tiles
            const el = this.getTileElement(tr, tc);
            if (el && el.classList.contains('found')) {
                valid = false;
                break;
            }
            newPath.push({ r: tr, c: tc });
        }
        
        // Only update if path changed and is valid
        if (valid && (newPath.length !== this.state.currentPath.length || 
            newPath[newPath.length-1].r !== this.state.currentPath[this.state.currentPath.length-1].r)) {
            this.state.currentPath = newPath;
            this.sound.select();
            this.highlightPath();
        }
    }
    this.resetIdleTimer();
  }

  onPointerUp(e) {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;
    
    const word = this.state.currentPath.map(p => this.state.board.grid[p.r][p.c]).join('');
    const reverseWord = word.split('').reverse().join('');
    
    const expectedWords = this.state.level.words;
    let found = false;
    let text = "";
    
    if (expectedWords.includes(word) && !this.state.foundWords.has(word)) { found = true; text = word; }
    else if (expectedWords.includes(reverseWord) && !this.state.foundWords.has(reverseWord)) { found = true; text = reverseWord; }
    
    if (found) {
        this.sound.found();
        this.state.foundWords.add(text);
        
        // Mark UI list
        document.getElementById(`word-${text}`).classList.add('found');
        
        // Save line in SVG
        const start = this.state.currentPath[0];
        const end = this.state.currentPath[this.state.currentPath.length-1];
        this.state.svgLines.push({ start, end });
        
        // Trigger tile animations
        this.state.currentPath.forEach(p => {
          const el = this.getTileElement(p.r, p.c);
          el.classList.add('found');
          gsap.fromTo(el, {scale: 1.2}, {scale: 1, duration: 0.3, ease: 'bounce.out'});
        });
        
        this.checkWin();
    } else {
        if(this.state.currentPath.length > 1) this.sound.error();
    }
    
    // Reset selection
    this.state.currentPath = [];
    this.highlightPath(); // clears selection
  }

  highlightPath() {
    // Reset all selection
    document.querySelectorAll('.letter-tile').forEach(el => el.classList.remove('selected'));
    
    // Highlight current
    this.state.currentPath.forEach(p => {
        const el = this.getTileElement(p.r, p.c);
        if (el) el.classList.add('selected');
    });
    
    this.updateSVG();
  }

  getTileElement(r, c) {
    return document.querySelector(`.letter-tile[data-r="${r}"][data-c="${c}"]`);
  }

  updateSVG() {
    let html = '';
    
    // Render permanently found lines
    this.state.svgLines.forEach(line => {
      const p1 = this.getTileCenter(line.start.r, line.start.c);
      const p2 = this.getTileCenter(line.end.r, line.end.c);
      if(p1 && p2) {
          html += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="found-line"></line>`;
      }
    });
    
    // Render current drag line
    if (this.state.currentPath.length > 0) {
      const start = this.state.currentPath[0];
      const end = this.state.currentPath[this.state.currentPath.length-1];
      const p1 = this.getTileCenter(start.r, start.c);
      const p2 = this.getTileCenter(end.r, end.c);
      if(p1 && p2) {
          html += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="swipe-line"></line>`;
      }
    }
    
    this.svgOverlay.innerHTML = html;
  }

  getTileCenter(r, c) {
    const el = this.getTileElement(r, c);
    if (!el) return null;
    
    // Get position relative to the svgOverlay container (board-container)
    const container = document.getElementById('board-container').getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    
    // Also account for the overlay offset (1rem = 16px) 
    // Wait, the overlay is position: absolute with top: 1rem, left: 1rem. So it exactly matches the padding of board-container!
    // That means the coordinate system of SVG starts exactly where the grid content box starts.
    return {
        x: rect.left - container.left - 16 + rect.width / 2,
        y: rect.top - container.top - 16 + rect.height / 2
    };
  }

  checkWin() {
    if (this.state.foundWords.size === this.state.level.words.length) {
        // Save stats
        this.updateStats(this.state.foundWords.size);
        // Unlock next level
        this.unlockNextLevel(this.state.level);
        if (this._idleTimer) clearTimeout(this._idleTimer);
        
        // Hide overlay lines
        this.svgOverlay.style.opacity = '0';
        
        // Make all tiles fall
        const tiles = document.querySelectorAll('.letter-tile');
        tiles.forEach((tile, i) => {
            setTimeout(() => {
                tile.classList.add('tile-fall');
            }, Math.random() * 400);
        });

        setTimeout(() => {
            this.sound.win();
            this.confetti.burst(150);
            
            document.getElementById('win-words-found').textContent = this.state.foundWords.size;
            this.switchScreen('win');
        }, 1200);
    }
  }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});

// Update SVG when resizing window
window.addEventListener('resize', () => {
   if (window.game && window.game.state.board) {
       window.game.updateSVG();
   }
});
