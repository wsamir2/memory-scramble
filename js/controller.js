
/* ============================================================
   Memory Scramble — Controller (MVC)
   Orchestrates Model & View, handles events and game loop.
   ============================================================ */

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.timerId = null;
    this.lockBoard = false;

    /* ============================================================
       Sound Effects
       ============================================================ */

    this.sounds = {
      flip: new Audio('assets/sounds/flip.mp3'),
      match: new Audio('assets/sounds/match.mp3'),
      mismatch: new Audio('assets/sounds/wrong.mp3'),
      win: new Audio('assets/sounds/win.mp3')
    };

    // Lower sound volume slightly
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }

  /* ============================================================
     Entry Point
     ============================================================ */

  init() {
    this.model.reset();
    this._stopTimer();

    this.view.removeOverlay();
    this.view.renderConfigScreen();

    this._bindConfigEvents();
  }

  /* ============================================================
     Event Binding
     ============================================================ */

  _bindConfigEvents() {
    document.getElementById('btnStart').addEventListener('click', () => {
      this._onStart();
    });

    // Start game with Enter key
    document.getElementById('configPanel').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this._onStart();
      }
    });
  }

  _bindGameEvents() {
    // Delegated card click handler
    document.getElementById('gameBoard').addEventListener('click', e => {
      const card = e.target.closest('.card');

      if (!card) return;

      this._onCardClick(parseInt(card.dataset.id, 10));
    });

    // Restart game
    document.getElementById('btnRestart').addEventListener('click', () => {
      this._restartGame();
    });

    // Quit to menu
    document.getElementById('btnQuit').addEventListener('click', () => {
      this.init();
    });
  }

  _bindModalEvents() {
    const again = document.getElementById('btnPlayAgain');
    const menu = document.getElementById('btnBackMenu');

    if (again) {
      again.addEventListener('click', () => {
        this.view.removeOverlay();
        this._restartGame();
      });
    }

    if (menu) {
      menu.addEventListener('click', () => {
        this.init();
      });
    }
  }

  /* ============================================================
     Game Handlers
     ============================================================ */

  _onStart() {
    const cfg = this.view.getConfigValues();

    const err = this.model.validateConfig(
      cfg.rows,
      cfg.cols,
      cfg.timeout
    );

    if (err) {
      this.view.showConfigError(err);
      return;
    }

    this.model.initGame(
      parseInt(cfg.rows),
      parseInt(cfg.cols),
      parseInt(cfg.timeout)
    );

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
        this._playSound('flip');
        break;

      case 'match':
        this.view.flipCard(result.cardIds[1]);

        this._playSound('match');

        setTimeout(() => {
          result.cardIds.forEach(id => {
            this.view.markMatched(id);
          });

          this._updateHud();
        }, 350);

        break;

      case 'mismatch':
        this.view.flipCard(result.cardIds[1]);

        this._playSound('mismatch');

        this.lockBoard = true;

        setTimeout(() => {
          result.cardIds.forEach(id => {
            this.view.showMismatch(id);
          });
        }, 400);

        setTimeout(() => {
          const ids = this.model.resetFlipped();

          ids.forEach(id => {
            this.view.clearMismatch(id);
            this.view.unflipCard(id);
          });

          this.lockBoard = false;

          this._updateHud();
        }, 1000);

        break;

      case 'win':
        this.view.flipCard(result.cardIds[1]);

        setTimeout(() => {
          result.cardIds.forEach(id => {
            this.view.markMatched(id);
          });

          this._updateHud();

          this._stopTimer();

          this._playSound('win');

          this.view.renderWinModal(
            this.model.moves,
            this.model.timeLeft,
            this.model.totalPairs,
            this.model.timeout
          );

          this._bindModalEvents();

        }, 500);

        break;
    }
  }

  /* ============================================================
     Timer
     ============================================================ */

  _startTimer() {
    this._stopTimer();

    this.timerId = setInterval(() => {

      const lost = this.model.tick();

      this.view.updateTimer(
        this.model.formatTime(this.model.timeLeft),
        this.model.timeLeft <= 10
      );

      if (lost) {
        this._stopTimer();

        this.view.renderLoseModal(
          this.model.moves,
          this.model.matches,
          this.model.totalPairs,
          this.model.timeout
        );

        this._bindModalEvents();
      }

    }, 1000);
  }

  _stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /* ============================================================
     Restart Helper
     ============================================================ */

  _restartGame() {
    this._stopTimer();

    const { rows, cols, timeout } = this.model;

    this.model.initGame(rows, cols, timeout);

    this.view.renderGameScreen(this.model);

    this._bindGameEvents();

    this._startTimer();
  }

  /* ============================================================
     Sound Helper
     ============================================================ */

  _playSound(type) {
    const sound = this.sounds[type];

    if (!sound) return;

    sound.currentTime = 0;

    sound.play().catch(() => {
      // Prevent autoplay browser errors
    });
  }

  /* ============================================================
     HUD Updates
     ============================================================ */

  // Refresh HUD statistics after each player action
  _updateHud() {
    this.view.updateMoves(this.model.moves);

    this.view.updateMatches(
      this.model.matches,
      this.model.totalPairs
    );
  }
}
```
