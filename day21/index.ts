const inputString =
  "Player 1 starting position: 8\n" + "Player 2 starting position: 1";

const exampleString =
  "Player 1 starting position: 4\n" + "Player 2 starting position: 8";

const START_INPUT = Object.fromEntries(
  inputString
    .split("\n")
    .map((s, index) => [
      index + 1,
      { position: parseInt(s.split(":")[1]), score: 0 },
    ])
);

const partOne = () => {
  const createDice = () => {
    let roll = 0;
    let timesRolled = 0;
    const throwDice = () => {
      roll = (roll % 100) + 1;
      timesRolled = timesRolled + 1;
      return roll;
    };
    const getTimesRolled = () => timesRolled;
    return {
      throwDice,
      getTimesRolled,
    };
  };

  const { throwDice, getTimesRolled } = createDice();

  const players = { ...START_INPUT };

  const move = (player: string, steps: number) => {
    const position = (players[player].position + steps) % 10 || 10;
    const score = players[player].score + position;
    players[player] = { position, score };
    console.log(
      `Player ${player} moves ${steps} steps. Total player score: ${score}`
    );
  };

  const hasWinner = () =>
    Object.entries(players).some(([player, { score }]) => score >= 1000);

  const play = () => {
    while (true) {
      for (const playersKey in players) {
        const throw1 = throwDice();
        const throw2 = throwDice();
        const throw3 = throwDice();
        move(playersKey, throw1 + throw2 + throw3);
        console.log(`Player ${playersKey} rolls ${throw1}+${throw2}+${throw3}`);
        if (hasWinner()) return;
      }
    }
  };

  play();

  const scores = Object.values(players).map((x) => x.score);
  const minScore = Math.min(...scores);
  console.log({ answer: minScore * getTimesRolled() });
};

type State = Record<
  "1" | "2",
  {
    position: number;
    score: number;
    rollCount: number;
    turn: boolean;
  }
>;

type Wins = {
  1: number;
  2: number;
};

const mergeWins = (x: Wins[]): Wins =>
  x.reduce<Wins>(
    (previousValue, currentValue) => {
      previousValue[1] = previousValue[1] + currentValue[1];
      previousValue[2] = previousValue[2] + currentValue[2];
      return previousValue;
    },
    { "1": 0, "2": 0 }
  );

const partTwo = () => {
  const WINNING_POINTS = 21;

  const players: State = {
    1: {
      position: START_INPUT[1].position,
      score: 0,
      turn: true,
      rollCount: 0,
    },
    2: {
      position: START_INPUT[2].position,
      score: 0,
      turn: false,
      rollCount: 0,
    },
  };

  let cache = new Map();

  const generateHash = (state: State) =>
    `${state["1"].position}:${state[1].score}:${state[2].position}:${
      state[2].score
    }:${state[1].turn ? "1" : "2"}:${state[1].rollCount}:${state[2].rollCount}`;

  const dice = (state: State, player: "1" | "2", dice: number): State => {
    const {
      position: prevPosition,
      score: prevScore,
      rollCount: prevRollCount,
    } = state[player];
    const rollCount = prevRollCount + 1;
    const position = (prevPosition + dice) % 10 || 10;
    const score = rollCount === 3 ? prevScore + position : prevScore;
    const otherPlayer = player === "1" ? "2" : "1";
    const turn = rollCount !== 3;
    return {
      ...state,
      [player]: {
        position,
        score,
        turn,
        rollCount,
      },
      [otherPlayer]: {
        ...state[otherPlayer],
        turn: !turn,
        rollCount: 0,
      },
    };
  };

  console.time("all");

  const play = (state: State): Wins => {
    const hash = generateHash(state);
    const cached = cache.get(hash);
    if (cached) {
      return cached;
    }

    if (state[1].score >= WINNING_POINTS) {
      return { "1": 1, "2": 0 };
    }

    if (state[2].score >= WINNING_POINTS) {
      return { "1": 0, "2": 1 };
    }

    if (state[1].turn) {
      const result = mergeWins([
        play(dice(state, "1", 1)),
        play(dice(state, "1", 2)),
        play(dice(state, "1", 3)),
      ]);
      cache.set(hash, result);
      return result;
    }

    if (state[2].turn) {
      const result = mergeWins([
        play(dice(state, "2", 1)),
        play(dice(state, "2", 2)),
        play(dice(state, "2", 3)),
      ]);
      cache.set(hash, result);
      return result;
    }

    throw new Error("unexpected");
  };

  const wins = play(players);
  console.timeEnd("all");
  console.log({ wins });
};

partTwo();
