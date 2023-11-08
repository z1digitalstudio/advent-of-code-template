type DayProgress = {
  solved: boolean;
  result: any;
  attempts: any[];
  time: null | number;
};

export type Progress = {
  year: number;
  days: { part1: DayProgress; part2: DayProgress }[];
};
