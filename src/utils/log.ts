import kleur from "kleur";

export function logErrorMessage(message: string) {
  console.log(`${kleur.black().bgRed(" ERROR ")} ${kleur.red(message)}`);
}

export function logInfoMessage(message: string) {
  console.log(`${kleur.black().bgWhite(" INFO ")} ${kleur.white(message)}`);
}

export function logSuccessMessage(message: string) {
  console.log(`${kleur.black().bgGreen(" SUCCESS ")} ${kleur.green(message)}`);
}

export function logWarningMessage(message: string) {
  console.log(
    `${kleur.black().bgYellow(" WARNING ")} ${kleur.yellow(message)}`
  );
}

export function logCurrentResult(part: number, message: string) {
  console.log(
    `${kleur.black().bgYellow(` ★ PART ${part} `)} ${kleur.yellow(
      `Current result: ${kleur.bold(message)}`
    )}`
  );
}
