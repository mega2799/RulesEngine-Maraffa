import { Test, TestingModule } from '@nestjs/testing';
import { CardsUtils } from '../card-utils.service';
import { ClassicGameService } from './classic.rules.service';

describe('ClassicGameService', () => {
  let service: ClassicGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassicGameService, CardsUtils],
    }).compile();

    service = module.get<ClassicGameService>(ClassicGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeScore', () => {
    it("should compute a score with trump present and first team's victory", () => {
      const trump = 0;
      const trick = [6, 5, 17, 34];
      const teamACards = [6, 17];
      const result = service.computeScore(trick, teamACards, trump);
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(true);
      expect(result.winningPosition).toBe(0);
    });

    it("should compute a score with trump present and second team's victory", () => {
      const trump = 0;
      const trick = [5, 6, 17, 34];
      const teamACards = [5, 17];
      const result = service.computeScore(trick, teamACards, trump);
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(false);
      expect(result.winningPosition).toBe(1);
    });

    it("should compute a score without trump and first team's victory", () => {
      const trump = 0;
      const trick = [16, 15, 17, 34];
      const teamACards = [16, 17];
      const result = service.computeScore(trick, teamACards, trump);
      expect(result.score).toBe(6);
      expect(result.firstTeam).toBe(true);
      expect(result.winningPosition).toBe(2);
    });

    it("should compute a score without trump and second team's victory", () => {
      const trump = 0;
      const trick = [15, 19, 16, 34];
      const teamACards = [15, 16];
      const result = service.computeScore(trick, teamACards, trump);
      expect(result.score).toBe(4);
      expect(result.firstTeam).toBe(false);
      expect(result.winningPosition).toBe(1);
    });
  });
});
