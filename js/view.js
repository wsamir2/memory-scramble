/* ============================================================
   Memory Scramble — View (MVC)
   Handles all DOM rendering and user-facing presentation.
   ============================================================ */

class GameView {
  constructor() {
    this.app = document.getElementById('app');
  }

  /* ---- Config Screen ---- */
  renderConfigScreen() {
    this.app.innerHTML = `
      <header class="game-header">
        <h1>Memory Scramble</h1>
        <p>Find all the matching pairs before time runs out!</p>
      </header>
      <section class="config-panel" id="configPanel">
        <h2>⚙️ Game Setup</h2>
        <div class="config-row">
          <div class="config-group">
            <label for="inputRows">Rows</label>
            <input type="number" id="inputRows" min="2" max="10" value="4">
          </div>
          <div class="config-group">
            <label for="inputCols">Columns</label>
            <input type="number" id="inputCols" min="2" max="10" value="4">
          </div>
        </div>
        <div class="config-group">
          <label for="inputTimeout">Time Limit (seconds)</label>
          <input type="number" id="inputTimeout" min="10" max="600" value="120">
        </div>
        <div class="config-error" id="configError"></div>
        <button class="btn btn-primary btn-full" id="btnStart">🎮 Start Game</button>
      </section>`;
  }

  getConfigValues() {
    return {
      rows:    document.getElementById('inputRows').value,
      cols:    document.getElementById('inputCols').value,
      timeout: document.getElementById('inputTimeout').value
    };
  }

  showConfigError(msg) {
    document.getElementById('configError').textContent = msg || '';
  }

  /* ---- Game Screen ---- */
  renderGameScreen(model) {
    this.app.innerHTML = `
      <header class="game-header">
        <h1>Memory Scramble</h1>
      </header>
      <div class="game-hud" id="gameHud">
        <div class="hud-item">
          <span class="hud-label">Time Left</span>
          <span class="hud-value timer" id="hudTimer">${model.formatTime(model.timeLeft)}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Moves</span>
          <span class="hud-value" id="hudMoves">0</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Matches</span>
          <span class="hud-value" id="hudMatches">0 / ${model.totalPairs}</span>
        </div>
        <div class="hud-actions">
          <button class="btn btn-secondary" id="btnRestart">🔄 Restart</button>
          <button class="btn btn-danger" id="btnQuit">✕ Quit</button>
        </div>
      </div>
      <div class="game-board" id="gameBoard" style="grid-template-columns: repeat(${model.cols}, 90px);">
        ${model.cards.map(c => `
          <div class="card" data-id="${c.id}" id="card-${c.id}">
            <div class="card-inner">
              <div class="card-face card-back"></div>
              <div class="card-face card-front">
                <span class="card-icon">${c.icon}</span>
              </div>
            </div>
          </div>`).join('')}
      </div>`;

    // Responsive card sizing
    if (model.cols > 6) {
      const board = document.getElementById('gameBoard');
      board.style.gridTemplateColumns = `repeat(${model.cols}, 70px)`;
      document.querySelectorAll('.card').forEach(c => {
        c.style.width = '70px'; c.style.height = '88px';
      });
    }
  }

  /* ---- HUD Updates ---- */
  updateTimer(text, isDanger) {
    const el = document.getElementById('hudTimer');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('danger', isDanger);
  }

  updateMoves(n)   { const e = document.getElementById('hudMoves');   if(e) e.textContent = n; }
  updateMatches(n, t) { const e = document.getElementById('hudMatches'); if(e) e.textContent = `${n} / ${t}`; }

  /* ---- Card Visual Updates ---- */
  flipCard(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.add('flipped');
  }

  unflipCard(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.remove('flipped');
  }

  markMatched(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) { el.classList.add('matched'); el.classList.add('flipped'); }
  }

  showMismatch(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.add('mismatch');
  }

  clearMismatch(id) {
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.remove('mismatch');
  }

}
