import path from "path";
import { checkAPIAvailability, sendSolution } from "./service/api.js";
import { checkFileExists } from "./utils/checkFileExists.js";
import { readProgress, saveProgress } from "./progress/index.js";
import { logErrorMessage, logInfoMessage } from "./service/log.js";
import { Progress } from "./progress/types.js";
import readmeMD from "./template/other/readmeMD.js";

import fs from "node:fs";

const DAY = process.argv[2];
const progress = getProgress();

async function submit() {
  if (!checkAPIAvailability()) {
    logErrorMessage("Not available");
    return;
  }
  if (DAY === undefined) {
    logErrorMessage("No day specified");
    return;
  }

  const dayNum = Number(DAY);

  const parts = progress.days[dayNum - 1];

  for (const index in Object.entries(parts)) {
    const [key, part] = Object.entries(parts)[index];
    const partNum = Number(index) + 1 === 1 ? 1 : 2;

    if (!part.solved) {
      logInfoMessage(`Trying to solve ${key}...`);
      await checkSolution({
        day: dayNum,
        year: progress.year,
        part: partNum,
        solution: part.result,
        progress,
      });
    } else {
      logInfoMessage(`Part ${partNum} was already solved. You won a star ⭐️`);
    }
  }
}

async function checkSolution({
  day,
  year,
  part,
  solution,
  progress,
}: {
  day: number;
  year: number;
  part: 1 | 2;
  solution: any;
  progress: Progress;
}) {
  const partStr = part === 1 ? "part1" : "part2";
  const dayData = progress.days[day - 1][partStr];
  const puzzleName = `Puzzle for day ${day} - part ${part}`;

  if (dayData.solved) {
    logInfoMessage(`${puzzleName} already solved!`);
    return;
  }

  if (!dayData.result) {
    logErrorMessage(`${puzzleName} not solved yet. Skipping`);
    return;
  }

  if (dayData.attempts.includes(solution)) {
    logErrorMessage(`You already tried this solution. Skipping.`);
    return;
  }

  const isSolved = await sendSolution({ day, year, part, solution });

  if (isSolved) {
    updateReadme(year, progress);
    dayData.solved = true;
    saveProgress(progress);
  }
}

function getProgress() {
  const dayDirName = `puzzles/day-${DAY.padStart(2, "0")}`;

  if (!checkFileExists(dayDirName)) {
    logErrorMessage(
      "Cannot submit solution\n" +
        "This puzzle has not been started yet.\n" +
        `Run \`pnpm start ${DAY}\`\n\n`
    );
    throw new Error("Missing config, .aoc.config.json not created");
  }

  return readProgress();
}

function updateReadme(year: number, progress: Progress) {
  const readmeContent = readmeMD(year, progress);
  const readmePath = path.join("", "README.md");

  fs.unlinkSync(readmePath);
  fs.writeFileSync(readmePath, readmeContent);
}

submit();
