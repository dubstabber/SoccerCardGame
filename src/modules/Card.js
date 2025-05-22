export class Card {
  constructor(id, type, color) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.name = `${type}${color}`;
  }

  createElement(showFront = true) {
    const cardElement = document.createElement('img');
    cardElement.className = 'card';
    cardElement.id = this.id;

    cardElement.setAttribute('name', this.name);
    cardElement.setAttribute('data-type', this.type);
    cardElement.setAttribute('data-color', this.color);
    cardElement.setAttribute('data-card-info', `${this.type}-${this.color}`);

    cardElement.src = this.getImagePath(showFront);

    cardElement.style.transition = 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out';

    if (this.id.startsWith('player')) {
      cardElement.addEventListener('mouseover', () => {
        cardElement.style.transform = 'translateY(-10px)';
        cardElement.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
      });

      cardElement.addEventListener('mouseout', () => {
        cardElement.style.transform = 'translateY(0)';
        cardElement.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.2)';
      });
    }

    return cardElement;
  }

  getImagePath(showFront = true) {
    if (showFront) {
      return `./img/${this.type}${this.color}.jpg`;
    }

    return './img/cardBack.jpg';
  }
}
