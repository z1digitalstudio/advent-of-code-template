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

const YEAR = process.env.YEAR;

export function boilerplateDay(day: number) {
  if (YEAR === undefined) {
    logErrorMessage("Check that YEAR has been added to .env file");
    return;
  }
  const yearNum = Number(YEAR);
  const isDecember = new Date().getMonth() === 11;
  const currentYear = new Date().getFullYear();

  if (yearNum === currentYear && !isDecember) {
    logErrorMessage(
      `Year declared at .env file needs to be ${currentYear - 1} or less`
    );
    return;
  }

  const configCreated = checkFileExists(CONFIG_PATH);

  if (!configCreated) {
    initProgress({ year: yearNum });
    logSuccessMessage("Results JSON initialized");
  }

  if (day < 1 || day > 25) {
    logErrorMessage("Wrong day - chose day between 1 and 25");
    return;
  }

  const dayDirName = `puzzles/day-${String(day).padStart(2, "0")}`;
  const templateDirName = "src/template/js";
  const inputPath = path.join(dayDirName, "input.txt");
  const readmeContent = readmeDayMD(yearNum, day);
  const dailyTest = dayTest(day);

  copy(templateDirName, dayDirName);
  fs.writeFileSync(path.join(dayDirName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(dayDirName, "input.spec.js"), dailyTest);

  logSuccessMessage(`Boilerplate created at /${dayDirName}\n`);

  if (checkAPIAvailability()) {
    getInput(yearNum, day, inputPath);
  } else {
    logWarningMessage(`Input was not fetched automatically`);
  }
}
