import fs from "node:fs/promises";

const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n");
};

const range = (length: number) =>
  Array.from({ length })
    .fill(0)
    .map((_, index) => index);

const sum = (all: number, curr: number) => all + curr;

const partOne = async (path: string) => {
  const [line] = await linesFromFile(path);
  const numbers = line.split(",").map((x) => parseInt(x, 10));
  const max = Math.max(...numbers);
  const positions = range(max + 1);
  const costs = positions.map((position) => {
    const cost = numbers.map((x) => Math.abs(position - x));
    return cost.reduce(sum);
  });
  return Math.min(...costs);
};

const getPrice = (n: number) => range(n + 1).reduce(sum, 0);

const partTwo = async (path: string) => {
  const [line] = await linesFromFile(path);
  const numbers = line.split(",").map((x) => parseInt(x, 10));
  const max = Math.max(...numbers);
  const positions = range(max + 1);
  const costs = positions.map((position) => {
    const cost = numbers.map((x) => getPrice(Math.abs(position - x)));
    return cost.reduce(sum);
  });
  return Math.min(...costs);
};

(async () => {
  console.assert(
    (await partOne("./day7/example.txt")) === 37,
    "Part One Example"
  );

  console.assert(
    (await partTwo("./day7/example.txt")) === 168,
    "Part Two example"
  );

  console.log({
    partOne: await partOne("./day7/input.txt"),
    partTwo: await partTwo("./day7/input.txt"),
  });
})();
