import { copy } from "./utils/copy.js";
import {
  logErrorMessage,
  logSuccessMessage,
  logWarningMessage,
} from "./utils/log.js";
import { checkAPIAvailability, getInput } from "./service/api.js";
import path from "node:path";
import dotenv from "dotenv";
import { initProgress, CONFIG_PATH } from "./service/progress/index.js";
import { checkFileExists } from "./utils/checkFileExists.js";
import { readmeDayMD } from "./template/other/readmeDayMD.js";
import { dayTest } from "./template/other/dayTest.js";
import fs from "node:fs";

dotenv.config();

const cliArgs = process.argv;
const DAY = cliArgs[2];
const YEAR = process.env.YEAR;

const getLanguage = () => {
  const acceptedLang = ["ts", "js"];
  const LANG_ENV = process.env.LANGUAGE ?? "";
  const LANG_ARG =
    cliArgs.indexOf("--ext") > 1 ? cliArgs[cliArgs.indexOf("--ext") + 1] : "js";

  return acceptedLang.includes(LANG_ENV) ? LANG_ENV : LANG_ARG;
};

const language = getLanguage();

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
    initProgress({ year: yearNum });
    logSuccessMessage("Results JSON initialized");
  }

  if (dayNum < 1 || dayNum > 25) {
    logErrorMessage("Wrong day - chose day between 1 and 25");
    return;
  }

  const dayDirName = `puzzles/day-${DAY.padStart(2, "0")}`;
  const templateDirName = "src/template/js";
  const inputPath = path.join(dayDirName, "input.txt");
  const readmeContent = readmeDayMD(yearNum, dayNum);
  const dailyTest = dayTest(dayNum);

  copy(templateDirName, dayDirName);
  fs.writeFileSync(path.join(dayDirName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(dayDirName, "input.spec.js"), dailyTest);

  logSuccessMessage(`Boilerplate created at /${dayDirName}\n`);

  if (checkAPIAvailability()) {
    getInput(yearNum, dayNum, inputPath);
  } else {
    logWarningMessage(`Input was not fetched automatically`);
  }
}

boilerplateDay();
