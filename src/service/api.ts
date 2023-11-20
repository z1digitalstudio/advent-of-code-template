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
import { readProgress, saveProgress } from "./progress/index.js";
import { LeaderboardMember } from "./progress/types.js";
import { strToNum } from "../utils/strToNum.js";
import { msToReadable } from "../utils/timeToReadable.js";

dotenv.config();

const API_URL = process.env.AOC_API ?? "https://adventofcode.com";

const apiRoutes = {
  getInput: (day: number, year: number) =>
    `${API_URL}/${year}/day/${day}/input`,
  sendSolution: (day: number, year: number) =>
    `${API_URL}/${year}/day/${day}/answer`,
  getPrivateLeaderboard: (year: number) =>
    `${API_URL}/${year}/leaderboard/private/view/3197226.json?order=stars`,
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
  const progress = readProgress();

  if (progress.blockedTime.amount) {
    const { amount, start } = progress.blockedTime;
    const remainingMs = amount - (Date.now() - start);

    if (remainingMs > 0) {
      logErrorMessage(
        "YOU WERE BLOCKED\n" +
          `You tried too many times wrong in a short amount of time. You have to wait before trying again: ${msToReadable(
            remainingMs
          )}`
      );
      return false;
    }
  }

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
        logSuccessMessage(
          `Part ${part} solved! You won a star ⭐️\n` +
            `Updating readme to register your progress...`
        );
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
        logErrorMessage("UNKNOWN RESPONSE \n");
        console.log(`${info}\n`);
      }

      const waitTime = checkForWaitTimeInResponse(info);

      if (waitTime) {
        const blockedStart = Date.now();
        const blockedAmount =
          (waitTime.d * 24 * 60 * 60 +
            waitTime.h * 60 * 60 +
            waitTime.m * 60 +
            waitTime.s) *
          1000;

        progress["blockedTime"] = {
          start: blockedStart,
          amount: blockedAmount,
        };
        saveProgress(progress);
      }

      return false;
    })
    .catch(handleErrors);
}

export async function getPrivateLeaderboard(year: number) {
  const timePeriod = 15 * 60 * 1000;
  const progress = readProgress();

  if (
    progress.leaderboard.lastUpdated !== 0 &&
    progress.leaderboard.lastUpdated - Date.now() < timePeriod
  ) {
    return progress.leaderboard.state;
  }

  const normalizeData = (members: LeaderboardMember[]): LeaderboardMember[] => {
    return Object.values(members)
      .map((row) => {
        return { stars: row.stars, name: row.name };
      })
      .sort((m1, m2) => (Number(m1.stars) > Number(m2.stars) ? -1 : 1));
  };

  return fetch(apiRoutes.getPrivateLeaderboard(year), {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(String(res.status));
      }

      return res.json();
    })
    .then((data) => {
      const leaderboardAdmin = "Frontend Team";

      const leaderboard = normalizeData(data.members).filter(
        (m) => m.name !== leaderboardAdmin
      );
      progress["leaderboard"] = { lastUpdated: Date.now(), state: leaderboard };
      saveProgress(progress);

      return leaderboard;
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
    logErrorMessage("Not found \n\n");
  } else {
    logErrorMessage(
      "UNEXPECTED ERROR\nPlease check your internet connection and retry.\n\nIf you think it's a bug, contact organizers"
    );
  }
  console.log(e);
}

function checkForWaitTimeInResponse(info: string) {
  const waitStr = info.match(
    /(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/
  );
  const waitNum = info.match(/\d+\s*(s|m|h|d)/g);
  if (waitStr !== null || waitNum !== null) {
    const waitTime: { [key: string]: number } = {
      s: 0,
      m: 0,
      h: 0,
      d: 0,
    };
    if (waitStr !== null) {
      const [_, time, unit] = waitStr;
      waitTime[unit[0]] = strToNum(time);
    } else if (waitNum !== null) {
      waitNum.forEach((x) => {
        waitTime[x.slice(-1)] = Number(x.slice(0, -1));
      });
    }

    return waitTime;
  }
  return null;
}

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
