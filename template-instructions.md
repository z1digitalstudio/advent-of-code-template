# Z1 Advent of code

This is an starting kit for [Advent of code](https://adventofcode.com) (AoC). It's created to provide you with the code structure and functionality so you can focus on designing your solutions for the puzzles.

It includes this features:

- Providing a template on Typescript or Javascript for daily solutions
- Allowing you to work on your solutions on the mode
- Fetching your input automatically
- Submitting your solution from the terminal
- Creating and updating automatically a nice overwiew README with your progress

## How to start

### Install dependencies:

```bash
pnpm install
```

### Add .env file with variables:

```bash
AOC_SESSION_KEY=
YEAR=
```

To get your `AOC_SESSION_KEY` go to [Advent of code](https://adventofcode.com), open your inspector console and get session cookie from the Application tab.

> Using `AOC_SESSION_KEY` is optional.
> You can leave this empty and work "manually", by simply copying and pasting input and solutions between your IDE and the AoC web.
>
> But you **will loose access to some features** like fetching input automatically, sending solutions, updating readme automatically with your progress.

### Start working on your first puzzle

```bash
pnpm start 1
```

The `pnpm start <day>` command creates a folder at the `/puzzles` directory with an starting template to solving your puzzle.

The `/puzzles` directory will be your main working directory, containing all your solutions.

You can customize this template to your liking by editing files at `/templates` directory.

// TODO Typescript template

### Send your solutions

Once you have a solution for the puzzle, you can check if is correct by running:

```bash
pnpm submit 1
```

If your solution is correct this README will be updated automatically with your progress ✨. But don't worry, you could still see instructions for use.

> This would be available _ONLY_ for users with an `AOC_SESSION_KEY`

## Join the leaderboard

You can [join](https://adventofcode.com/2022/leaderboard/private) Z1's private leaderboard:

```
3197226-79081dfb
```

Also, if you're a Z1 employee, you can register to the AoC internal event for a chance to redeem the stars you won for fantastic Z1 swag and become the ⭐️⭐️ **_Z1 Coder of the year_** ⭐️⭐️.

## Acknowledgements

This template is _heavily_ inspired on a awesome AOC runner from [@caderek](https://github.com/caderek). Check it out [here](https://github.com/caderek/aocrunner).