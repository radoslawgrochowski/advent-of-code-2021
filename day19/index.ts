import fs from "node:fs/promises";

export type Scanner = Scan[];
export type Scan = [number, number, number];

export const scannersFromFile = async (filePath: string): Promise<Scanner[]> =>
  (await fs.readFile(filePath, "utf8"))
    .split("--- ")
    .slice(1)
    .map((x) =>
      x
        .split("\n")
        .filter((x) => x.length)
        .slice(1)
        .map(
          (x) =>
            x.split(",").map((x) => parseInt(x, 10)) as [number, number, number]
        )
    );

export const rotations: ((scan: Scan) => Scan)[] = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, -y, -x],
];

export const translateScanner = (
  scanner: Scanner,
  [tx, ty, tz]: Scan
): Scan[] => scanner.map(([x, y, z]) => [x + tx, y + ty, tz + z]);

const sameScan = ([ax, ay, az]: Scan, [bx, by, bz]: Scan) =>
  ax === bx && ay === by && az === bz;

export const findRotation = (a: Scanner, b: Scanner) => {
  const aSliced = a.slice(0, -12);

  const bRotations = rotations.map((x) => b.map(x));
  for (const bRotated of bRotations) {
    for (const bRotatedScan of bRotated) {
      for (const aScan of aSliced) {
        const [rx, ry, rz] = bRotatedScan;
        const [ax, ay, az] = aScan;
        const translation: Scan = [ax - rx, ay - ry, az - rz];
        const translated = translateScanner(bRotated, translation);
        const inBoth = translated.filter((t) => a.some((a) => sameScan(a, t)));
        if (inBoth.length >= 12) {
          return {
            translated,
            translation,
          };
        }
      }
    }
  }
};

const filterDuplicates = (scans: Scan[]) =>
  scans.reduce<Scan[]>((previousValue, c) => {
    if (!previousValue.some((p) => sameScan(p, c))) {
      previousValue.push(c);
    }
    return previousValue;
  }, []);

const manhattanDistance = ([ax, ay, az]: Scan, [bx, by, bz]: Scan) =>
  Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);

(async () => {
  const scanners = await scannersFromFile("./day19/input.txt");
  let scans: Scan[] = [...scanners[0]];
  const translations: Record<string, Scan> = {
    0: [0, 0, 0],
  };
  const queue = scanners.map((_, index) => index).slice(1);
  console.time("finding all positions");
  while (queue.length) {
    const index = queue.shift()!;
    console.log(`searching for rotation of ${index}`);
    console.log(`\tqueue: ${queue}`);
    console.log(`\tscans: ${scans.length}`);

    console.time("\tfindRotation");
    const rotation = findRotation(scans, scanners[index]);
    console.timeEnd("\tfindRotation");

    if (!rotation) {
      console.log(`no rotation for ${index}`);
      queue.push(index);
    } else {
      console.log(`rotation found for ${index}`);
      console.time("\tfilterDuplicates");
      scans = filterDuplicates([...scans, ...rotation.translated]);
      translations[index] = rotation.translation;
      console.timeEnd("\tfilterDuplicates");
    }
    console.log("\n");
  }
  console.timeEnd("finding all positions");

  const manhattans: number[] = Object.values(translations).flatMap((a) =>
    Object.values(translations).map((b) => manhattanDistance(a, b))
  );
  const highestManhattanDist = Math.max(...manhattans);

  console.log({ scans: scans.length, highestManhattanDist });
})();
