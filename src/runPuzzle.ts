import path from "node:path";
import { logErrorMessage } from "./utils/log.js";
import { spawnSync } from "node:child_process";
import chokidar from "chokidar";

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

export function runPuzzle() {
  spawnSync("node", [dayFilePath], {
    stdio: "inherit",
    shell: true,
  });
}

chokidar.watch(dayFilePath).on("add", runPuzzle).on("change", runPuzzle);
runPuzzle();
