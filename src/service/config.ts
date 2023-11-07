import fs from "node:fs";
import { Config } from "../types/common.js";

export const CONFIG_PATH = ".aoc.data.json";

const initConfig = () => {
  const config: Config = {
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

  saveConfig(config);
};

const readConfig = (): Config => {
  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
};

const saveConfig = (config: Config) => {
  const data = JSON.stringify(config, null, 2);
  fs.writeFileSync(CONFIG_PATH, data);
};

export { saveConfig, readConfig, initConfig };
