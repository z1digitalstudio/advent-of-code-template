import fs from "node:fs";
import {
  logErrorMessage,
  logInfoMessage,
  logSuccessMessage,
  logWarningMessage,
} from "../utils/log.js";
import dotenv from "dotenv";
import { JSDOM } from "jsdom";
import { checkFileExists } from "../utils/checkFileExists.js";

dotenv.config();

const API_URL = process.env.AOC_API ?? "https://adventofcode.com";

export function checkAPIAvailability() {
  if (!process.env.AOC_SESSION_KEY) {
    logInfoMessage(
      "API FEATURES OPTED OUT\n" +
        "Session key is missing in .env file, therefore API features are not available\n" +
        "If you want to opt-in, add valur for env var AOC_SESSION_KEY \n"
    );
    return false;
  }
  return true;
}

const apiRoutes = {
  getInput: (day: number, year: number) =>
    `${API_URL}/${year}/day/${day}/input`,
  sendSolution: (day: number, year: number) =>
    `${API_URL}/${year}/day/${day}/answer`,
  getPrivateLeaderboard: (year: number) =>
    `${API_URL}/${year}/leaderboard/private/view/3197226?order=stars`,
};

export async function getInput(year: number, day: number, path: string) {
  if (checkFileExists(path)) {
    return;
  }

  fetch(apiRoutes.getInput(day, year), {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status));
      }

      return res.text();
    })
    .then((body) => {
      fs.writeFileSync(path, body.replace(/\n$/, ""));
      logSuccessMessage(`Input for day ${day} saved!`);
    })
    .catch(handleErrors);
}

export async function sendSolution({
  day,
  year,
  part,
  solution,
}: {
  day: number;
  year: number;
  part: 1 | 2;
  solution: number;
}) {
  return fetch(apiRoutes.sendSolution(day, year), {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `level=${part}&answer=${solution}`,
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status));
      }

      return res.text();
    })
    .then((body) => {
      const mainNode = new JSDOM(body).window.document.querySelector("main");
      const info =
        mainNode !== null
          ? (mainNode.textContent as string).replace(/\[.*\]/, "").trim()
          : "Can't find the main element";

      if (info.includes("That's the right answer")) {
        logSuccessMessage(`Part ${part} solved! You won a star ⭐️`);
        return true;
      } else if (info.includes("That's not the right answer")) {
        logErrorMessage(`WRONG ANSWER\n`);
        console.log(`${info}\n`);
      } else if (info.includes("You gave an answer too recently")) {
        logWarningMessage(`TOO SOON\n`);
        console.log(`${info}\n`);
      } else if (
        info.includes("You don't seem to be solving the right level")
      ) {
        logInfoMessage(`Part ${part} was already completed or locked\n`);
      } else {
        logErrorMessage("UNKNOWN RESPONSE\n");
        console.log(`${info}\n`);
      }

      return false;
    });
}

export async function getPrivateLeaderboard(year: number) {
  return fetch(apiRoutes.getPrivateLeaderboard(year), {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status));
      }

      return res.text();
    })
    .then((body) => {
      const mainNode = new JSDOM(body).window.document.querySelectorAll(
        ".privboard-row"
      );
      const nodes = [...mainNode].map((item) => item.textContent);
      nodes.shift();
      nodes.pop();
      return nodes.map((el) =>
        String(el).replace(/\*/g, "").split("  ").filter(Boolean).slice(1)
      );
    })
    .catch(handleErrors);
}

function handleErrors(e: Error) {
  if (e.message === "400" || e.message === "500") {
    logErrorMessage("INVALID SESSION KEY\n");
    logInfoMessage(
      "Please make sure that the session key in the .env file is correct.\n" +
        "You can find your session key in the 'session' cookie at: https://adventofcode.com\n\n"
    );
  } else if (e.message.startsWith("5")) {
    logErrorMessage("Server error\n\n");
  } else if (e.message === "404") {
    logErrorMessage("Challenge not found \n\n");
  } else {
    logErrorMessage(
      "UNEXPECTED ERROR\nPlease check your internet connection and retry.\n\nIf you think it's a bug, contact organizers"
    );

    console.log(e);
  }
}
