import fs from 'node:fs/promises'


const linesFromFile = async (filePath: string) => {
  const file = await fs.readFile(filePath, 'utf8')
  return file.split('\n')
};

const byPositions = (lines: string[]) => {
  const positions = Array.from({length: lines[0].length}).fill(undefined).map(() => [] as string[])
  lines.forEach((line, index) => {
    line.split('').forEach((digit, index) => {
      positions[index].push(digit)
    })
  })
  return positions
}

const count = (digits: string[]) => {
  return digits.reduce((p, c) => {
    return {
      ...p,
      [c]: p[c] ? p[c] + 1 : 1,
    }
  }, {} as Record<string, number>)
}

const partOne = async (filePath: string) => {
  const lines = await linesFromFile(filePath);
  const positions = byPositions(lines)
  const counters = positions.map(count)
  const mostCommonBinary = counters.map(x => x['0'] > x['1'] ? 0 : 1).join('')
  const mostCommonDec = parseInt(mostCommonBinary, 2)
  const leastCommonBinary = mostCommonBinary.split('').map(x => x === '0' ? '1' : '0').join('')
  const leastCommonDec = parseInt(leastCommonBinary, 2)
  return mostCommonDec * leastCommonDec
}

type GetNextDigit = (remainingLines: string[], index: number) => string

const getNextOxygen: GetNextDigit = (remainingLines, index) => {
  const digits = remainingLines.map(line => line[index])
  const counter = count(digits)
  if(counter[0] > counter[1]) return '0'
  if(counter[1] > counter[0]) return '1'
  return '1'
}

const getNextCo2: GetNextDigit = (remainingLines, index) => {
  const digits = remainingLines.map(line => line[index])
  const counter = count(digits)
  if(counter[0] > counter[1]) return '1'
  if(counter[1] > counter[0]) return '0'
  return '0'
}

const getDiagnostic = (lines: string[], getNextDigit: GetNextDigit, digits = ''): string => {
  const digit = getNextDigit(lines, digits.length)
  const nextDigits = digits + digit
  const remainingLines = lines.filter(line => line.startsWith(nextDigits))
  if (remainingLines.length === 1) return remainingLines[0]
  return getDiagnostic(remainingLines, getNextDigit, nextDigits)
}

const partTwo = async (filePath: string) => {
    const lines = await linesFromFile(filePath);
    const oxygenBinary = getDiagnostic(lines, getNextOxygen)
    const co2Binary = getDiagnostic(lines, getNextCo2)

    const oxygen = parseInt(oxygenBinary, 2)
    const co2 = parseInt(co2Binary, 2)

    return co2 * oxygen;
  }


;(async () => {
  console.assert(await partOne('./day3/example.txt') === 198, 'Part One Example')
  console.assert(await partTwo('./day3/example.txt') === 230, 'Part Two Example')

  console.log({
    partOne: await partOne('./day3/input.txt'),
    partTwo: await partTwo('./day3/input.txt')
  })
})()