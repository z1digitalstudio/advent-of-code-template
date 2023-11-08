import path from "path";
import { sendSolution } from "./service/api.js";
import { checkFileExists } from "./service/checkFileExists.js";
import { readConfig } from "./service/config.js";
import {
  logErrorMessage,
  logInfoMessage,
  logSuccessMessage,
} from "./service/log.js";

const DAY = process.argv[2];
const config = getConfig();

async function submit() {
  if (DAY === undefined) {
    logErrorMessage("No day specified");
    return;
  }

  const dayNum = Number(DAY);

  const parts = config.days[dayNum - 1];

  Object.entries(parts).forEach(async ([partKey, part]) => {
    if (!part.solved) {
      logInfoMessage(`Trying to solve ${partKey}...`);
      await checkSolution({
        day: dayNum,
        year: config.year,
        part: 1,
        solution: part.result,
      });
    } else {
      logSuccessMessage(`${partKey} was already solved. You won a star ⭐️`);
    }
  });
}

async function checkSolution({
  day,
  year,
  part,
  solution,
}: {
  day: number;
  year: number;
  part: 1 | 2;
  solution: any;
}) {
  const config = readConfig();
  const partStr = part === 1 ? "part1" : "part2";
  const dayData = config.days[day - 1][partStr];
  const puzzleName = `Puzzle for day ${day} - part ${part}`;

  if (dayData.solved) {
    logInfoMessage(`${puzzleName} already solved!`);
    return true;
  }

  if (!dayData.result) {
    logErrorMessage(`${puzzleName} not solved yet. Skipping`);
    return false;
  }

  if (dayData.attempts.includes(solution)) {
    logErrorMessage(`You already tried this solution. Skipping.`);
    return false;
  }

  await sendSolution({ day, year, part, solution });
}

function getConfig() {
  const dayDirName = `puzzles/day-${DAY.padStart(2, "0")}`;

  if (!checkFileExists(dayDirName)) {
    logErrorMessage(
      "Cannot submit solution\n" +
        "This puzzle has not been started yet.\n" +
        `Run \`pnpm start ${DAY}\`\n\n`
    );
    throw new Error("Missing config, .aoc.config.json not created");
  }

  return readConfig();
}

submit();
