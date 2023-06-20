type OpenPositions = number;

type GameSpecifications = {
  playerStartingBalance: number;
  betStep: number;
  openPositionsAtOnce: number;
  winningRates: {
    [key in OpenPositions]: number;
  };
};

const gameSpecifications: GameSpecifications = {
  playerStartingBalance: 5000,
  betStep: 500,
  openPositionsAtOnce: 2,
  winningRates: {
    1: 14,
    2: 3,
  },
};

export default gameSpecifications;
