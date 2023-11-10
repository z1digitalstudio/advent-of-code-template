import path from "path";
import { checkFileExists } from "./utils/checkFileExists.js";
import {
  CONFIG_PATH,
  initProgress,
  readProgress,
} from "./service/progress/index.js";
import { logSuccessMessage } from "./utils/log.js";
import { Progress } from "./service/progress/types.js";
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

export async function updateReadme(progress: Progress) {
  const readmeContent = await readmeMD(progress);
  const readmePath = path.join("", "README.md");

  fs.unlinkSync(readmePath);
  fs.writeFileSync(readmePath, readmeContent);
}

updateReadme(getProgress());
