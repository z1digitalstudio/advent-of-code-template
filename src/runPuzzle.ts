import path from "node:path";
import { logErrorMessage } from "./utils/log.js";
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

const executePuzzle = async () => {
  try {
    const { part1, part2 } = await import(
      `../puzzles/day-${DAY.padStart(2, "0")}/index.js`
    );
    console.log({ part1, part2 });
  } catch (err) {
    console.log("ERROR", err);
  }
};

executePuzzle();

console.log("Watching file:", dayFilePath);

const watcher = chokidar.watch(dayFilePath);
watcher.on("change", () => {
  console.log(`Restarting...`);
  executePuzzle();
});
