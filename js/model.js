/* ============================================================
   Memory Scramble — Model (MVC)
   ============================================================ */
const ICON_POOL = [
  '🚀','🌈','🔥','💎','🎯','🎸','🦄','🍀',
  '🌙','⚡','🎲','🧊','🪐','🎭','🦋','🌸',
  '🍕','🎵','🏆','🦊','🐙','🌊','❄️','🎪',
  '🧬','🔮','🗝️','🛸','🌺','🍄','🐲','🎠'
];

const CardState = Object.freeze({
  FACE_DOWN: 'face_down', FACE_UP: 'face_up', MATCHED: 'matched'
});

const GamePhase = Object.freeze({
  CONFIG: 'config', PLAYING: 'playing', WON: 'won', LOST: 'lost'
});

class Card {
  constructor(id, icon) {
    this.id = id;
    this.icon = icon;
    this.state = CardState.FACE_DOWN;
  }
  faceUp()   { if (this.state === CardState.FACE_DOWN) this.state = CardState.FACE_UP; }
  faceDown() { if (this.state === CardState.FACE_UP)   this.state = CardState.FACE_DOWN; }
  match()    { this.state = CardState.MATCHED; }
  get isMatched()  { return this.state === CardState.MATCHED; }
  get isFaceUp()   { return this.state === CardState.FACE_UP; }
  get isFaceDown() { return this.state === CardState.FACE_DOWN; }
}

class GameModel {
  constructor() { this.reset(); }

  reset() {
    this.rows = 0; this.cols = 0; this.timeout = 0;
    this.timeLeft = 0; this.moves = 0; this.matches = 0;
    this.totalPairs = 0; this.cards = []; this.phase = GamePhase.CONFIG;
    this.flippedCards = [];
  }

  validateConfig(rows, cols, timeout) {
    rows = parseInt(rows); cols = parseInt(cols); timeout = parseInt(timeout);
    if (isNaN(rows) || rows < 2 || rows > 10) return 'Rows must be between 2 and 10.';
    if (isNaN(cols) || cols < 2 || cols > 10) return 'Columns must be between 2 and 10.';
    if ((rows * cols) % 2 !== 0) return 'Total cells (rows × columns) must be even.';
    if ((rows * cols) / 2 > ICON_POOL.length) return `Max unique pairs is ${ICON_POOL.length}.`;
    if (isNaN(timeout) || timeout < 10) return 'Timeout must be at least 10 seconds.';
    if (timeout > 600) return 'Timeout must be at most 600 seconds.';
    return null;
  }

  initGame(rows, cols, timeout) {
    this.rows = rows; this.cols = cols; this.timeout = timeout;
    this.timeLeft = timeout; this.moves = 0; this.matches = 0;
    this.totalPairs = (rows * cols) / 2; this.flippedCards = [];
    this.phase = GamePhase.PLAYING;
    const chosen = this._pickIcons(this.totalPairs);
    const paired = [...chosen, ...chosen];
    this._shuffle(paired);
    this.cards = paired.map((icon, idx) => new Card(idx, icon));
  }

  flipCard(cardId) {
    if (this.phase !== GamePhase.PLAYING || this.flippedCards.length >= 2) return { action: 'ignore' };
    const card = this.cards[cardId];
    if (!card || card.isMatched || card.isFaceUp) return { action: 'ignore' };
    card.faceUp(); this.flippedCards.push(card);
    if (this.flippedCards.length === 2) { this.moves++; return this._checkMatch(); }
    return { action: 'flip', cardIds: [cardId] };
  }

  _checkMatch() {
    const [a, b] = this.flippedCards;
    if (a.icon === b.icon) {
      a.match(); b.match(); this.matches++; this.flippedCards = [];
      if (this.matches === this.totalPairs) { this.phase = GamePhase.WON; return { action: 'win', cardIds: [a.id, b.id] }; }
      return { action: 'match', cardIds: [a.id, b.id] };
    }
    return { action: 'mismatch', cardIds: [a.id, b.id] };
  }

  resetFlipped() {
    this.flippedCards.forEach(c => c.faceDown());
    const ids = this.flippedCards.map(c => c.id);
    this.flippedCards = [];
    return ids;
  }

  tick() {
    if (this.phase !== GamePhase.PLAYING) return false;
    this.timeLeft = Math.max(0, this.timeLeft - 1);
    if (this.timeLeft === 0) { this.phase = GamePhase.LOST; return true; }
    return false;
  }

  _pickIcons(n) { const p = [...ICON_POOL]; this._shuffle(p); return p.slice(0, n); }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  formatTime(s) {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  }
}
