import fs from "node:fs/promises";

const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n");
};

const sum = (all: number, curr: number) => all + curr;

// Record<Length, Digit>
const digitsByLength: Record<number, number> = {
  2: 1,
  4: 4,
  3: 7,
  7: 8,
};

const partOne = async (path: string) => {
  const lines = await linesFromFile(path);
  const easy = lines
    .map((line) => {
      const [_, second] = line.split(" | ");
      return second;
    })
    .map((second) => second.split(" "));
  const byLength = easy.map((line) =>
    line.map((string) => digitsByLength[string.length] || string)
  );

  return byLength.flat().filter((x) => typeof x === "number").length;
};

const digitByDecoded: Record<string, number> = {
  ABCEFG: 0,
  CF: 1,
  ACDEG: 2,
  ACDFG: 3,
  BCDF: 4,
  ABDFG: 5,
  ABDEFG: 6,
  ACF: 7,
  ABCDEFG: 8,
  ABCDFG: 9,
};

const decodedByDigit = Object.fromEntries(
  Object.entries(digitByDecoded).map(([key, value]) => [value, key])
);

const getDict = (line: string[]) => {
  const lineDict: Record<string, string> = {};
  line
    .filter((x) => x !== "|")
    .forEach((string) => {
      const easy = digitsByLength[string.length];
      if (easy) {
        lineDict[decodedByDigit[easy]] = string;
      }
    });

  // get A by removing 1 from 7
  const A = lineDict.ACF.split("").find((x) => !lineDict.CF.includes(x))!;

  // we can get G by using A and 4
  lineDict.ABCDFG = line.find(
    (word) =>
      word.includes(A) &&
      lineDict.BCDF.split("").every((letter) => word.includes(letter)) &&
      word.length === 6
  )!;
  const G = lineDict.ABCDFG.split("").find(
    (letter) =>
      letter !== A &&
      !lineDict.BCDF.includes(letter) &&
      !lineDict.CF.includes(letter)
  )!;

  // we can get E by using 8 - 9
  const E = lineDict.ABCDEFG.split("").find(
    (x) => !lineDict.ABCDFG.split("").includes(x)
  )!;

  // 5 is only one with E and length = 6
  lineDict.ABDFG = line.find((word) => !word.includes(E) && word.length === 6)!;

  // F is the only one that is used 9 times on the left side
  // B is the only one that is used 6 times on the left side
  const [first, second] = line.join(" ").split("|");
  const counting = first
    .replaceAll(" ", "")
    .split("")
    .reduce<Record<string, number>>(
      (counting, letter) => ({
        ...counting,
        [letter]: (counting[letter] || 0) + 1,
      }),
      {}
    );
  const F = Object.entries(counting).find(([key, value]) => value === 9)![0];
  const B = Object.entries(counting).find(([key, value]) => value === 6)![0];

  // get C from CF
  const C = lineDict.CF.split("").find((letter) => letter !== F)!;

  // D is the last one
  const D = "abcdefg"
    .split("")
    .find((letter) => ![A, B, C, E, F, G].includes(letter))!;

  return { A, B, C, D, E, F, G };
};

const decode = (line: string[]) => {
  const dict = getDict(line);
  const reverted = Object.fromEntries(
    Object.entries(dict).map(([k, v]) => [v, k])
  );
  const [, output] = line.join(" ").split(" | ");
  const outputWords = output.split(" ");
  const result = outputWords
    .map((word) =>
      word
        .split("")
        .map((letter) => reverted[letter])
        .sort()
        .join("")
    )
    .map((x) => digitByDecoded[x]);
  return result;
};

const partTwo = async (path: string) => {
  const lines = await linesFromFile(path);
  const strings = lines.map((string) => string.split(" "));
  const outputs = strings
    .map(decode)
    .map((x) => parseInt(x.join(""), 10))
    .flat();
  return outputs.reduce(sum);
};

(async () => {
  console.assert(
    (await partOne("./day8/example.txt")) === 26,
    "Part One Example"
  );

  console.assert(
    (await partTwo("./day8/example.txt")) === 61229,
    "Part Two example"
  );

  console.log({
    partOne: await partOne("./day8/input.txt"),
    partTwo: await partTwo("./day8/input.txt"),
  });
})();
