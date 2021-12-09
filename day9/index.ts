import fs from "node:fs/promises";

const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n");
};

const sum = (all: number, curr: number) => all + curr;

type Terrain = number[][];
type Point = [number, number];

const getAdjacentCoors = (terrain: Terrain, point: Point): Point[] => {
  const [x, y] = point;
  const upper = y > 0 ? [x, y - 1] : undefined;
  const lower = y < terrain.length - 1 ? [x, y + 1] : undefined;
  const left = x > 0 ? [x - 1, y] : undefined;
  const right = x < terrain[y].length - 1 ? [x + 1, y] : undefined;
  return [upper, lower, left, right].filter((x) => !!x) as Point[];
};

const isLowest = (terrain: Terrain, point: Point, excluding: Point[] = []) => {
  const [x, y] = point;
  const number = terrain[y][x];
  if (number === 9) return;
  const adjacent = getAdjacentCoors(terrain, point)
    .filter(([x, y]) => !excluding.some(([ex, ey]) => ex === x && ey == y))
    .map(([x, y]) => terrain[y][x]);
  const available = [number, ...adjacent];
  const lowestAvailable = Math.min(...available);
  return number === lowestAvailable;
};

const getAllLowest = (terrain: Terrain) => {
  const lowest: Point[] = [];
  for (let y = 0; y < terrain.length; y++) {
    for (let x = 0; x < terrain[y].length; x++) {
      if (isLowest(terrain, [x, y])) {
        lowest.push([x, y]);
      }
    }
  }
  return lowest;
};

const partOne = async (path: string) => {
  const lines = await linesFromFile(path);
  const numberLines = lines.map((line) =>
    line.split("").map((char) => parseInt(char, 10))
  );
  const lowest = getAllLowest(numberLines).map(([x, y]) => numberLines[y][x]);
  const risks = lowest.map((x) => x + 1);
  return risks.reduce(sum);
};

const arePointsEqual = (pointA: Point, pointB: Point) =>
  pointA[0] === pointB[0] && pointA[1] === pointB[1];

const getBasin = (terrain: Terrain, startingPoint: Point) => {
  const basin = [startingPoint];
  const potential: Point[] = [...getAdjacentCoors(terrain, startingPoint)];
  while (potential.length) {
    const next = potential.shift()!;
    if (isLowest(terrain, next, basin)) {
      basin.push(next);
      const adjacentNotConsidered = getAdjacentCoors(terrain, next)
        .filter((p1) => !basin.some((p2) => arePointsEqual(p1, p2)))
        .filter((p1) => !potential.some((p2) => arePointsEqual(p1, p2)));
      potential.push(...adjacentNotConsidered);
    }
  }
  return basin;
};

const print = (terrain: Terrain, basin: Point[]) => {
  terrain.forEach((line, y) => {
    const valuesToPrint = line.map((value, x) =>
      basin.some((p2) => arePointsEqual([x, y], p2))
        ? "\x1b[31m" + value + "\x1b[0m"
        : `${value}`
    );
    console.log(...valuesToPrint);
  });
};

const partTwo = async (path: string) => {
  const lines = await linesFromFile(path);
  const terrain = lines.map((line) =>
    line.split("").map((char) => parseInt(char, 10))
  );
  const lowest = getAllLowest(terrain);
  const basins = lowest.map((point) => getBasin(terrain, point));
  const top3 = basins.sort((a, b) => b.length - a.length).slice(0, 3);
  const top3Lengths = top3.map((basin) => basin.length);
  print(terrain, top3.flat());
  return top3Lengths.reduce((multi, length) => multi * length, 1);
};

(async () => {
  console.assert(
    (await partOne("./day9/example.txt")) === 15,
    "Part One Example"
  );

  console.assert(
    (await partTwo("./day9/example.txt")) === 1134,
    "Part Two Example"
  );

  console.log({
    partOne: await partOne("./day9/input.txt"),
    partTwo: await partTwo("./day9/input.txt"),
  });
})();
