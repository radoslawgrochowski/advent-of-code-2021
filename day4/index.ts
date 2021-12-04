import fs from 'node:fs/promises'


const linesFromFile = async (filePath: string) => {
    const file = await fs.readFile(filePath, 'utf8')
    return file.split('\n')
};

type Bingo = (number | '*')[][]

const dataFromLines = (lines: string[]) => {
    const [inputString, space, ...rest] = lines;
    const inputs = inputString.split(',').map(x => parseInt(x, 10))

    const chunks = rest.reduce<Record<number, string[]>>((all, current, i) => {
        const index = Math.floor(i / 6);
        if (current === '') return all
        return {
            ...all,
            [index]: [...(all?.[index] || []), current],
        }
    }, {})

    const bingos = Object.values(chunks).map(chunk => chunk.map(line => line.split(' ').filter(Boolean).map(x => parseInt(x, 10))))
    return {
        inputs,
        bingos
    }
}

const markDigit = (bingo: Bingo, digit: number) =>bingo.map(row => row.map(x => digit === x ? '*' : x))

const transpose = (a: Bingo): Bingo => Object.keys(a[0]).map((c: any) => a.map(r => r[c]));

const isWinnerByRow = (bingo: Bingo) => bingo.some(row => row.every(digit => digit === '*'))

const getWinners = (bingos: Bingo[]): Bingo[] => {
    const byRow = bingos.filter(isWinnerByRow)
    const byColumn = bingos.filter(x => isWinnerByRow(transpose(x)))
    return [...byRow, ...byColumn]
}

const getUnmarked = (bingo: Bingo) => (bingo.flat(2).filter(x => typeof x === "number") as number[])

const getResult = (winner: Bingo, currentInput: number) => {
    const remaining = getUnmarked(winner)
    const sumOfRemaining = remaining.reduce((sum, current) => sum + current, 0)
    return sumOfRemaining * currentInput;
}

const partOne = async (filePath: string) => {
    const lines = await linesFromFile(filePath);
    const data = dataFromLines(lines)
    let winners: Bingo[] = [];
    let bingos: Bingo[] = data.bingos
    let remainingInputs: number[] = data.inputs
    let currentInput: number | undefined = undefined;
    while (!winners.length) {
        let [next, ...rest] = remainingInputs
        remainingInputs = rest;
        currentInput = next;
        if (typeof next === "undefined") throw Error('no next')
        bingos = bingos.map(x => markDigit(x, next))
        winners = getWinners(bingos)
    }
    if (winners.length > 1) throw Error('more than one winner')
    if (!currentInput) throw Error('unexpected, no currentInput')
    const [winner] = winners
    return getResult(winner, currentInput)
}

const partTwo = async (filePath: string) => {
    const lines = await linesFromFile(filePath);
    const data = dataFromLines(lines)
    const winners: Bingo[] = [];
    let bingos: Bingo[] = data.bingos
    const inputs: number[] = data.inputs
    let currentInput: number | undefined = undefined;
    while (bingos.length) {
        currentInput = inputs.shift()
        if (typeof currentInput === "undefined") throw Error('no currentInput')
        bingos = bingos.map(x => markDigit(x, currentInput!))
        const roundWinners = getWinners(bingos)
        bingos = bingos.filter(x => !roundWinners.includes(x))
        winners.push(...roundWinners)
    }
    const loser = winners.pop()
    return getResult(loser!, currentInput!)
}


;(async () => {
    console.assert(await partOne('./day4/example.txt') === 4512, 'Part One Example')
    console.assert(await partTwo('./day4/example.txt') === 1924, 'Part Two Example')

    console.log({
        partOne: await partOne('./day4/input.txt'),
        partTwo: await partTwo('./day4/input.txt')
    })
})()