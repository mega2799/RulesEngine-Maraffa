import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomCards {
  fisherYatesRandomCards() {
    const numberOfCards = 40;
    const randomNumbers = [];
    for (let i = 0; i < numberOfCards; i++) {
      randomNumbers.push(i);
    }

    // Fisher-Yates shuffle
    for (let i = randomNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomNumbers[i], randomNumbers[j]] = [
        randomNumbers[j],
        randomNumbers[i],
      ];
    }

    return randomNumbers.slice(0, numberOfCards);
  }
}
