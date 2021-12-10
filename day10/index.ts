import fs from "node:fs/promises";

const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n");
};

const sum = (all: number, curr: number) => all + curr;

const DICTIONARY_OPENINGS: Record<string, string> = {
  "]": "[",
  ")": "(",
  ">": "<",
  "}": "{",
};

const DICTIONARY_CLOSINGS = Object.fromEntries(
  Object.entries(DICTIONARY_OPENINGS).map(([key, value]) => [value, key])
);

const getCorruptedCharacter = (line: string) => {
  const stack = [];
  const chars = line.split("");
  const openings = Object.values(DICTIONARY_OPENINGS);
  for (const char of chars) {
    if (openings.includes(char)) {
      stack.push(char);
    } else {
      const lastClosing = stack.pop();
      if (lastClosing !== DICTIONARY_OPENINGS[char]) {
        return char;
      }
    }
  }
  return undefined;
};

const POWERS_CORRUPTED: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const partOne = async (path: string) => {
  const lines = await linesFromFile(path);
  const corrupted = lines.map((x) => getCorruptedCharacter(x));
  return corrupted
    .filter((x): x is string => !!x)
    .map((x) => POWERS_CORRUPTED[x])
    .reduce(sum, 0);
};

const POWERS_INCOMPLETE: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const findRemaining = (line: string) => {
  const stack = [];
  const chars = line.split("");
  const openings = Object.values(DICTIONARY_OPENINGS);
  for (const char of chars) {
    if (openings.includes(char)) {
      stack.push(char);
    } else {
      stack.pop();
    }
  }
  return [...stack].reverse().map((x) => DICTIONARY_CLOSINGS[x]);
};

const partTwo = async (path: string) => {
  const lines = await linesFromFile(path);
  const incomplete = lines.filter((x) => !getCorruptedCharacter(x));
  const scores = incomplete
    .map((x) =>
      findRemaining(x)
        .map((closing) => POWERS_INCOMPLETE[closing])
        .reduce(
          (previousValue, currentValue) => previousValue * 5 + currentValue,
          0
        )
    )
    .sort((a, b) => b - a);
  const middleIndex = Math.floor(scores.length / 2);
  return scores[middleIndex];
};

(async () => {
  console.assert(
    (await partOne("./day10/example.txt")) === 26397,
    "Part One Example"
  );

  console.assert(
    (await partTwo("./day10/example.txt")) === 288957,
    "Part Two Example"
  );

  console.log({
    partOne: await partOne("./day10/input.txt"),
    partTwo: await partTwo("./day10/input.txt"),
  });
})();
