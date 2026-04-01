import { Injectable } from '@nestjs/common';
import { CardsUtils } from '../card-utils.service';
import { IGameRules } from './game-rules.interface';

@Injectable()
export class ClassicGameService implements IGameRules {
  constructor(private readonly utils: CardsUtils) {}

  //is trump present? yes => find the highest trump
  //no => find the suit of the first card highest card
  computeScore(trick: number[], teamACards: number[], trump: number) {
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
