// coger el día de los argumentos
// coger las soluciones del dia correspondiente
// submit part 1 -> dar resultado
// submit part 2 -> dar resultado

import { copy } from "./service/copy.js";
import { logErrorMessage } from "./service/log.js";
import { getInput } from "./service/api.js";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const DAY = process.argv[2];
const YEAR = process.env.YEAR;

function submit() {
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

  if (dayNum < 1 || dayNum > 25) {
    logErrorMessage("Wrong day - chose day between 1 and 25");
    return;
  }
}

function getSolutions(day: number, year: number) {}

submit();
