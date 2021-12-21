import fs from "node:fs/promises";

export const dataFromFile = async (filePath: string) => {
  const file = (await fs.readFile(filePath, "utf8")).split("\n");
  const [algorithm] = file.slice(0, 1);
  const inputImage = file.slice(2);
  return {
    algorithm,
    inputImage,
  };
};

type PixelPosition = [number, number];

const print = (image: string[]) => {
  image.forEach((row) => {
    const toPrint = row
      .split("")
      .map((value) => (value === "#" ? "\x1b[31m" + value + "\x1b[0m" : value))
      .join("");
    console.log(toPrint);
  });
  console.log("\n");
};

const offsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const mapDigits = (value: string) => (value === "#" ? "1" : "0");

(async () => {
  const { algorithm, inputImage } = await dataFromFile("./day20/input.txt");
  let image = inputImage;
  let imageSize = inputImage[0].length;
  const filler = ".";

  const enlarge = () => {
    const fill = filler.repeat(image[0].length + 2);
    image = [fill, ...image.map((x) => `${filler}${x}${filler}`), fill];
  };

  const enhancePixel = ([x, y]: PixelPosition) => {
    const positions = offsets.map(([ox, oy]) => [ox + x, oy + y]);
    const pool = positions.map(([x, y]) => image?.[y]?.[x] || filler);
    const binary = pool.map((x) => mapDigits(x)).join("");
    const index = parseInt(binary, 2);
    return algorithm[index];
  };

  const enhanceImage = () => {
    imageSize++;

    image = image.map((row, y) => {
      return row
        .split("")
        .map((pixel, x) => {
          return enhancePixel([x, y]);
        })
        .join("");
    });
  };
  print(image);

  enlarge();
  for (let i = 0; i < 25; i++) {
    enlarge();
    enlarge();
    enlarge();
    enhanceImage();
    enhanceImage();
    image = image.slice(1, -1).map((x) => x.slice(1, -1));
  }

  print(image);

  const count = image
    .map((row) =>
      row
        .slice(1)
        .split("")
        .reduce(
          (previousValue, currentValue) =>
            currentValue === "#" ? previousValue + 1 : previousValue,
          0
        )
    )
    .reduce((previousValue, currentValue) => previousValue + currentValue);
  console.log({ count });
})();
