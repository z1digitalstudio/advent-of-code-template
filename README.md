# Z1 Advent of code

This is an starting kit for [Advent of code](https://adventofcode.com) (AoC). It's created to provide you with the code structure and functionality so you can focus on designing your solutions for the puzzles.

It includes this features:

- Providing a template on Typescript or Javascript for daily solutions
- Allowing you to work on your solutions on the mode
- Fetching your input automatically
- Submitting your solution from the terminal
- Creating and updating automatically a nice overwiew README with your progress

## How to start

Install dependencies:

```bash
pnpm install
```

Add .env file with variables:

```bash
AOC_SESSION_KEY=
YEAR=
```

`AOC_SESSION_KEY` is required to fetch input and submit solutions from IDE. If you prefer to work manually (meaning, copying and pasting input and solutions between your IDE and the AoC web, you can leave this empty)

To get your `AOC_SESSION_KEY` go to [Advent of code](https://adventofcode.com), open your inspector console and get session cookie from the Application tab.

Javascript | Typescript

How to use

- Input can be copy and paste from website, but is generated from template

- https://github.com/caderek/aocrunner
- Revisar las normas de uso de la api
