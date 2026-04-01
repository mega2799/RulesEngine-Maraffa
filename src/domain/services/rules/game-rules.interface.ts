export interface IGameRules {
  computeScore(
    trick: number[],
    teamACards: number[],
    trump: number,
    isSuitFinished?: boolean[],
  ): { score: number; firstTeam: boolean; winningPosition: number };
}
