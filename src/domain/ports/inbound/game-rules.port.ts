export interface ComputeScoreInput {
  trick: number[];
  trump: number;
  mode: string;
  teamACards: number[];
  isSuitFinished: boolean[];
}

export interface IGameRulesPort {
  startRound(): { deck: number[]; firstPlayer: number };
  checkMaraffa(
    suit: number,
    deck: number[],
    value: number,
    trump: number,
  ): { maraffa: boolean };

  validateCard(
    trick: number[],
    card: number,
    userCards: number[],
    cardIsTrump: boolean,
  ): { valid: boolean };

  computeScore(input: ComputeScoreInput): {
    score: number;
    firstTeam: boolean;
    winningPosition: number;
  };
}

export const GAME_RULES_PORT = Symbol('IGameRulesPort');
