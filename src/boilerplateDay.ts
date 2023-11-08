import { copy } from "./service/copy.js";
import {
  logErrorMessage,
  logSuccessMessage,
  logWarningMessage,
} from "./service/log.js";
import { checkAPIAvailability, getInput } from "./service/api.js";
import path from "node:path";
import dotenv from "dotenv";
import { initConfig, CONFIG_PATH } from "./service/config.js";
import { checkFileExists } from "./service/checkFileExists.js";

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
  const configCreated = checkFileExists(CONFIG_PATH);

  if (!configCreated) {
    initConfig({ year: yearNum });
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

  logSuccessMessage(`Boilerplate created at /${dayDirName}}\n`);

  if (checkAPIAvailability()) {
    getInput(yearNum, dayNum, inputPath);
  } else {
    logWarningMessage(`Input was not fetched automatically`);
  }
}

boilerplateDay();
