import fs from "node:fs/promises";

const MAX = 9;

const octopusesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file
    .split("\n")
    .map((line) => line.split("").map((char) => parseInt(char, 10)));
};

type Position = [number, number];

const getAdjacentCords = ([px, py]: Position) => {
  const diffs = [-1, 0, 1];
  const notCurrent = ([x, y]: Position) => x !== 0 || y !== 0;
  const itsOutOfRange = ([x, y]: Position) =>
    Math.min(x, y) < 0 || Math.max(x, y) > MAX;
  return diffs
    .flatMap((x) => diffs.map((y) => [x, y]) as Position[])
    .filter(notCurrent)
    .map(([x, y]) => [px + x, py + y] as Position)
    .filter((p) => !itsOutOfRange(p));
};

console.assert(
  JSON.stringify(getAdjacentCords([0, 9])) === "[[0,8],[1,8],[1,9]]"
);

const addPowerToAll = (octos: number[][]) =>
  octos.map((row) => row.map((x) => x + 1));

const flash = (octos: number[][]) => {
  let flashCount = 0;
  const flashSelected = ([x, y]: Position) => {
    flashCount++;
    octos[y][x] = 0;
    const adjacent = getAdjacentCords([x, y]);
    adjacent.forEach(([x, y]) => {
      const value = octos[y][x];
      if (value === 0 || value > 9) return;
      octos[y][x] = value + 1;
    });
  };

  while (octos.some((row) => row.some((value) => value > 9))) {
    for (let y = 0; y < octos.length; y++) {
      for (let x = 0; x < octos[y].length; x++) {
        const value = octos[y][x];
        if (value > 9) {
          flashSelected([x, y]);
        }
      }
    }
  }
  return flashCount;
};

const print = (octos: number[][]) => {
  octos.forEach((row) => {
    const toPrint = row
      .map((value) => (value === 0 ? "\x1b[31m" + value + "\x1b[0m" : value))
      .join(" ");
    console.log(toPrint);
  });
};

const partOne = async (path: string) => {
  const octopuses = await octopusesFromFile(path);
  let stepNumber = 0;
  let stepOctos: number[][] = octopuses;
  let flashCount = 0;
  while (stepNumber < 100) {
    stepOctos = addPowerToAll(stepOctos);
    stepNumber++;
    console.log(`\nStep ${stepNumber}`);
    flashCount += flash(stepOctos);
    print(stepOctos);
  }
  return flashCount;
};

const areAllValuesZero = (octos: number[][]) =>
  octos.every((rows) => rows.every((value) => value === 0));

const partTwo = async (path: string) => {
  const octopuses = await octopusesFromFile(path);
  let stepNumber = 0;
  let stepOctos: number[][] = octopuses;
  while (!areAllValuesZero(stepOctos)) {
    stepOctos = addPowerToAll(stepOctos);
    stepNumber++;
    console.log(`\nStep ${stepNumber}`);
    flash(stepOctos);
    print(stepOctos);
  }
  return stepNumber;
};

(async () => {
  console.assert(
    (await partOne("./day11/example.txt")) === 1656,
    "Part One Example"
  );

  console.assert(
    (await partTwo("./day11/example.txt")) === 195,
    "Part Two Example"
  );

  console.log({
    partOne: await partOne("./day11/input.txt"),
    partTwo: await partTwo("./day11/input.txt"),
  });
})();
