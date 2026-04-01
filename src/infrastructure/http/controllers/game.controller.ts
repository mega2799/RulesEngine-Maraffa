import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import {
  GAME_RULES_PORT,
  IGameRulesPort,
} from '../../../domain/ports/inbound/game-rules.port';
import { CheckMaraffaDto } from '../dto/check-maraffa.dto';
import { ComputeScoreDto } from '../dto/compute-score.dto';
import { PlayCardValidationDto } from '../dto/play-card-validation.dto';

@Controller('games')
export class GameController {
  constructor(
    @Inject(GAME_RULES_PORT) private readonly gameRules: IGameRulesPort,
  ) {}

  @ApiResponse({ status: 201, description: 'Round started' })
  @ApiResponse({ status: 417, description: 'Round failed to start' })
  @ApiOperation({ summary: 'Start a round' })
  @Get('startRound')
  startRound(@Res() res: Response) {
    const json = this.gameRules.startRound();
    if (json.firstPlayer == -1) {
      return res.status(417).send({ message: 'Round failed to start' });
    }
    return res.status(201).send(json);
  }

  @ApiResponse({ status: 201, description: 'Success' })
  @ApiOperation({ summary: 'Check if the user has Maraffa' })
  @Post('checkMaraffa')
  checkMaraffa(@Res() res: Response, @Body() body: CheckMaraffaDto) {
    const { suit, deck, trump, value } = body;
    return res
      .status(201)
      .send(this.gameRules.checkMaraffa(suit, deck, value, trump));
  }

  @ApiResponse({ status: 201, description: 'Validation' })
  @ApiOperation({ summary: 'Check if the card played by the user is valid' })
  @Post('playCard-validation')
  validatePlayedCard(
    @Res() res: Response,
    @Body() body: PlayCardValidationDto,
  ) {
    const { trick, card, userCards, cardIsTrump } = body;
    return res
      .status(201)
      .send(this.gameRules.validateCard(trick, card, userCards, cardIsTrump));
  }

  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 417, description: 'Computation of score failed' })
  @ApiOperation({ summary: 'Compute the score of the teams' })
  @Post('computeScore')
  computeScore(@Res() res: Response, @Body() body: ComputeScoreDto) {
    return res.status(201).send(this.gameRules.computeScore(body));
  }
}
