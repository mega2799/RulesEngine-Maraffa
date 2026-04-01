import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { numberOfCardsPerPlayer } from '../../domain/constants';
import { CardsUtils } from '../../domain/services/card-utils.service';
import { RandomCards } from '../../domain/services/deck-shuffle.service';
import { ClassicGameService } from '../../domain/services/rules/classic.rules.service';
import { ElevenZeroService } from '../../domain/services/rules/eleven-to-zero.rules.service';
import {
  ComputeScoreInput,
  IGameRulesPort,
} from '../../domain/ports/inbound/game-rules.port';

@Injectable()
export class GameRulesService implements IGameRulesPort {
  constructor(
    private readonly utils: CardsUtils,
    private readonly random: RandomCards,
    private readonly classicService: ClassicGameService,
    private readonly elevenZeroService: ElevenZeroService,
  ) {}

  startRound() {
    const deck = this.random.fisherYatesRandomCards();
    const d4Index = deck.indexOf(0); //index of 4 denari
    if (d4Index == -1) return { deck, firstPlayer: d4Index };
    return { deck, firstPlayer: Math.floor(d4Index / numberOfCardsPerPlayer) };
  }

  checkMaraffa(suit: number, deck: number[], value: number, trump: number) {
    if (trump != suit || this.utils.computeValue(value) != 3)
      return { maraffa: false };
    const idxA = this.utils.findCardIdx(suit * 10 + 7, deck);
    const idx2 = this.utils.findCardIdx(suit * 10 + 8, deck);
    const idx3 = this.utils.findCardIdx(suit * 10 + 9, deck);
    if (idxA != -1 && idx2 != -1 && idx3 != -1) return { maraffa: true };
    return { maraffa: false };
  }

  validateCard(
    trick: number[],
    card: number,
    userCards: number[],
    cardIsTrump: boolean,
  ) {
    if (trick.length == 0) return { valid: true };
    const firstCardSuit = this.utils.computeSeed(trick[0]);
    const cardSuit = this.utils.computeSeed(card);
    return {
      valid:
        firstCardSuit === cardSuit ||
        (firstCardSuit === cardSuit && cardIsTrump) ||
        !userCards
          .map((c) => this.utils.computeSeed(c))
          .includes(firstCardSuit),
    };
  }

  computeScore(input: ComputeScoreInput) {
    const { trick, trump, teamACards, mode, isSuitFinished } = input;
    switch (mode.toLowerCase()) {
      case 'classic': {
        const result = this.classicService.computeScore(
          trick,
          teamACards,
          trump,
        );
        if (result.winningPosition === -1)
          throw new HttpException('Computation of score failed', 417);
        return result;
      }
      case 'eleven2zero':
        return this.elevenZeroService.computeScore(
          trick,
          teamACards,
          trump,
          isSuitFinished,
        );
      default:
        throw new BadRequestException(`Unknown game mode: ${mode}`);
    }
  }
}
