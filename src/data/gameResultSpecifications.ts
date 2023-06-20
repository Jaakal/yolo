import { GamePosition } from './enums/GamePosition';
import { GameResult } from './enums/GameResult';
import { Jackpot } from './enums/Jackpot';

type GameResultSpecifications = {
  [key in GamePosition]: {
    [key in GamePosition]: GameResult;
  };
} & { [key in Jackpot]: number };

const gameResultSpecifications: GameResultSpecifications = {
  [GamePosition.Rock]: {
    [GamePosition.Rock]: GameResult.Tie,
    [GamePosition.Paper]: GameResult.Lost,
    [GamePosition.Scissors]: GameResult.Won,
  },
  [GamePosition.Paper]: {
    [GamePosition.Rock]: GameResult.Won,
    [GamePosition.Paper]: GameResult.Tie,
    [GamePosition.Scissors]: GameResult.Lost,
  },
  [GamePosition.Scissors]: {
    [GamePosition.Rock]: GameResult.Lost,
    [GamePosition.Paper]: GameResult.Won,
    [GamePosition.Scissors]: GameResult.Tie,
  },
  [Jackpot.Zero]: 0,
  [Jackpot.XSmall]: 1,
  [Jackpot.Small]: 5000,
  [Jackpot.Medium]: 25000,
  [Jackpot.Large]: 50000,
};

export default gameResultSpecifications;
