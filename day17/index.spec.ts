import { parseInput, step, fire, calculateVelocity } from "./index";
const EXAMPLE_INPUT = "target area: x=20..30, y=-10..-5";

describe("day 17", () => {
  describe("parseInput", () => {
    test(EXAMPLE_INPUT, () => {
      expect(parseInput(EXAMPLE_INPUT)).toStrictEqual({
        maxX: 30,
        maxY: -5,
        minX: 20,
        minY: -10,
      });
    });
  });

  describe("step", () => {
    test("7,2;0,0", () => {
      expect(step([7, 2], [0, 0])).toStrictEqual({
        position: [7, 2],
        velocity: [6, 1],
      });
    });
  });

  describe("targetDiff", () => {
    test("7,2 0,0", () => {
      expect(step([7, 2], [0, 0])).toStrictEqual({
        position: [7, 2],
        velocity: [6, 1],
      });
    });
  });

  describe("fire", () => {
    test("7,2 0,0", () => {
      expect(fire(parseInput(EXAMPLE_INPUT), [7, 2], [0, 0])).toStrictEqual(
        expect.objectContaining({
          diff: 0,
        })
      );
    });
    test("6,3", () => {
      expect(fire(parseInput(EXAMPLE_INPUT), [6, 3])).toStrictEqual(
        expect.objectContaining({
          diff: 0,
        })
      );
    });
    test("9,0", () => {
      expect(fire(parseInput(EXAMPLE_INPUT), [9, 0])).toStrictEqual(
        expect.objectContaining({
          diff: 0,
        })
      );
    });
    test("17,-4", () => {
      expect(fire(parseInput(EXAMPLE_INPUT), [17, -4])).toStrictEqual(
        expect.objectContaining({
          diff: 1,
        })
      );
    });

    test("6,9", () => {
      expect(fire(parseInput(EXAMPLE_INPUT), [6, 9])).toStrictEqual(
        expect.objectContaining({
          diff: 0,
          maxY: 45,
        })
      );
    });
  });
});
