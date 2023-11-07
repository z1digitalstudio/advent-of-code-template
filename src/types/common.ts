type DayConfig = {
  solved: boolean;
  result: any;
  attempts: any[];
  time: null | number;
};

export type Config = {
  days: { part1: DayConfig; part2: DayConfig }[];
};
