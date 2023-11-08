import { sendSolution } from "./service/api.js";
import { checkFileExists } from "./service/checkFileExists.js";
import { readConfig } from "./service/config.js";
import { logErrorMessage, logInfoMessage } from "./service/log.js";

const DAY = process.argv[2];
const config = getConfig();

async function submit() {
  if (DAY === undefined) {
    logErrorMessage("No day specified");
    return;
  }

  const dayNum = Number(DAY);

  const { part1, part2 } = config.days[dayNum - 1];

  if (!part1.solved) {
    await checkSolution({
      day: dayNum,
      year: config.year,
      part: 1,
      solution: part1.result,
    });
  }
  if (!part2.solved) {
    await checkSolution({
      day: dayNum,
      year: config.year,
      part: 2,
      solution: part2.result,
    });
  }
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
  if (!checkFileExists(`puzzles/day${DAY.padStart(2, "0")}`)) {
    logErrorMessage(
      "Puzzle has not been started.\n" + `Run \`pnpm start ${DAY}\`\n\n`
    );
    throw new Error("Missing config, .aoc.config.json not created");
  }

  return readConfig();
}

submit();
