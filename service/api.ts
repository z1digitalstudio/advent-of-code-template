import fs from "node:fs";
import { logSuccessMessage } from "./log.js";
import kleur from "kleur";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.AOC_API ?? "https://adventofcode.com";

const apiRoutes = {
  getInput: (day: number, year: number) => {
    return `${API_URL}/${year}/day/${day}/input`;
  },
};

enum Status {
  SOLVED,
  WRONG,
  ERROR,
}

const handleErrors = (e: Error) => {
  if (e.message === "400" || e.message === "500") {
    console.log(
      kleur.red("INVALID SESSION KEY\n\n") +
        "Please make sure that the session key in the .env file is correct.\n" +
        "You can find your session key in the 'session' cookie at:\n" +
        "https://adventofcode.com\n\n" +
        kleur.bold("Restart the script after changing the .env file.\n")
    );
  } else if (e.message.startsWith("5")) {
    console.log(kleur.red("SERVER ERROR"));
  } else if (e.message === "404") {
    console.log(kleur.yellow("CHALLENGE NOT YET AVAILABLE"));
  } else {
    console.log(
      kleur.red(
        "UNEXPECTED ERROR\nPlease check your internet connection.\n\nIf you think it's a bug, create an issue on github.\nHere are some details to include:\n"
      )
    );
    console.log(e);
  }

  return Status["ERROR"];
};

export const getInput = async (year: number, day: number, path: string) => {
  if (fs.existsSync(path) && fs.statSync(path).size > 0) {
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
};
