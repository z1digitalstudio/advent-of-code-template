import kleur from "kleur";
import fs from "node:fs";
import path from "node:path";

const day = process.argv[2];

function logErrorMessage(message) {
  console.log(`${kleur.white().bgRed(" ERROR ")} ${kleur.red(message)}`);
}

function generateDay() {
  if (day === undefined) {
    logErrorMessage("No day specified");
  }

  const dayNum = Number(day);

  if (dayNum < 1 || dayNum > 25) {
    logErrorMessage("Wrong day - chose day between 1 and 25");
  }

  const dayDirName = `day-${day.padStart(2, "0")}`;
  const templateDirName = "template/js";

  copy(templateDirName, dayDirName);
}

function copy(from, to) {
  const fromFiles = fs.readdirSync(from);
  fs.mkdirSync(to);

  fromFiles.forEach((file) => {
    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);
    fs.copyFileSync(fromPath, toPath);
  });
}

generateDay();
