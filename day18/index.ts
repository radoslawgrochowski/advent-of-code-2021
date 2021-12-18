import fs from "node:fs/promises";

type SnailFish = [SnailFish | number, SnailFish | number];

const range = (length: number) =>
  Array.from({ length })
    .fill(0)
    .map((_, index) => index);

const reduce = (s: string): string => {
  let reduced = s;
  while (explodeNeeded(reduced) || splitNeeded(reduced)) {
    if (explodeNeeded(reduced)) {
      reduced = explode(reduced);
    } else {
      reduced = split(reduced);
    }
  }
  return reduced;
};

export const addition = (a: string, b: string) => reduce(`[${a},${b}]`);

const OPENING = "[";
const CLOSING = "]";

export const explodeNeeded = (s: string) => {
  const chars = s.split("");
  let stack = 0;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === OPENING) {
      stack++;
      if (stack === 5) {
        return true;
      }
    } else if (chars[i] === CLOSING) {
      stack--;
    }
  }
  return false;
};

export const getExplodeIndexes = (s: string): [number, number] | undefined => {
  const chars = s.split("");
  let stack = 0;
  let lastOpening = Infinity;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === OPENING) {
      stack++;
      lastOpening = i;
    } else if (chars[i] === CLOSING) {
      if (stack === 5) {
        return [lastOpening, i];
      }
      stack--;
    }
  }
  return undefined;
};

const getPairFromString = (s: string): [string, string] =>
  s.match(/\d+/g) as any;

export const addToFirstNumber = (s: string, a: number) => {
  const matched = s.match(/\d+/);
  if (!matched) {
    return s;
  }
  const newNumber = parseInt(matched[0], 10) + a;
  return (
    s.slice(0, matched!.index!) +
    newNumber +
    s.slice(matched!.index! + matched[0].length)
  );
};

export const addToLastNumber = (s: string, a: number) => {
  const [lastMatch] = Array.from(
    s.matchAll(/\d+/g),
    (x: RegExpMatchArray) => x
  ).slice(-1);
  if (!lastMatch) {
    return s;
  }
  const newNumber = parseInt(lastMatch[0], 10) + a;
  return (
    s.slice(0, lastMatch!.index!) +
    newNumber +
    s.slice(lastMatch!.index! + lastMatch[0].length)
  );
};

export const explode = (s: string): string => {
  const explodeIndexes = getExplodeIndexes(s);
  if (!explodeIndexes) {
    throw new Error("this does not explode");
  }
  const [opening, closing] = explodeIndexes;
  const [leftExploded, rightExploded] = getPairFromString(
    s.slice(opening, closing)
  );
  const before = s.slice(0, opening);
  const beforeReplaced = addToLastNumber(before, parseInt(leftExploded));
  const after = s.slice(closing + 1);
  const afterReplaced = addToFirstNumber(after, parseInt(rightExploded));
  return beforeReplaced + "0" + afterReplaced;
};

const splitNeeded = (s: string) => !!s.match(/\d{2,}/);

export const split = (s: string): string => {
  const match = s.match(/\d{2,}/);
  if (!match) {
    throw new Error("no split possible");
  }
  const big = parseInt(match[0]);
  const index = match.index!;
  const left = Math.floor(big / 2);
  const right = Math.ceil(big / 2);
  const before = s.slice(0, index);
  const after = s.slice(index + 2);
  return before + `[${left},${right}]` + after;
};

export const magnitude = (s: SnailFish): number => {
  const [left, right] = s;
  return (
    (Array.isArray(left) ? magnitude(left) : left) * 3 +
    (Array.isArray(right) ? magnitude(right) : right) * 2
  );
};

const inputsFromFile = async (filePath: string) =>
  (await fs.readFile(filePath, "utf8")).split("\n");

export const parseInputs = (inputs: string[]) =>
  inputs.reduce((previousValue, currentValue) =>
    addition(previousValue, currentValue)
  );

const partOne = async () => {
  const inputs = await inputsFromFile("./day18/input.txt");
  const reduced = parseInputs(inputs);
  const final = magnitude(JSON.parse(reduced));
  console.log({ partOne: { reduced, final } });
};

partOne();

const partTwo = async () => {
  const inputs = await inputsFromFile("./day18/input.txt");
  const additions = range(inputs.length)
    .flatMap((x) =>
      range(inputs.length).flatMap((y) => [
        [x, y],
        [y, x],
      ])
    )
    .filter(([x, y]) => x !== y)
    .map(([x, y]) => [inputs[x], inputs[y]])
    .map(([x, y]) => addition(x, y))
    .map((x) => magnitude(JSON.parse(x)));
  const max = Math.max(...additions);
  console.log({ max });
};

partTwo();
