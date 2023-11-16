import { stripIndent } from "common-tags";

export const dayTest = (day: number) => {
  return stripIndent`
  import { test, describe } from "vitest";

describe(\"Day ${day}\", () => {
  describe("part 1", () => {
    test.todo("Should return expected result with example input");
  });
  describe("part 2", () => {
    test.todo("Should return expected result with example input");
  });
});

  `;
};
