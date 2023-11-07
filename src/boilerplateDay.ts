import { copy } from "./service/copy.js";
import { logErrorMessage, logSuccessMessage } from "./service/log.js";
import { getInput } from "./service/api.js";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { initConfig, CONFIG_PATH } from "./service/config.js";

dotenv.config();

const DAY = process.argv[2];
const YEAR = process.env.YEAR;

function boilerplateDay() {
  if (DAY === undefined) {
    logErrorMessage("No day specified");
    return;
  }
  if (YEAR === undefined) {
    logErrorMessage("Check that YEAR has been added to .env file");
    return;
  }

  const dayNum = Number(DAY);
  const yearNum = Number(YEAR);
  const configCreated =
    fs.existsSync(CONFIG_PATH) && fs.statSync(CONFIG_PATH).size > 0;

  if (!configCreated) {
    initConfig();
    logSuccessMessage("Results JSON initialized");
  }

  if (dayNum < 1 || dayNum > 25) {
    logErrorMessage("Wrong day - chose day between 1 and 25");
    return;
  }

  const dayDirName = `puzzles/day-${DAY.padStart(2, "0")}`;
  const templateDirName = "src/template/js";
  const inputPath = path.join(dayDirName, "input.txt");

  copy(templateDirName, dayDirName);

  getInput(yearNum, dayNum, inputPath);
}

boilerplateDay();
