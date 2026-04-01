import { Module } from '@nestjs/common';
import { GAME_RULES_PORT } from './domain/ports/inbound/game-rules.port';
import { GameRulesService } from './application/use-cases/game-rules.service';
import { CardsUtils } from './domain/services/card-utils.service';
import { RandomCards } from './domain/services/deck-shuffle.service';
import { ClassicGameService } from './domain/services/rules/classic.rules.service';
import { ElevenZeroService } from './domain/services/rules/eleven-to-zero.rules.service';
import { GameController } from './infrastructure/http/controllers/game.controller';

@Module({
  controllers: [GameController],
  providers: [
    CardsUtils,
    RandomCards,
    ClassicGameService,
    ElevenZeroService,
    { provide: GAME_RULES_PORT, useClass: GameRulesService },
  ],
})
export class GameModule {}
