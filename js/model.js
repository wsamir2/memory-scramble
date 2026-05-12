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
