import { getPrivateLeaderboard } from "../../service/api.js";
import { Progress } from "../../service/progress/types.js";
import { stripIndents } from "common-tags";
import { logErrorMessage, logSuccessMessage } from "../../utils/log.js";

const YEAR = process.env.YEAR;
if (!YEAR) logErrorMessage("Please add `YEAR` to .env file");

const year = Number(YEAR);

const renderDayBadges = (progress: Progress) => {
  return progress.days
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, "0");

      const solvedColor = part1.solved || part2.solved ? "yellow" : "gray";
      const color =
        (part1.solved && part2.solved) || (part1.solved && day === "25")
          ? "green"
          : solvedColor;

      const badge = `![Day](https://badgen.net/badge/${day}/%E2%98%8${
        part1.solved ? 5 : 6
      }%E2%98%8${
        part2.solved || (part1.solved && day === "25") ? 5 : 6
      }/${color})`;

      return color !== "gray" ? `[${badge}](puzzles/day-${day})` : badge;
    })
    .join("\n");
};

const renderLeaderboard = async () => {
  const leaderboardItems = await getPrivateLeaderboard(year);
  const renderStarsRow = (stars: number) => {
    return [...Array(Number(stars)).fill("⭐️")].join("");
  };

  const items = leaderboardItems?.map((row) => {
    return `| ${row.name} | ${
      row.stars ? `${row.stars} ${renderStarsRow(row.stars)}` : "-"
    } |`;
  });

  return (
    "| Participant | Stars |\n" +
    "| ------------- | ------------- |\n" +
    items?.join("\n")
  );
};

const readmeMD = async (progress: Progress) => {
  const dayBadges = renderDayBadges(progress);
  const leaderboard = await renderLeaderboard();

  logSuccessMessage("README file created 🎉");

  return stripIndents`
    <!-- Entries between SOLUTIONS and RESULTS tags are auto-generated -->

    [![AoC](https://badgen.net/badge/AoC/${year}/blue)](https://adventofcode.com/${year})
    [![Node](https://badgen.net/badge/Node/v16.13.0+/blue)](https://nodejs.org/en/download/)
    ![Language](https://badgen.net/badge/Language/JavaScript/blue)
    [![Template](https://badgen.net/badge/Template/aocrunner/blue)](https://github.com/caderek/aocrunner)

    # 🎄 Advent of Code ${year} 🎄

    ## Solutions

    <!--SOLUTIONS-->

    ${dayBadges}

    <!--/SOLUTIONS-->

    _Click a badge to go to the specific day._

    ## Leaderboard 👀
    ${leaderboard}

    ---

    ## Instructions
    [🔗 Template instructions](https://github.com/z1digitalstudio/advent-of-code-template)

    **Installation**

    \`\`\`
    pnpm install 
    \`\`\`

    **Create day boilerplate**

    \`\`\`
    pnpm start <day-number>
    \`\`\`

    Example:

    \`\`\`
    pnpm start 1
    \`\`\`

   **Run dev mode**

    \`\`\`
    pnpm dev <day-number>
    \`\`\`

    Example:

    \`\`\`
    pnpm dev 1
    \`\`\`

    **Run tests**

    \`\`\`
    pnpm test
    \`\`\`

    Example:

    \`\`\`
    pnpm test
    \`\`\`

    ---

    ✨🎄🎁🎄🎅🎄🎁🎄✨

  `;
};

export { renderDayBadges };
export default readmeMD;
