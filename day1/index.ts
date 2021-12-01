import fs from 'node:fs/promises'

const countIncreases = (numbers: number[]) => {
  const increases = numbers.map((_, index, array) => {
    if (index === 0) return false
    return array[index] > array[index - 1]
  }).filter(Boolean)
  return increases.length;
};

const numbersFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, 'utf8')
  const lines = file.split('\n')
  return lines.map(x => parseInt(x, 10));
};

const partOne = async (filePath: string) => {
  const numbers = await numbersFromFile(filePath);
  return countIncreases(numbers);
}

const partTwo = async (filePath: string) => {
  const numbers = await numbersFromFile(filePath);

  const averages = numbers.map((_, index, array) => {
      if (array.length < index + 2) return false
      return array[index] + array[index + 1] + array[index + 2]
  }).filter(Boolean) as number[]

  return countIncreases(averages);
}

;(async () => {
  console.assert( await partOne('./day1/example.txt') === 7, 'Part One Example')
  console.assert(await partTwo('./day1/example.txt') === 5, 'Part Two Example')

  console.log({
    partOne: await partOne('./day1/input.txt'),
    partTwo: await partTwo('./day1/input.txt')
  })
})()