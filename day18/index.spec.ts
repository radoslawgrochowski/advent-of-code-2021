import {
  addition,
  addToFirstNumber,
  addToLastNumber,
  explode,
  explodeNeeded,
  magnitude,
  parseInputs,
  split,
} from "./index";

describe("day 18", () => {
  describe("addition", () => {
    test("first example", () => {
      expect(addition(`[1,2]`, `[[3,4],5]`)).toStrictEqual(`[[1,2],[[3,4],5]]`);
    });
  });
  describe("explode", () => {
    test.each([
      [`[[[[[9, 8], 1], 2], 3], 4]`, `[[[[0, 9], 2], 3], 4]`],
      [`[7, [6, [5, [4, [3, 2]]]]]`, `[7, [6, [5, [7, 0]]]]`],
      [`[[6, [5, [4, [3, 2]]]], 1]`, `[[6, [5, [7, 0]]], 3]`],
      [
        `[[3, [2, [1, [7, 3]]]], [6, [5, [4, [3, 2]]]]]`,
        `[[3, [2, [8, 0]]], [9, [5, [4, [3, 2]]]]]`,
      ],
      ["[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]", "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"],
      [
        "[[[[[1,1],[2,2]],[3,3]],[4,4]],[5,5]]",
        "[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]",
      ],
      ["[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]", "[[[[3,0],[5,3]],[4,4]],[5,5]]"],
    ])("exploding %s", (input, output) => {
      expect(explode(input)).toStrictEqual(output);
    });
  });

  describe("addToFirstNumber", () => {
    it("[[[[23, 9], 2], 3], 4]", () => {
      expect(addToFirstNumber(`[[[[23, 9], 2], 3], 4]`, 10)).toBe(
        `[[[[33, 9], 2], 3], 4]`
      );
    });
  });

  describe("addToLastNumber", () => {
    it("[[[[23, 9], 2], 3], 4]", () => {
      expect(addToLastNumber(`[[[[23, 9], 2], 3], 4]`, 10)).toBe(
        `[[[[23, 9], 2], 3], 14]`
      );
    });
  });

  describe("split", () => {
    test.each([
      ["[[[[0,7],4],[15,[0,13]]],[1,1]]", "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]"],
      [
        "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]",
        "[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]",
      ],
    ])("splitting %s", (input, output) => {
      expect(split(input)).toStrictEqual(output);
    });
  });

  describe("parse inputs", () => {
    it("first", () => {
      expect(parseInputs(["[1,1]", "[2,2]", "[3,3]", "[4,4]"])).toBe(
        "[[[[1,1],[2,2]],[3,3]],[4,4]]"
      );
    });

    it("second", () => {
      expect(parseInputs(["[1,1]", "[2,2]", "[3,3]", "[4,4]", "[5,5]"])).toBe(
        "[[[[3,0],[5,3]],[4,4]],[5,5]]"
      );
    });
  });

  describe("explodeNeeded", () => {
    test("does need explode", () => {
      expect(explodeNeeded("[[[[0,[3,2]],[3,3]],[4,4]],[5,5]]")).toBe(true);
    });

    test("does not need explode", () => {
      expect(explodeNeeded("[[[[3,0],[5,3]],[4,4]],[5,5]]")).toBe(false);
    });
  });

  describe("magnitude", () => {
    test("[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]", () => {
      expect(
        magnitude(
          JSON.parse(
            "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]"
          )
        )
      ).toBe(4140);
    });
  });
});
