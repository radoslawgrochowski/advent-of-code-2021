const PUZZLE_INPUT = "target area: x=124..174, y=-123..-86";

type Position = [number, number];
type Velocity = [number, number];
const range = (length: number) =>
  Array.from({ length })
    .fill(0)
    .map((_, index) => index);
type Target = { minX: number; maxX: number; minY: number; maxY: number };

export const targetDiff = (
  [x, y]: Position,
  { minX, minY, maxX, maxY }: Target
): -1 | 0 | 1 => {
  if (minX <= x && x <= maxX && minY <= y && y <= maxY) return 0;
  if (x < maxX && y > minY) return -1;
  return 1;
};

export const parseInput = (input: string) => {
  const [minX, maxX, minY, maxY] = input
    .match(/x=([-+]?\d+)\.{2}([-+]?\d+), y=([-+]?\d+)\.{2}([-+]?\d+)/i)!
    .slice(1)
    .map((x) => parseInt(x, 10));
  return { minX, maxX, minY, maxY };
};

export const step = ([xv, yv]: Velocity, [x, y]: Position) => {
  const position: Position = [x + xv, y + yv];
  const velocity: Velocity = [xv > 0 ? xv - 1 : xv === 0 ? 0 : xv - 1, yv - 1];
  return {
    position,
    velocity,
  };
};

export const fire = (
  target: Target,
  startingVelocity: Velocity,
  startingPosition: Position = [0, 0]
) => {
  let currentPosition = startingPosition;
  let currentVelocity = startingVelocity;
  let diff = -1;
  let maxY = startingPosition[1];
  while (diff === -1) {
    const { position, velocity } = step(currentVelocity, currentPosition);
    currentVelocity = velocity;
    currentPosition = position;
    diff = targetDiff(currentPosition, target);
    maxY = Math.max(maxY, currentPosition[1]);
  }
  return {
    velocity: currentVelocity,
    position: currentPosition,
    diff,
    maxY,
  };
};

export const calculateVelocity = (target: Target) => {
  const xRanges = [1, target.maxX + 1];
  const yRanges = [target.minY, 1000];
  const possibles: Velocity[] = range(xRanges[1] - xRanges[0] + 1).flatMap(
    (x) =>
      range(yRanges[1] - yRanges[0] + 1).map(
        (y) => [x + xRanges[0], y + yRanges[0]] as Velocity
      )
  );

  const hit: [Velocity, number][] = [];

  console.time("all");
  possibles.forEach((velocity: Velocity) => {
    console.log({ velocity });
    const result = fire(target, velocity);
    if (result.diff === 0) {
      hit.push([velocity, result.maxY]);
    }
  });
  console.timeEnd("all");

  const bestHit = Math.max(...hit.map((x) => x[1]));
  const best = hit.find((x) => x[1] === bestHit);

  return {
    best,
    count: hit.length,
  };
};

console.log(JSON.stringify(calculateVelocity(parseInput(PUZZLE_INPUT))));
