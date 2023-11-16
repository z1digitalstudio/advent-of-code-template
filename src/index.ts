import { logErrorMessage } from "./utils/log.js";
import { send } from "./sendPuzzle.js";
import { updateReadme } from "./updateReadme.js";
import { dev } from "./runPuzzle.js";
import { boilerplateDay } from "./boilerplateDay.js";

const COMMAND = process.argv[2];
const DAY = process.argv[3];

export function cli() {
  const command = COMMAND.toLowerCase();

  if (command === "readme") {
    updateReadme();
    return;
  }

  if (!DAY) {
    logErrorMessage('Please provide a day, e.g., "pnpm dev 1"');
    process.exit(1);
  }

  const day = Number(DAY);

  switch (COMMAND.toLowerCase()) {
    case "send":
      send();
      break;
    case "dev":
      dev(day);
      break;
    case "start":
      boilerplateDay(day);
      break;
    default:
      break;
  }
}

cli();
