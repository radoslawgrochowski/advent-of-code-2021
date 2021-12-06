import fs from "node:fs/promises";

const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n");
};

const range = (length: number) =>
  Array.from({ length })
    .fill(0)
    .map((_, index) => index);

const grow = (school: School) => {
  const entries = Object.entries(school).map(([key, values]) => {
    const timer = parseInt(key, 10);
    if (timer === 0) {
      return [
        [6, values],
        [8, values],
      ];
    }
    return [[timer - 1, values]];
  });
  return entries.flat().reduce(
    (previousValue, [key, count]) => ({
      ...previousValue,
      [key]: (previousValue[key] || 0) + count,
    }),
    {} as School
  );
};

type School = Record<number, number>;

const calc = async (filePath: string, noOfDays: number) => {
  const [input] = await linesFromFile(filePath);
  const schoolArray = input.split(",").map((x) => parseInt(x, 10));
  let school = Object.values(schoolArray).reduce(
    (previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: (previousValue[currentValue] || 0) + 1,
      };
    },
    {} as School
  );
  const days = range(noOfDays);
  for (const day of days) {
    school = grow(school);
    console.log(day + " / " + noOfDays);
  }
  return Object.values(school).reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
};

(async () => {
  console.assert(
    (await calc("./day6/example.txt", 18)) === 26,
    "Part One Example"
  );
  console.assert(
    (await calc("./day6/example.txt", 80)) === 5934,
    "Part One Example 2"
  );

  console.assert(
    (await calc("./day6/example.txt", 256)) === 26984457539,
    "Part Two Example"
  );

  console.log({
    partOne: await calc("./day6/input.txt", 80),
    partTwo: await calc("./day6/input.txt", 256),
  });
})();
