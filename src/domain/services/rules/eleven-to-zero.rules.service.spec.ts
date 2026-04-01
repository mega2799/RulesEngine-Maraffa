import { Test, TestingModule } from '@nestjs/testing';
import { elevenZeroPoints } from '../../constants';
import { CardsUtils } from '../card-utils.service';
import { ElevenZeroService } from './eleven-to-zero.rules.service';

describe('ElevenZeroService', () => {
  let service: ElevenZeroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElevenZeroService, CardsUtils],
    }).compile();

    service = module.get<ElevenZeroService>(ElevenZeroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeScore', () => {
    it("should compute a score with trump present and first team's victory", () => {
      const trump = 0;
      const trick = [6, 5, 37, 24];
      const teamACards = [6, 37];
      const isSuitFinished = [true, true, true, true];
      const result = service.computeScore(trick, teamACards, trump, isSuitFinished);
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(true);
      expect(result.winningPosition).toBe(0);
    });

    it("should compute a score with trump present and second team's victory", () => {
      const trump = 0;
      const trick = [5, 6, 27, 24];
      const teamACards = [5, 27];
      const isSuitFinished = [false, false, true, true];
      const result = service.computeScore(trick, teamACards, trump, isSuitFinished);
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(false);
      expect(result.winningPosition).toBe(1);
    });

    it("should compute a score without trump and first team's victory", () => {
      const trump = 2;
      const trick = [6, 5, 7, 4];
      const teamACards = [6, 7];
      const isSuitFinished = [false, false, false, false];
      const result = service.computeScore(trick, teamACards, trump, isSuitFinished);
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(true);
      expect(result.winningPosition).toBe(2);
    });

    it("should compute a score without trump and second team's victory", () => {
      const trump = 2;
      const trick = [5, 9, 6, 4];
      const teamACards = [5, 6];
      const isSuitFinished = [false, false, false, false];
      const result = service.computeScore(trick, teamACards, trump, isSuitFinished);
      expect(result.score).toBe(4);
      expect(result.firstTeam).toBe(false);
      expect(result.winningPosition).toBe(1);
    });

    it('should compute eleven-to-zero: first team played the wrong suit', () => {
      const trump = 2;
      const trick = [5, 9, 36, 4];
      const teamACards = [5, 36];
      const isSuitFinished = [false, false, false, false];
      const result = service.computeScore(trick, teamACards, trump, isSuitFinished);
      expect(result.score).toBe(elevenZeroPoints);
      expect(result.firstTeam).toBe(true);
    });

    it('should compute eleven-to-zero: second team played the wrong suit', () => {
      const trump = 2;
      const trick = [5, 29, 6, 4];
      const teamACards = [5, 6];
      const isSuitFinished = [false, false, false, false];
      const result = service.computeScore(trick, teamACards, trump, isSuitFinished);
      expect(result.score).toBe(elevenZeroPoints);
      expect(result.firstTeam).toBe(false);
    });
  });
});
