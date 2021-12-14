import fs from "node:fs/promises";

const dataFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  const [input, , ...rest] = file.split("\n");
  const dict = Object.fromEntries(rest.map((x) => x.split(" -> ")));
  return {
    input,
    dict,
  };
};

const range = (length: number) => Array.from({ length }).fill(0) as number[];

type Dict = Record<string, string>;

type Pairs = Record<string, number>;

const getPairs = (input: string): Pairs => {
  const entries = input
    .split("")
    .map((value, index, array) => [value, array[index + 1]].join(""))
    .filter((x) => x.length == 2);
  return entries.reduce<Pairs>(
    (prev, current) => ({
      ...prev,
      [current]: prev[current] ? prev[current] + 1 : 1,
    }),
    {}
  );
};

const expandPairs = (pairs: Pairs, dict: Dict) => {
  return Object.entries(pairs)
    .flatMap(([key, count]): [string, number][] => {
      const value = dict[key];
      if (!value) return [[key, count]];
      return [
        [key[0] + value, count],
        [value + key[1], count],
      ];
    })
    .reduce<Pairs>(
      (prev, [key, value]) => ({
        ...prev,
        [key]: prev[key] ? prev[key] + value : value,
      }),
      {}
    );
};

const count = (pairs: Pairs) =>
  Object.entries(pairs)
    .flatMap(([key, value]): [string, number][] =>
      key.split("").map((x) => [x, Math.floor(value / 2)])
    )
    .reduce<Record<string, number>>(
      (prev, [key, value]) => ({
        ...prev,
        [key]: prev[key] ? prev[key] + value : value,
      }),
      {}
    );

const main2 = async (path: string, steps: number) => {
  const { input, dict } = await dataFromFile(path);
  const initialPairs = getPairs(input);
  const x = range(steps).reduce(
    (result) => expandPairs(result, dict),
    initialPairs
  );
  const c = count(x);
  const encounters = Object.values(c);
  return Math.max(...encounters) - Math.min(...encounters);
};

(async () => {
  console.assert(
    (await main2("./day14/example.txt", 10)) === 1588,
    "Part One Example 0"
  );

  console.assert(
    (await main2("./day14/example.txt", 40)) === 2188189693529,
    "Part One Example 0x2"
  );

  console.log({
    partOne: await main2("./day14/input.txt", 10),
    partTwo: await main2("./day14/input.txt", 40),
  });
})();
