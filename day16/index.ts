import fs from "node:fs/promises";

const inputFromFile = async (filePath: string) =>
  await fs.readFile(filePath, "utf8");

const range = (length: number) =>
  Array.from({ length })
    .fill(0)
    .map((_, index) => index);

type CommonPacket = {
  version: number;
  id: number;
  bits: string;
};

type LiteralPacket = CommonPacket & {
  literal: number;
};

type OperatorPacket = CommonPacket & {
  lengthTypeId: number;
  includes: Packet[];
};

type Packet = LiteralPacket | OperatorPacket;

export const toBits = (hex: string) =>
  hex
    .split("")
    .map((x) => parseInt(x, 16).toString(2).padStart(4, "0"))
    .join("");

export const getLiteralContent = (bits: string) => {
  let fragmentCount = 1;
  const remaining = bits.slice(6);
  while (remaining[(fragmentCount - 1) * 5] === "1") fragmentCount++;
  const fragments = range(fragmentCount).map((x) =>
    remaining.slice(x * 5, x * 5 + 5)
  );
  const result = fragments.join("");
  const literal = parseInt(fragments.map((x) => x.slice(1)).join(""), 2);
  return {
    literal,
    bits: bits.slice(0, 6) + result,
  };
};

export const decodePacket = (bits: string): Packet => {
  const version = parseInt(bits.slice(0, 3), 2);
  const id = parseInt(bits.slice(3, 6), 2);
  if (id === 4) {
    return {
      version,
      id,
      ...getLiteralContent(bits),
    };
  } else {
    const lengthTypeId = parseInt(bits[6], 2);
    if (lengthTypeId === 0) {
      const length = parseInt(bits.slice(7, 7 + 15), 2);
      let rest = bits.slice(7 + 15, 7 + 15 + length);
      const includes = [];
      while (rest.length && rest.includes("1")) {
        const nextPacket = decodePacket(rest);
        includes.push(nextPacket);
        rest = rest.slice(nextPacket.bits.length);
      }

      return {
        bits: bits.slice(0, 7 + 15) + includes.map((x) => x.bits).join(""),
        version,
        id,
        lengthTypeId,
        includes,
      };
    } else {
      const numberOfChildren = parseInt(bits.slice(7, 7 + 11), 2);
      let rest = bits.slice(7 + 11);
      const includes = [];
      while (
        rest.length &&
        rest.includes("1") &&
        numberOfChildren !== includes.length
      ) {
        const nextPacket = decodePacket(rest);
        includes.push(nextPacket);
        rest = rest.slice(nextPacket.bits.length);
      }

      return {
        bits: bits.slice(0, 7 + 11) + includes.map((x) => x.bits).join(""),
        version,
        id,
        lengthTypeId,
        includes,
      };
    }
  }
};

const getVersions = (packets: Packet[]): number[] => {
  const versions = packets.flatMap((packet) => {
    if ("includes" in packet) {
      return [packet.version, ...getVersions(packet.includes)];
    } else {
      return [packet.version];
    }
  });
  return [...versions];
};

export const getVersionSum = (packet: Packet) =>
  getVersions([packet]).reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );

export const isLiteral = (packet: Packet): packet is LiteralPacket =>
  packet.id === 4;

export const execute = (packet: Packet): number => {
  if (isLiteral(packet)) return packet.literal;
  if (packet.id === 0)
    return packet.includes.reduce(
      (previousValue, currentValue) => previousValue + execute(currentValue),
      0
    );
  if (packet.id === 1)
    return packet.includes.reduce(
      (previousValue, currentValue) => previousValue * execute(currentValue),
      1
    );
  if (packet.id === 2)
    return Math.min(...packet.includes.map((x) => execute(x)));
  if (packet.id === 3)
    return Math.max(...packet.includes.map((x) => execute(x)));
  if (packet.id === 5) {
    if (packet.includes.length !== 2)
      throw new Error("id 5 operator more packets length than 2");
    const [a, b] = packet.includes;
    return execute(a) > execute(b) ? 1 : 0;
  }
  if (packet.id === 6) {
    if (packet.includes.length !== 2) {
      console.log(packet.includes);
      throw new Error("id 6 operator more packets length than 2");
    }
    const [a, b] = packet.includes;
    return execute(a) < execute(b) ? 1 : 0;
  }
  if (packet.id === 7) {
    if (packet.includes.length !== 2)
      throw new Error("id 7 operator more packets length than 2");
    const [a, b] = packet.includes;
    return execute(a) === execute(b) ? 1 : 0;
  }
  throw new Error("unexpected packet id");
};

const partOne = async (path: string) => {
  const input = await inputFromFile(path);
  return getVersionSum(decodePacket(toBits(input)));
};

const partTwo = async (path: string) => {
  const input = await inputFromFile(path);
  return execute(decodePacket(toBits(input)));
};

(async () => {
  console.log({
    partOne: await partOne("./day16/input.txt"),
    partTwo: await partTwo("./day16/input.txt"),
  });
})();
