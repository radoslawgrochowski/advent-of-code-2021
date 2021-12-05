import fs from "node:fs/promises";

type Map = number[][];

const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n");
};

const parseData = (lines: string[]) =>
  lines.map(
    (x) =>
      x
        .replaceAll(" -> ", ",")
        .split(",")
        .map((x) => parseInt(x, 10)) as [number, number, number, number]
  );

const createMap = (size: number): Map => {
  return Array.from({ length: size })
    .fill(0)
    .map((x) => Array.from({ length: size }).fill(0) as number[]);
};

type Data = [number, number, number, number];

const getNumbersBetween = (first: number, second: number) => {
  const [lower, higher] = [first, second].sort((x, y) => (x < y ? -1 : 1));
  const array = (
    Array.from({ length: higher - lower + 1 }).fill(lower) as number[]
  ).map((x, i) => x + i);
  if (lower === first) {
    return array;
  }
  return array.reverse();
};

const getRangeWithoutDiagonals = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  if (x1 === x2) {
    const numbers = getNumbersBetween(y1, y2);
    return numbers.map((y) => [x1, y]);
  } else if (y1 === y2) {
    const numbers = getNumbersBetween(x1, x2);
    return numbers.map((x) => [x, y1]);
  }
};

const markFields = (
  data: Data[],
  map: Map,
  getRange = getRangeWithoutDiagonals
) => {
  const fields = data
    .map(([...cords]) => getRange(...cords))
    .filter(Boolean)
    .flat() as [number, number][];
  fields.forEach(([x, y]) => {
    map[x][y] = map[x][y] + 1;
  });
};

const count = (map: Map, value = 2) =>
  map
    .flat()
    .flat()
    .reduce((sum, c) => (c >= value ? sum + 1 : sum), 0);

const partOne = async (filePath: string) => {
  const lines = await linesFromFile(filePath);
  const map = createMap(1000);
  const data = parseData(lines);
  markFields(data, map);
  return count(map);
};

const getRangeWithDiagonals = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  if (x1 !== x2 && y1 !== y2) {
    const xs = getNumbersBetween(x1, x2);
    const ys = getNumbersBetween(y1, y2);
    return xs.map((x, index) => {
      if (typeof ys[index] !== "number") throw Error("no ys");
      return [x, ys[index]];
    });
  } else {
    return getRangeWithoutDiagonals(x1, y1, x2, y2);
  }
};

const partTwo = async (filePath: string) => {
  const lines = await linesFromFile(filePath);
  const map = createMap(1000);
  const data = parseData(lines);
  markFields(data, map, getRangeWithDiagonals);
  return count(map);
};

(async () => {
  console.assert(
    (await partOne("./day5/example.txt")) === 5,
    "Part One Example"
  );
  console.assert(
    (await partTwo("./day5/example.txt")) === 12,
    "Part Two Example"
  );

  console.log({
    partOne: await partOne("./day5/input.txt"),
    partTwo: await partTwo("./day5/input.txt"),
  });
})();
