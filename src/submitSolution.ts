import { checkAPIAvailability, sendSolution } from "./service/api.js";
import { checkFileExists } from "./utils/checkFileExists.js";
import { readProgress, saveProgress } from "./service/progress/index.js";
import { logErrorMessage, logInfoMessage } from "./utils/log.js";
import { Progress } from "./service/progress/types.js";
import { updateReadme } from "./updateReadme.js";

export async function submit(day: number) {
  if (!checkAPIAvailability()) {
    logErrorMessage("Not available");
    return;
  }

  const progress = getProgress(day);

  const parts = progress.days[day - 1];

  for (const index in Object.entries(parts)) {
    const [key, part] = Object.entries(parts)[index];
    const partNum = Number(index) + 1 === 1 ? 1 : 2;

    if (!part.solved) {
      logInfoMessage(`Trying to solve ${key}...`);
      await checkSolution({
        day,
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
    dayData.solved = true;
    saveProgress(progress);
    updateReadme();
  }
}

function getProgress(day: number) {
  const dayDirName = `puzzles/day-${String(day).padStart(2, "0")}`;

  if (!checkFileExists(dayDirName)) {
    logErrorMessage(
      "Cannot submit solution\n" +
        "This puzzle has not been started yet.\n" +
        `Run \`pnpm start ${day}\`\n\n`
    );
    process.exit(1);
  }

  return readProgress();
}
