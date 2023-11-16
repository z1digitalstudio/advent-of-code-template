import fs from "node:fs";

export function checkFileExists(path: string) {
  return fs.existsSync(path) && fs.statSync(path).size > 0;
}
