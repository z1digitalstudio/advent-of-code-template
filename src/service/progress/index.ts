import fs from "node:fs";
import { Progress } from "./types.js";

export const CONFIG_PATH = ".aoc.data.json";

const initProgress = ({ year }: { year: number }) => {
  const config: Progress = {
    year,
    leaderboard: { lastUpdated: 0, state: [] },
    blockedTime: { amount: 0, start: 0 },
    days: new Array(25).fill(0).map((_, i) => ({
      part1: {
        solved: false,
        result: null,
        attempts: [],
        time: null,
      },
      part2: {
        solved: false,
        result: null,
        attempts: [],
        time: null,
      },
    })),
  };

  saveProgress(config);
};

const readProgress = (): Progress => {
  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
};

const saveProgress = (progress: Progress) => {
  const data = JSON.stringify(progress, null, 2);
  fs.writeFileSync(CONFIG_PATH, data);
};

export { saveProgress, readProgress, initProgress };
