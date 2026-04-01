import { Injectable } from '@nestjs/common';
import { numberOfCardsPerPlayer } from '../constants';

@Injectable()
export class CardsUtils {
  findCardIdx(card: number, deck: number[]) {
    return deck.indexOf(card);
  }

  computeSeed(a: number) {
    return Math.floor(a / numberOfCardsPerPlayer);
  }

  computeValue(a: number) {
    return a % numberOfCardsPerPlayer < 4
      ? 0
      : a % numberOfCardsPerPlayer == 7
      ? 3
      : 1;
  }

  isThereTrumpInTrick(trick: number[], trump: number) {
    return trick.some((c) => this.computeSeed(c) == trump) ? true : false;
  }

  findHighestCardBySeed(trick: number[], suit: number) {
    const maxNumber: number = Math.max(
      ...trick.filter((c) => this.computeSeed(c) == suit),
    );
    return trick.indexOf(maxNumber);
  }
}
