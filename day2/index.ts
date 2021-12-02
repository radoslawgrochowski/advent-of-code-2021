import fs from 'node:fs/promises'

type Direction = 'forward' | 'down' | 'up'

const entriesFromFile = async (filePath: string): Promise<[Direction, number][]> => {
  const file = await fs.readFile(filePath, 'utf8')
  const lines = file.split('\n')
  return lines.map(x => {
    const [direction, xString] = x.split(' ')
    return [direction as Direction, parseInt(xString, 10)]
  })
};

const partOne = async (filePath: string) => {
  const entries = await entriesFromFile(filePath);
  const horizontal = entries.filter(([direction]) => direction === 'forward').map(([_, x]) => x).reduce((p, c) => p + c)
  const vertical = entries.filter(([direction]) => ['up', 'down'].includes(direction)).map(([d, x]) => d === 'up' ? -x : x).reduce((p, c) => p + c)
  return vertical * horizontal
}

const partTwo = async (filePath: string) => {
    const entries = await entriesFromFile(filePath);

    const {vertical, horizontal} = entries.reduce((values, [direction, x]) => {
      const {aim, vertical, horizontal} = values
      if (direction === 'down')
        return {...values, aim: aim + x}

      if (direction === 'up')
        return {...values, aim: aim - x}

      if (direction === 'forward')
        return {...values, vertical: vertical + (aim * x), horizontal: horizontal + x}

      throw new Error('unsupported direction')
    }, {
      vertical: 0, aim: 0, horizontal: 0,
    })

    return vertical * horizontal
  }

;(async () => {
  console.assert(await partOne('./day2/example.txt') === 150, 'Part One Example')
  console.assert(await partTwo('./day2/example.txt') === 900, 'Part Two Example')

  console.log({
    partOne: await partOne('./day2/input.txt'),
    partTwo: await partTwo('./day2/input.txt')
  })
})()