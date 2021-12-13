import fs from "node:fs/promises";

type Fold = ["x" | "y", number];
type Cord = [number, number];
type Data = {
  folds: Fold[];
  cords: Cord[];
};

const dataFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n").reduce<Data>(
    (all, line) => {
      if (line.includes(",")) {
        return {
          ...all,
          cords: [
            ...all.cords,
            line.split(",").map((value) => parseInt(value)) as [number, number],
          ],
        };
      }
      if (line.includes("fold")) {
        const [first, second] = line.split("=");
        return {
          ...all,
          folds: [
            ...all.folds,
            [first.slice(11), parseInt(second)] as ["x" | "y", number],
          ],
        };
      }

      return all;
    },
    {
      folds: [],
      cords: [],
    }
  );
};

const range = (length: number) => Array.from({ length }).fill(0) as number[];

const addCords = (paper: number[][], cords: Cord[]) => {
  cords.forEach(([x, y]) => {
    paper[y][x] = 1;
  });
};

const print = (paper: number[][]) => {
  paper.forEach((row) => {
    const toPrint = row
      .map((value) => (value === 1 ? "\x1b[31m#\x1b[0m" : "."))
      .join("");
    console.log(toPrint);
  });
};

const merge = (a: number[][], b: number[][]) =>
  a.map((aRow, y) =>
    aRow.map((value, x) => {
      if (value) return 1;
      if (b[y]?.[x]) return 1;
      return 0;
    })
  );

const foldY = (paper: number[][], index: number) => {
  console.log("folding y", index);
  const above = paper.slice(0, index);
  const below = paper
    .slice(index + 1)
    .reverse()
    .slice(-index);
  return merge(above, below);
};

const foldX = (paper: number[][], index: number) => {
  console.log("folding x", index);
  const left = paper.map((row) => row.slice(0, index));
  const right = paper.map((row) =>
    row
      .slice(index + 1)
      .reverse()
      .slice(-index)
  );
  return merge(left, right);
};

const count = (paper: number[][]) =>
  paper
    .map((row) => row.filter(Boolean).length)
    .reduce((prev, current) => current + prev, 0);

const main = async (path: string, foldCount: number) => {
  const { cords, folds } = await dataFromFile(path);
  const maxX = Math.max(...cords.map(([x, y]) => x)) + 2;
  const maxY = Math.max(...cords.map(([x, y]) => y)) + 2;
  console.log({ maxX, maxY });
  const paper = range(maxY).map((y) => range(maxX));
  addCords(paper, cords);
  const nextPaper = folds
    .slice(0, foldCount)
    .reduce<number[][]>((prevPaper, [axis, value]) => {
      const fold = axis == "x" ? foldX : foldY;
      return fold(prevPaper, value);
    }, paper);
  print(nextPaper);
  return count(nextPaper);
};

(async () => {
  console.assert(
    (await main("./day13/example.txt", 1)) === 17,
    "Part One Example 0"
  );

  console.assert(
    (await main("./day13/example.txt", 2)) === 16,
    "Part One Example 0x2"
  );

  console.log({
    partOne: await main("./day13/input.txt", 1),
    partTwo: await main("./day13/input.txt", Infinity),
  });
})();
