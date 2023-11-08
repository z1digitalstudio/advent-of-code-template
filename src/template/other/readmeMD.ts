import { Progress } from "../../progress/types.js";
import toFixed from "../../utils/toFixed.js";
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

const renderResults = (progress: Progress) => {
  let totalTime = 0;
  let totalStars = 0;

  const results = progress.days
    .map(({ part1, part2 }, index) => {
      const day = String(index + 1).padStart(2, "0");

      let timeBoth = 0;

      if (part1.solved) {
        totalStars++;
        totalTime += part1.time ?? 0;
        timeBoth += part1.time ?? 0;
      }
      if (part2.solved) {
        totalStars++;
        totalTime += part2.time ?? 0;
        timeBoth += part2.time ?? 0;
      }

      if (day === "25" && part1.solved) {
        totalStars++;
      }

      return stripIndents`
      \`\`\`
      Day ${day}
      Time part 1: ${
        part1.time !== null && part1.solved ? toFixed(part1.time) + "ms" : "-"
      }
      Time part 2: ${
        part2.time !== null && part2.solved ? toFixed(part2.time) + "ms" : "-"
      }
      Both parts: ${timeBoth !== 0 ? toFixed(timeBoth) + "ms" : "-"}
      \`\`\`
    `;
    })
    .join("\n\n");

  const summary = stripIndents`
    \`\`\`
    Total stars: ${totalStars}/50
    Total time: ${toFixed(totalTime)}ms
    \`\`\`
  `;

  return [results, summary].join("\n\n");
};

const readmeMD = (progress: Progress) => {
  const dayBadges = renderDayBadges(progress);
  const results = renderResults(progress);
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


    ## Send solutions

    \`\`\`
    pnpm submit <day-number>
    \`\`\`

    Example:

    \`\`\`
    pnpm start 2
    \`\`\`

    ---

    ## Results

    <!--RESULTS-->

    ${results}

    <!--/RESULTS-->

    ---

    ✨🎄🎁🎄🎅🎄🎁🎄✨
  `;
};

export { renderDayBadges, renderResults };
export default readmeMD;