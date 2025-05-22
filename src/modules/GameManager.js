import { Deck } from './Deck.js';
import { AudioManager } from './AudioManager.js';
import { AssetLoader } from './AssetLoader.js';

export class GameManager {
  constructor(config = {}) {
    this.maxCards = config.maxCards || 10;
    this.maxRounds = config.maxRounds || 2;
    this.round = 1;
    this.playerScore = 0;
    this.aiScore = 0;
    this.turn = 0;
    this.pending = false;
    this.gameInitialized = false;

    this.cacheElements();
    this.assetLoader = new AssetLoader();
    this.audio = new AudioManager(this.assetLoader);
    this.playerDeck = null;
    this.aiDeck = null;

    this.preloadAssets();
    this.setupEventListeners();
  }

  cacheElements() {
    this.elements = {
      board: document.querySelector('.board'),
      title: document.querySelector('.container__header'),
      scoreStatus: document.querySelector('.board__score'),
      playerDeck: document.querySelector('.board__player-deck'),
      aiDeck: document.querySelector('.board__AI-deck'),
      preview: document.querySelector('.board__preview'),
      howToPlay: document.querySelector('.container__howToPlay')
    };

    const buttons = document.querySelectorAll('.board__btn');
    this.elements.startBtn = buttons[0];
    this.elements.howToBtn = buttons[1];
    this.elements.restartBtn = buttons[2];
    this.elements.backBtn = buttons[3];
  }

  preloadAssets() {
    this.assetLoader.preloadAssets(
      (progress) => {
        console.log(`Loading assets: ${progress}%`);

        const loadingElement = document.getElementById('loading-text') || this.createLoadingElement();
        if (loadingElement) {
          loadingElement.textContent = `Loading game assets: ${progress}%`;
        }
      },
      () => {
        console.log('All assets loaded successfully!');

        this.playerDeck = new Deck('player', this.maxCards);
        this.aiDeck = new Deck('ai', this.maxCards);
        this.gameInitialized = true;

        this.elements.startBtn.classList.add('ready');
        this.elements.howToBtn.classList.add('ready');

        const loadingElement = document.getElementById('loading-text');
        if (loadingElement && loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }
    );
  }

  createLoadingElement() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-text';
    loadingElement.textContent = 'Loading game assets...';
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '20px';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translateX(-50%)';
    loadingElement.style.background = 'rgba(0,0,0,0.7)';
    loadingElement.style.color = '#c7e979';
    loadingElement.style.padding = '10px 20px';
    loadingElement.style.borderRadius = '5px';
    loadingElement.style.zIndex = '1000';
    loadingElement.style.fontSize = '1.6rem';
    document.body.appendChild(loadingElement);
    return loadingElement;
  }

  setupEventListeners() {
    const { startBtn, howToBtn, restartBtn, backBtn } = this.elements;

    startBtn.addEventListener('click', () => {
      if (!this.gameInitialized) return;
      this.audio.playSound('click');

      this.elements.board.classList.remove('hidden');
      this.elements.title.textContent = 'Soccer Card Game';

      startBtn.classList.add('hidden');
      howToBtn.classList.add('hidden');

      this.startGame();
    });

    howToBtn.addEventListener('click', () => {
      if (!this.gameInitialized) return;
      this.audio.playSound('click');

      this.elements.howToPlay.classList.remove('hidden');

      startBtn.classList.add('hidden');
      howToBtn.classList.add('hidden');
      backBtn.classList.remove('hidden');
    });

    restartBtn.addEventListener('click', () => {
      this.audio.playSound('click');
      this.round = 1;
      this.playerScore = 0;
      this.aiScore = 0;

      this.elements.title.textContent = 'Soccer Card Game';
      this.elements.scoreStatus.textContent = 'Score  0 : 0';
      restartBtn.classList.add('hidden');
      this.startGame();
    });

    backBtn.addEventListener('click', () => {
      this.audio.playSound('click');
      this.elements.howToPlay.classList.add('hidden');
      startBtn.classList.remove('hidden');
      howToBtn.classList.remove('hidden');
      backBtn.classList.add('hidden');
    });
  }

  startGame() {
    const { scoreStatus, playerDeck, aiDeck, preview, title } = this.elements;
    scoreStatus.classList.remove('hidden');
    playerDeck.classList.remove('hidden');
    aiDeck.classList.remove('hidden');
    preview.classList.remove('hidden');

    title.textContent = `Round ${this.round}`;
    scoreStatus.textContent = `Score  ${this.playerScore} : ${this.aiScore}`;
    this.playerDeck = new Deck('player', this.maxCards);
    this.aiDeck = new Deck('ai', this.maxCards);

    this.turn = 0;
    this.pending = false;
    playerDeck.innerHTML = '';
    aiDeck.innerHTML = '';
    preview.innerHTML = '';

    this.playerDeck.dealCards(playerDeck, true);
    this.aiDeck.dealCards(aiDeck, false);
    this.attachPlayerCardEvents();

    this.turn = Math.floor(Math.random() * 2);
    if (this.turn === 1) {
      this.aiAttack();
    }
  }

  attachPlayerCardEvents() {
    const playerCards = this.elements.playerDeck.querySelectorAll('.card');
    playerCards.forEach(card => {
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);

      newCard.addEventListener('click', (e) => this.handlePlayerTurn(e));

      newCard.addEventListener('touchstart', () => {
        newCard.classList.add('touch-active');
      });

      newCard.addEventListener('touchend', (e) => {
        newCard.classList.remove('touch-active');
        e.preventDefault();
        this.handlePlayerTurn({
          target: newCard,
          preventDefault: () => { }
        });
      });

      newCard.addEventListener('touchcancel', () => {
        newCard.classList.remove('touch-active');
      });
    });
  }

  handlePlayerTurn(e) {
    if (this.pending) return;

    const { preview, scoreStatus } = this.elements;
    const cardElement = e.target;

    const cardData = {
      name: cardElement.getAttribute('name'),
      type: cardElement.getAttribute('data-type'),
      color: cardElement.getAttribute('data-color'),
      src: cardElement.src
    };

    this.audio.playSound('kick');

    const previewCard = this.createPreviewCard(cardData, 'board__preview-player');
    preview.appendChild(previewCard);
    cardElement.remove();

    if (this.turn === 0) {
      this.pending = true;
      setTimeout(() => this.aiDefend(), 1000);
    } else {
      const aiCard = preview.querySelector('.board__preview-AI');
      const aiCardType = aiCard.getAttribute('data-type');
      const aiCardColor = aiCard.getAttribute('data-color');
      const successfulDefense = aiCardType === 'attack' &&
        cardData.type === 'goal' &&
        aiCardColor === cardData.color;

      if (aiCardType === 'attack' && !successfulDefense) {
        this.aiScore++;
        this.audio.playSound('goal');
        scoreStatus.textContent = `Score  ${this.playerScore} : ${this.aiScore}`;
        this.showIndicator('GOAL!', 'goal-indicator', preview);
      } else if (successfulDefense) {
        this.showIndicator('SAVED!', 'defense-indicator', preview);
      }

      this.pending = true;
      this.turn = 0;
      setTimeout(() => this.clearPreview(), 3000);
    }
  }

  createPreviewCard(cardData, className) {
    const previewCard = document.createElement('img');
    previewCard.className = className;
    previewCard.src = cardData.src;
    previewCard.setAttribute('name', cardData.name);
    previewCard.setAttribute('data-type', cardData.type);
    previewCard.setAttribute('data-color', cardData.color);

    previewCard.classList.add(this.turn === 0 ? 'card-played' : 'card-animation');

    return previewCard;
  }

  showIndicator(text, className, container) {
    const indicator = document.createElement('div');
    indicator.className = className;
    indicator.textContent = text;
    container.appendChild(indicator);

    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 1500);
  }

  aiDefend() {
    const { preview, scoreStatus } = this.elements;

    const playerCard = preview.querySelector('.board__preview-player');
    const playerCardType = playerCard.getAttribute('data-type');
    const playerCardColor = playerCard.getAttribute('data-color');

    let defended = false;
    this.audio.playSound('kick');

    if (playerCardType === 'attack') {
      const defenseCard = this.aiDeck.findDefenseCard(playerCardColor);
      if (defenseCard) {
        defended = true;
        this.aiDeck.playCard(defenseCard, preview, 'board__preview-AI');
      }
    }

    if (!defended) {
      const goalCard = this.aiDeck.findAnyGoalCard();

      if (goalCard) {
        this.aiDeck.playCard(goalCard, preview, 'board__preview-AI');
      } else {
        const anyCard = this.aiDeck.getFirstCard();
        this.aiDeck.playCard(anyCard, preview, 'board__preview-AI');
      }
      if (playerCardType === 'attack') {
        this.playerScore++;
        this.audio.playSound('goal');
        scoreStatus.textContent = `Score  ${this.playerScore} : ${this.aiScore}`;
        this.showIndicator('GOAL!', 'goal-indicator', preview);
      }
    }

    this.pending = true;
    this.turn = 1;
    setTimeout(() => this.clearPreview(), 3000);
  }

  aiAttack() {
    const { preview } = this.elements;
    this.audio.playSound('kick');

    const attackCard = this.aiDeck.findAnyAttackCard();

    if (attackCard) {
      this.aiDeck.playCard(attackCard, preview, 'board__preview-AI');
    } else {
      const anyCard = this.aiDeck.getFirstCard();
      this.aiDeck.playCard(anyCard, preview, 'board__preview-AI');
    }

    this.pending = false;
  }

  clearPreview() {
    const { preview, playerDeck, aiDeck } = this.elements;

    preview.innerHTML = '';

    const roundOver = playerDeck.children.length === 0 && aiDeck.children.length === 0;

    if (roundOver) {
      this.round++;

      if (this.round > this.maxRounds) {
        this.endGame();
      } else {
        this.pending = false;
        this.startGame();
      }
    } else {
      if (this.turn === 1) {
        setTimeout(() => this.aiAttack(), 600);
      } else {
        this.pending = false;
      }
    }
  }

  endGame() {
    const { playerDeck, aiDeck, preview, title, scoreStatus, restartBtn } = this.elements;

    playerDeck.classList.add('hidden');
    aiDeck.classList.add('hidden');
    preview.classList.add('hidden');
    scoreStatus.textContent = `Final Score  ${this.playerScore} : ${this.aiScore}`;
    if (this.playerScore > this.aiScore) {
      title.textContent = 'You win! 🏆';
    } else if (this.playerScore < this.aiScore) {
      title.textContent = 'You lose! 😢';
    } else {
      title.textContent = 'It\'s a draw! 🤝';
    }

    restartBtn.classList.remove('hidden');
    this.pending = false;
  }
}
