import {
  findRotation,
  rotations,
  Scanner,
  scannersFromFile,
  translateScanner,
} from "./index";

describe("day19 ", () => {
  let scanners: Scanner[];
  beforeAll(async () => {
    scanners = await scannersFromFile("./day19/example.txt");
  });

  describe("translateScanner", () => {
    it("translates [1] to [0]", () => {
      const [ax, ay, az] = [-618, -824, -621];
      const rotated = scanners[1].map(rotations[5]);
      const [rx, ry, rz] = rotated[0];
      expect(
        translateScanner(rotated, [ax - rx, ay - ry, az - rz])
      ).toStrictEqual(
        expect.arrayContaining([
          [-618, -824, -621],
          [-537, -823, -458],
          [-447, -329, 318],
          [404, -588, -901],
          [544, -627, -890],
          [528, -643, 409],
          [-661, -816, -575],
          [390, -675, -793],
          [423, -701, 434],
          [-345, -311, 381],
          [459, -707, 401],
          [-485, -357, 347],
        ])
      );
    });
  });

  it.skip("overlaps", () => {
    expect(findRotation(scanners[0], scanners[1])).toStrictEqual([
      [-618, -824, -621],
      [-699, -823, -784],
      [-789, -329, -1560],
      [-1640, -588, -341],
      [-1209, -1108, -1177],
      [-1780, -627, -352],
      [-1644, -1815, -2045],
      [-737, -1607, -472],
      [-1764, -643, -1651],
      [-635, -1648, -599],
      [-575, -816, -667],
      [-1804, -2007, -665],
      [-1626, -675, -449],
      [-1770, -1912, -2010],
      [-1733, -1838, -625],
      [-1659, -701, -1676],
      [-601, -1737, -1728],
      [-1632, -1931, -679],
      [-891, -311, -1623],
      [-1695, -707, -1643],
      [-718, -1681, -642],
      [-1668, -2009, -2092],
      [-497, -1745, -1910],
      [-549, -1600, -1818],
      [-751, -357, -1589],
    ]);
  });
});
