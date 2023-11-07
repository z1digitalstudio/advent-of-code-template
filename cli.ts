import { copy } from "./service/copy.js";
import { logErrorMessage } from "./service/log.js";
import { getInput } from "./service/api.js";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const DAY = process.argv[2];
const YEAR = process.env.YEAR;

function generateDay() {
  if (DAY === undefined) {
    logErrorMessage("No day specified");
  }
  if (YEAR === undefined) {
    logErrorMessage("Check that YEAR has been added to .env file");
  }

  const dayNum = Number(DAY);
  const yearNum = Number(YEAR);

  if (dayNum < 1 || dayNum > 25) {
    logErrorMessage("Wrong day - chose day between 1 and 25");
  }

  const dayDirName = `day-${DAY.padStart(2, "0")}`;
  const templateDirName = "template/js";
  const inputPath = path.join(dayDirName, "input.txt");

  copy(templateDirName, dayDirName);

  getInput(yearNum, dayNum, inputPath);
}

generateDay();
