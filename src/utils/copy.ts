import fs from "node:fs";

export function copy(fromDir: string, toDir: string) {
  fs.cpSync(fromDir, toDir, { recursive: true });
}
