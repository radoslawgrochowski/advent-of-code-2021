import fs from "node:fs/promises";

type Connection = [string, string];

const connectionsFromFile = async (filePath: string): Promise<Connection[]> => {
  const file = await fs.readFile(filePath, "utf8");
  return file.split("\n").map((line) => line.split("-") as [string, string]);
};

const isSmallCave = (node: string) => node.toLowerCase() === node;

type History = string[];

type IsBlocked = (node: string, index: number, history: string[]) => boolean;

const getPossibleDirections = (
  connections: Connection[],
  history: string[],
  isBlocked: IsBlocked
): History[] => {
  const current = history[history.length - 1];
  const blocked = history.filter(isBlocked);
  const nextConnections = connections
    .filter(([start]) => start === current)
    .filter(([, end]) => !blocked.includes(end));
  return nextConnections.map(([, to]) => [...history, to]);
};

const isFinished = (path: History) => path[path.length - 1] === ENDING_NODE;

const getPaths = (
  connections: Connection[],
  currentPaths: History[],
  isBlocked: IsBlocked
): History[] => {
  const histories: History[] = currentPaths
    .map((path) => {
      return isFinished(path)
        ? [path]
        : [...getPossibleDirections(connections, path, isBlocked)];
    })
    .flat();
  if (histories.every(isFinished)) {
    return histories;
  }
  return getPaths(connections, histories, isBlocked);
};

const STARTING_NODE = "start";
const ENDING_NODE = "end";

const partOne = async (path: string) => {
  const connections = await connectionsFromFile(path);
  const twoWayConnections: Connection[] = connections.flatMap(([from, to]) => [
    [from, to],
    [to, from],
  ]);
  const paths = getPaths(twoWayConnections, [[STARTING_NODE]], isSmallCave);
  return paths.length;
};

const partTwo = async (path: string) => {
  const connections = await connectionsFromFile(path);
  const twoWayConnections: Connection[] = connections.flatMap(([from, to]) => [
    [from, to],
    [to, from],
  ]);
  const isBlocked: IsBlocked = (node, _, history) => {
    if (!isSmallCave(node)) {
      return false;
    }
    if ([STARTING_NODE, ENDING_NODE].includes(node)) return true;

    const smallCaveOccurrences = history
      .filter(isSmallCave)
      .reduce<Record<string, number>>((sum, node) => {
        return {
          ...sum,
          [node]: sum[node] ? sum[node] + 1 : 1,
        };
      }, {});

    if (smallCaveOccurrences[node] < 1) return false;

    return Math.max(...Object.values(smallCaveOccurrences)) > 1;
  };
  const paths = getPaths(twoWayConnections, [[STARTING_NODE]], isBlocked);
  return paths.length;
};

(async () => {
  console.assert(
    (await partOne("./day12/example.txt")) === 10,
    "Part One Example 0"
  );

  console.assert(
    (await partOne("./day12/example1.txt")) === 19,
    "Part One Example 1"
  );

  console.assert(
    (await partOne("./day12/example2.txt")) === 226,
    "Part One Example 2"
  );

  console.assert(
    (await partTwo("./day12/example.txt")) === 36,
    "Part Two Example"
  );

  console.assert(
    (await partTwo("./day12/example1.txt")) === 103,
    "Part Two Example 1"
  );

  console.assert(
    (await partTwo("./day12/example2.txt")) === 3509,
    "Part Two Example 2"
  );

  console.log({
    partOne: await partOne("./day12/input.txt"),
    partTwo: await partTwo("./day12/input.txt"),
  });
})();
