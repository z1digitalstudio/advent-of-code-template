import { readFileSync } from "node:fs";

export const readFile = (path) => {
  return readFileSync(path, "utf-8");
};
