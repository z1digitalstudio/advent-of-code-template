import path from "node:path";
import {
  logCurrentResult,
  logErrorMessage,
  logInfoMessage,
} from "./utils/log.js";
import chokidar from "chokidar";
import { readProgress, saveProgress } from "./service/progress/index.js";

const DAY = process.argv[2];

if (!DAY) {
  logErrorMessage('Please provide a day, e.g., "pnpm dev 1"');
  process.exit(1);
}

const dayFilePath = path.join(
  "puzzles",
  `day-${DAY.padStart(2, "0")}`,
  "index.js"
);

const currentDir = path.dirname(new URL(import.meta.url).pathname);
const relativePath = path.relative(currentDir, dayFilePath);

const saveSolutions = async () => {
  try {
    const { part1, part2 } = await import(`${relativePath}?t=${Date.now()}`);

    const solutionPart1 = part1(1);
    const solutionPart2 = part2(1);

    logCurrentResult(1, solutionPart1);
    logCurrentResult(2, solutionPart2);

    const process = readProgress();
    const dayNum = Number(DAY);
    const dayData = process.days[dayNum - 1];

    if (dayData.part1.result !== solutionPart1) {
      dayData.part1.result = solutionPart1;
      saveProgress(process);
    }

    if (dayData.part2.result !== solutionPart2) {
      dayData.part2.result = solutionPart2;
      saveProgress(process);
    }
  } catch (err) {
    logErrorMessage("UNEXPECTED ERROR\n" + err);
  }
};

saveSolutions();

chokidar.watch(dayFilePath).on("change", () => {
  console.clear();

  logInfoMessage(`Watching file: ${dayFilePath}...\n\n`);
  logInfoMessage(`Restarting...\n\n`);
  saveSolutions();
});
