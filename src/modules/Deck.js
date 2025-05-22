import { Card } from './Card.js';

export class Deck {
  constructor(owner, maxCards) {
    this.owner = owner;
    this.maxCards = maxCards;
    this.cards = [];

    this.initializeCards();
  }

  initializeCards() {
    const types = ['attack', 'goal'];
    const colors = ['Black', 'Blue', 'Brown', 'Red', 'Golden'];

    for (let i = 0; i < this.maxCards; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      const type = types[typeIndex];

      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = colors[colorIndex];

      const id = `${this.owner}${i}`;

      this.cards.push(new Card(id, type, color));
    }
  }

  dealCards(deckElement, showFront = true) {
    this.cards.forEach((card) => {
      const cardElement = card.createElement(showFront);

      if (this.owner === 'player') {
        cardElement.classList.add('card__player');
      }
      deckElement.appendChild(cardElement);
    });
  }

  findDefenseCard(attackColor) {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.type === 'goal' && card.color === attackColor) {
        this.cards.splice(i, 1);

        return card;
      }
    }
    return null;
  }

  findAnyAttackCard() {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if (card.type === 'attack') {
        this.cards.splice(i, 1);
        return card;
      }
    }

    return null;
  }

  findAnyGoalCard() {
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      if (card.type === 'goal') {
        this.cards.splice(i, 1);
        return card;
      }
    }

    return null;
  }

  getFirstCard() {
    if (this.cards.length > 0) {
      return this.cards.shift();
    }

    return null;
  }

  playCard(card, previewElement, className) {
    if (!card) return;
    const cardElement = card.createElement(true);
    cardElement.classList.add(className);
    previewElement.appendChild(cardElement);

    if (this.owner === 'ai') {
      const aiDeckElement = document.querySelector('.board__AI-deck');
      if (aiDeckElement && aiDeckElement.children.length > 0) {
        const aiCardToRemove = aiDeckElement.children[0];
        if (aiCardToRemove) {
          aiCardToRemove.remove();
        }
      }
    }
  }
}
