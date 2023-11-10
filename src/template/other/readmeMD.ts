import { Progress } from "../../service/progress/types.js";
import { stripIndents } from "common-tags";

const renderDayBadges = (progress: Progress) => {
  return progress.days
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, "0");

      const color =
        (part1.solved && part2.solved) || (part1.solved && day === "25")
          ? "green"
          : part1.solved || part2.solved
          ? "yellow"
          : "gray";

      const badge = `![Day](https://badgen.net/badge/${day}/%E2%98%8${
        part1.solved ? 5 : 6
      }%E2%98%8${
        part2.solved || (part1.solved && day === "25") ? 5 : 6
      }/${color})`;

      return color !== "gray" ? `[${badge}](src/day${day})` : badge;
    })
    .join("\n");
};

const readmeMD = (progress: Progress) => {
  const dayBadges = renderDayBadges(progress);
  const year = progress.year;

  return stripIndents`
    <!-- Entries between SOLUTIONS and RESULTS tags are auto-generated -->

    [![AoC](https://badgen.net/badge/AoC/${year}/blue)](https://adventofcode.com/${year})
    [![Node](https://badgen.net/badge/Node/v16.13.0+/blue)](https://nodejs.org/en/download/)
    ![Language](https://badgen.net/badge/Language/TypeScript/blue)
    ![Language](https://badgen.net/badge/Language/JavaScript/blue)
    [![Template](https://badgen.net/badge/Template/aocrunner/blue)](https://github.com/caderek/aocrunner)

    # 🎄 Advent of Code ${year} 🎄

    ## Solutions

    <!--SOLUTIONS-->

    ${dayBadges}

    <!--/SOLUTIONS-->

    _Click a badge to go to the specific day._

    ---

    ## Installation

    \`\`\`
    pnpm install 
    \`\`\`

    ## Create day boilerplate

    \`\`\`
    pnpm start <day-number>
    \`\`\`

    Example:

    \`\`\`
    pnpm start 1
    \`\`\`

    ## Run dev mode

    \`\`\`
    pnpm dev <day-number>
    \`\`\`

    Example:

    \`\`\`
    pnpm dev 1
    \`\`\`

    ## Run tests

    \`\`\`
    pnpm test
    \`\`\`

    Example:

    \`\`\`
    pnpm test
    \`\`\`

    ## Send solutions

    \`\`\`
    pnpm submit <day-number>
    \`\`\`

    Example:

    \`\`\`
    pnpm start 1
    \`\`\`

    ---

    ✨🎄🎁🎄🎅🎄🎁🎄✨

    [🔗 Template instructions](https://github.com/z1digitalstudio/advent-of-code-template)
  `;
};

export { renderDayBadges };
export default readmeMD;
