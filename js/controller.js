/* ============================================================
   Memory Scramble — Controller (MVC)
   Orchestrates Model & View, handles events and game loop.
   ============================================================ */

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view  = view;
    this.timerId = null;
    this.lockBoard = false;  // prevent clicks during mismatch animation
  }

  /** Entry point — show config screen. */
  init() {
    this.model.reset();
    this._stopTimer();
    this.view.removeOverlay();
    this.view.renderConfigScreen();
    this._bindConfigEvents();
  }

  /* ================================================================ */
  /*  Event Binding                                                    */
  /* ================================================================ */

  _bindConfigEvents() {
    document.getElementById('btnStart').addEventListener('click', () => this._onStart());
    // Allow Enter key to start
    document.getElementById('configPanel').addEventListener('keydown', e => {
      if (e.key === 'Enter') this._onStart();
    });
  }

  _bindGameEvents() {
    // Card clicks (delegated)
    document.getElementById('gameBoard').addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (card) this._onCardClick(parseInt(card.dataset.id, 10));
    });

    document.getElementById('btnRestart').addEventListener('click', () => {
      this._stopTimer();
      const { rows, cols, timeout } = this.model;
      this.model.initGame(rows, cols, timeout);
      this.view.renderGameScreen(this.model);
      this._bindGameEvents();
      this._startTimer();
    });

    document.getElementById('btnQuit').addEventListener('click', () => this.init());
  }

  _bindModalEvents() {
    const again = document.getElementById('btnPlayAgain');
    const menu  = document.getElementById('btnBackMenu');
    if (again) again.addEventListener('click', () => {
      this.view.removeOverlay();
      const { rows, cols, timeout } = this.model;
      this.model.initGame(rows, cols, timeout);
      this.view.renderGameScreen(this.model);
      this._bindGameEvents();
      this._startTimer();
    });
    if (menu) menu.addEventListener('click', () => this.init());
  }

  /* ================================================================ */
  /*  Handlers                                                         */
  /* ================================================================ */

  _onStart() {
    const cfg = this.view.getConfigValues();
    const err = this.model.validateConfig(cfg.rows, cfg.cols, cfg.timeout);
    if (err) { this.view.showConfigError(err); return; }

    this.model.initGame(parseInt(cfg.rows), parseInt(cfg.cols), parseInt(cfg.timeout));
    this.view.renderGameScreen(this.model);
    this._bindGameEvents();
    this._startTimer();
  }

  _onCardClick(cardId) {
    if (this.lockBoard) return;

    const result = this.model.flipCard(cardId);

    switch (result.action) {
      case 'flip':
        this.view.flipCard(cardId);
        break;

      case 'match':
        this.view.flipCard(result.cardIds[1]); // second card
        setTimeout(() => {
          result.cardIds.forEach(id => this.view.markMatched(id));
          this._updateHud();
        }, 350);
        break;

      case 'mismatch':
        this.view.flipCard(result.cardIds[1]);
        this.lockBoard = true;
        setTimeout(() => {
          result.cardIds.forEach(id => this.view.showMismatch(id));
        }, 400);
        setTimeout(() => {
          const ids = this.model.resetFlipped();
          ids.forEach(id => { this.view.clearMismatch(id); this.view.unflipCard(id); });
          this.lockBoard = false;
          this._updateHud();
        }, 1000);
        break;

      case 'win':
        this.view.flipCard(result.cardIds[1]);
        setTimeout(() => {
          result.cardIds.forEach(id => this.view.markMatched(id));
          this._updateHud();
          this._stopTimer();
          this.view.renderWinModal(this.model.moves, this.model.timeLeft, this.model.totalPairs, this.model.timeout);
          this._bindModalEvents();
        }, 500);
        break;
    }
  }

  /* ================================================================ */
  /*  Timer                                                            */
  /* ================================================================ */

  _startTimer() {
    this._stopTimer();
    this.timerId = setInterval(() => {
      const lost = this.model.tick();
      this.view.updateTimer(this.model.formatTime(this.model.timeLeft), this.model.timeLeft <= 10);
      if (lost) {
        this._stopTimer();
        this.view.renderLoseModal(this.model.moves, this.model.matches, this.model.totalPairs, this.model.timeout);
        this._bindModalEvents();
      }
    }, 1000);
  }

  _stopTimer() {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
  }

  /* ================================================================ */
  /*  HUD                                                              */
  /* ================================================================ */

  _updateHud() {
    this.view.updateMoves(this.model.moves);
    this.view.updateMatches(this.model.matches, this.model.totalPairs);
  }
}
