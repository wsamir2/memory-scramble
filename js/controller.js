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
}
