type DayProgress = {
  solved: boolean;
  result: any;
  attempts: any[];
  time: null | number;
};

export type LeaderboardMember = {
  name: string;
  stars: number;
};

export type Progress = {
  year: number;
  days: { part1: DayProgress; part2: DayProgress }[];
  leaderboard: {
    state: LeaderboardMember[];
    lastUpdated: number;
  };
};
