import path from "node:path";
import { spawnSync } from "node:child_process";
import chokidar from "chokidar";
import { logInfoMessage } from "./utils/log.js";

function runPuzzle(dayFilePath: string) {
  spawnSync("node", [dayFilePath], {
    stdio: "inherit",
    shell: true,
  });
}

export function dev(day: number) {
  const dayFilePath = path.join(
    "puzzles",
    `day-${String(day).padStart(2, "0")}`,
    "index.js"
  );

  chokidar
    .watch(dayFilePath)
    .on("add", () => {
      runPuzzle(dayFilePath);
    })
    .on("change", () => {
      runPuzzle(dayFilePath);
    });
}
