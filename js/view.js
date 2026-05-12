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
}
