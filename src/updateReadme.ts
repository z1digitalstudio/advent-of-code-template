import path from "path";
import { checkAPIAvailability, sendSolution } from "./service/api.js";
import { checkFileExists } from "./utils/checkFileExists.js";
import {
  CONFIG_PATH,
  initProgress,
  readProgress,
  saveProgress,
} from "./progress/index.js";
import {
  logErrorMessage,
  logInfoMessage,
  logSuccessMessage,
} from "./service/log.js";
import { Progress } from "./progress/types.js";
import readmeMD from "./template/other/readmeMD.js";

import fs from "node:fs";

const YEAR = process.env.YEAR;

function getProgress() {
  const configCreated = checkFileExists(CONFIG_PATH);
  const yearNum = Number(YEAR);

  if (!configCreated) {
    initProgress({ year: yearNum });
    logSuccessMessage("Results JSON initialized");
  }
  return readProgress();
}

export function updateReadme(progress: Progress) {
  const readmeContent = readmeMD(progress);
  const readmePath = path.join("", "README.md");

  fs.unlinkSync(readmePath);
  fs.writeFileSync(readmePath, readmeContent);
}

updateReadme(getProgress());
