import fs from "node:fs/promises";

type Command = {
  status: "on" | "off";
  x: [number, number];
  y: [number, number];
  z: [number, number];
};

const parseLine = (line: string): Command => {
  const matches = line.match(
    /(on|off).+x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/
  );
  if (!matches) {
    throw new Error("unexpected parsing");
  }
  const [, status, minX, maxX, minY, maxY, minZ, maxZ] = matches;
  return {
    status: status as "on" | "off",
    x: [parseInt(minX), parseInt(maxX)],
    y: [parseInt(minY), parseInt(maxY)],
    z: [parseInt(minZ), parseInt(maxZ)],
  };
};

const parseInput = async (filePath: string) => {
  const lines = (await fs.readFile(filePath, "utf8")).split("\n");
  const commands = lines.map((x) => parseLine(x));
  return commands;
};

type CubeId = `${string}:${string}:${string}`;
const CUBES: Record<CubeId, boolean> = {};

const range = (length: number) => Array.from({ length }, (x, i) => i);

const CUBES_ON = [];

const executeCommand = (command: Command, limit: number) => {
  const xs = range(command.x[1] - command.x[0] + 1)
    .map((_, i) => command.x[0] + i)
    .filter((x) => x <= limit && x >= -limit);
  const ys = range(command.y[1] - command.y[0] + 1)
    .map((_, i) => command.y[0] + i)
    .filter((x) => x <= limit && x >= -limit);
  const zs = range(command.z[1] - command.z[0] + 1)
    .map((_, i) => command.z[0] + i)
    .filter((x) => x <= limit && x >= -limit);
  xs.forEach((x) =>
    ys.forEach((y) =>
      zs.forEach((z) => {
        const id = [x, y, z].join(":") as CubeId;
        const currentStatus = CUBES[id] || false;
        if (!currentStatus && command.status == "on") {
          CUBES[id] = true;
        }
        if (currentStatus && command.status == "off") {
          delete CUBES[id];
        }
      })
    )
  );
};

const main = async (limit: number) => {
  const commands = await parseInput("./day22/example2.txt");
  commands.forEach((x, index, array) => {
    console.log(index + 1, "/", array.length, JSON.stringify(x));
    console.time("\tcommand");
    executeCommand(x, limit);
    console.timeEnd("\tcommand");
  });
  console.log("\t", { length: Object.keys(CUBES).length });
};

(async () => {
  await main(50);
  // await main(Infinity);
})();
