import { Injectable } from '@nestjs/common';
import { elevenZeroPoints } from '../../constants';
import { CardsUtils } from '../card-utils.service';
import { IGameRules } from './game-rules.interface';

@Injectable()
export class ElevenZeroService implements IGameRules {
  constructor(private readonly utils: CardsUtils) {}

  /**check if a player played a wrong suit */
  checkElevenZero(trick: number[], isSuitFinished: boolean[]) {
    const firstCardSuit = this.utils.computeSeed(trick[0]);
    const differentSuit = isSuitFinished.map(
      (suit, index) =>
        suit == false && this.utils.computeSeed(trick[index]) != firstCardSuit,
    );
    const index = differentSuit.findIndex((val) => val == true);
    const firstTeam = index % 2 == 0;
    const elevenZero = index != -1;
    return { elevenZero, firstTeam };
  }

  //is trump present? yes => find the highest trump
  //no => find the suit of the first card highest card
  //Moreover, check if the player played a wrong suit
  computeScore(
    trick: number[],
    teamACards: number[],
    trump: number,
    isSuitFinished: boolean[],
  ) {
    const result = this.checkElevenZero(trick, isSuitFinished);
    const firstTeam = result.firstTeam;
    if (result.elevenZero) {
      return { score: elevenZeroPoints, firstTeam, winningPosition: -1 };
    } else {
      const winningPosition = this.utils.isThereTrumpInTrick(trick, trump)
        ? this.utils.findHighestCardBySeed(trick, trump)
        : this.utils.findHighestCardBySeed(
            trick,
            this.utils.computeSeed(trick[0]),
          );
      const firstTeam = teamACards.includes(trick[winningPosition]);
      const score = trick
        .map((c) => this.utils.computeValue(c))
        .reduce((acc, val) => acc + val, 0);
      return { score, firstTeam, winningPosition };
    }
  }
}
