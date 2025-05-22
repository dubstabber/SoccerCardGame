import { GameManager } from './modules/GameManager.js';

document.addEventListener('DOMContentLoaded', function () {
  const game = new GameManager({
    maxCards: 10,
    maxRounds: 2
  });

  window.gameInstance = game;
});
