/* ============================================================
   Memory Scramble — App Entry Point
   Instantiates MVC components and starts the application.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const model      = new GameModel();
  const view       = new GameView();
  const controller = new GameController(model, view);

  controller.init();
});
