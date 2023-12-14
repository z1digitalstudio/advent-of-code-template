import path from "node:path";
import fs from "node:fs";
import {
  logCurrentResult,
  logErrorMessage,
  logInfoMessage,
} from "./utils/log.js";
import chokidar from "chokidar";
import prompts from "prompts";
import { readProgress, saveProgress } from "./service/progress/index.js";
import { submit } from "./submitSolution.js";
import kleur from "kleur";

type Error = { message: string };

export function send() {
  const DAY = process.argv[3];

  const dayFilePath = path.join(
    "puzzles",
    `day-${DAY.padStart(2, "0")}`,
    "index.js"
  );

  if (!DAY) {
    logErrorMessage('Please provide a day, e.g., "pnpm dev 1"');
    process.exit(1);
  }

  chokidar.watch(dayFilePath).on("add", reload).on("change", reload);
}

async function reload(dayFilePath: string) {
  console.clear();
  logInfoMessage(`Watching file: ${dayFilePath}...\n\n`);
  await saveSolutions();
  listenToInput();
}

async function saveSolutions() {
  const DAY = process.argv[3];

  const dayFilePath = path.join(
    "puzzles",
    `day-${DAY.padStart(2, "0")}`,
    "index.js"
  );

  const dayFileInputPath = path.join(
    "puzzles",
    `day-${DAY.padStart(2, "0")}`,
    "input.txt"
  );
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const relativePath = path.relative(currentDir, dayFilePath);

  try {
    const input = fs.readFileSync(dayFileInputPath, "utf8");
    const { part1, part2 } = await import(`${relativePath}?t=${Date.now()}`);

    const solutionPart1 = part1(input);
    const solutionPart2 = part2(input);

    const parseSolution = (result: unknown) => {
      if (typeof result === "undefined") return "undefined";
      return String(result);
    };

    logCurrentResult(1, parseSolution(solutionPart1));
    logCurrentResult(2, parseSolution(solutionPart2));
    console.log("\n");

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
    return true;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("no such file or directory")) {
        logErrorMessage(`MISSING DAY DIR. Try "pnpm start ${DAY}"\n` + err);
      } else {
        logErrorMessage("UNEXPECTED ERROR\n" + err);
      }
    }

    process.exit(1);
  }
}

async function listenToInput() {
  const DAY = process.argv[3];

  const dayFilePath = path.join(
    "puzzles",
    `day-${DAY.padStart(2, "0")}`,
    "index.js"
  );

  if (!DAY) {
    logErrorMessage('Please provide a day, e.g., "pnpm dev 1"');
    process.exit(1);
  }

  const { command } = await prompts({
    type: "text",
    name: "command",
    message: `${kleur.black().bgBlue("COMMANDS")}: type ${kleur
      .blue()
      .bold("s")} to submit solution, type ${kleur.blue().bold("q")} to quit`,
  });

  console.log("\n");
  switch (command.toLowerCase()) {
    case "submit":
    case "s":
      await submit(Number(DAY));
      console.log("\n");
      process.exit(1);
      break;
    case "quit":
    case "q":
      process.exit();
    default:
      console.log("Command not supported");
      break;
  }
  listenToInput();
}
