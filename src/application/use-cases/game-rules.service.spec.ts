import { Test, TestingModule } from '@nestjs/testing';
import { CardsUtils } from '../../domain/services/card-utils.service';
import { RandomCards } from '../../domain/services/deck-shuffle.service';
import { ClassicGameService } from '../../domain/services/rules/classic.rules.service';
import { ElevenZeroService } from '../../domain/services/rules/eleven-to-zero.rules.service';
import { GameRulesService } from './game-rules.service';

describe('GameRulesService', () => {
  let service: GameRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameRulesService,
        ClassicGameService,
        ElevenZeroService,
        CardsUtils,
        RandomCards,
      ],
    }).compile();

    service = module.get(GameRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startRound', () => {
    it('should return deck and firstPlayer', () => {
      const result = service.startRound();
      expect(result).toHaveProperty('deck');
      expect(result).toHaveProperty('firstPlayer');
      expect(result.deck.length).toBeGreaterThan(0);
      expect(typeof result.firstPlayer).toBe('number');
    });

    it('firstPlayer should be in range [0, 4]', () => {
      const result = service.startRound();
      expect(result.firstPlayer).toBeGreaterThanOrEqual(0);
      expect(result.firstPlayer).toBeLessThanOrEqual(4);
    });
  });

  describe('checkMaraffa', () => {
    it('should return true if all three cards are present', () => {
      const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(service.checkMaraffa(0, deck, 7, 0).maraffa).toBe(true);
    });

    it('should return false if a card is missing', () => {
      const deck = [19, 39, 33, 27, 14, 28, 37, 21, 9, 11];
      expect(service.checkMaraffa(1, deck, 7, 1).maraffa).toBe(false);
    });
  });

  describe('validateCard', () => {
    it('should allow correct suit reply', () => {
      const result = service.validateCard(
        [5],
        6,
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        false,
      );
      expect(result.valid).toBe(true);
    });

    it('should reject wrong suit when suit is available', () => {
      const result = service.validateCard(
        [5],
        22,
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 22],
        false,
      );
      expect(result.valid).toBe(false);
    });

    it('should allow trump when suit is not available', () => {
      const result = service.validateCard(
        [30],
        22,
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 22],
        true,
      );
      expect(result.valid).toBe(true);
    });

    it('should reject trump when suit is available', () => {
      const result = service.validateCard(
        [30],
        22,
        [6, 7, 8, 9, 10, 31, 12, 13, 14, 22],
        true,
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('computeScore', () => {
    it('should dispatch to classic mode', () => {
      const result = service.computeScore({
        mode: 'classic',
        trick: [6, 5, 17, 34],
        teamACards: [6, 17],
        trump: 0,
        isSuitFinished: [],
      });
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(true);
    });

    it('should throw BadRequestException for unknown mode', () => {
      expect(() =>
        service.computeScore({
          mode: 'unknown',
          trick: [6, 5, 17, 34],
          teamACards: [6, 17],
          trump: 0,
          isSuitFinished: [],
        }),
      ).toThrow();
    });
  });
});
