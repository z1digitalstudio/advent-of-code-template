import path from "path";
import { checkFileExists } from "./utils/checkFileExists.js";
import {
  CONFIG_PATH,
  initProgress,
  readProgress,
} from "./service/progress/index.js";
import { logSuccessMessage } from "./utils/log.js";
import readmeMD from "./template/other/readmeMD.js";

import fs from "node:fs";

const YEAR = process.env.YEAR;
const yearNum = Number(YEAR);

function getProgress() {
  const configCreated = checkFileExists(CONFIG_PATH);

  if (!configCreated) {
    initProgress({ year: yearNum });
    logSuccessMessage("Results JSON initialized");
  }
  return readProgress();
}

export async function updateReadme() {
  const progress = getProgress();

  const readmeContent = await readmeMD(progress);
  const readmePath = path.join("", "README.md");

  fs.unlinkSync(readmePath);
  fs.writeFileSync(readmePath, readmeContent);
}
