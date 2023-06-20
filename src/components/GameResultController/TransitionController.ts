import { GameResultControllerRefs } from './GameResultController';
import { SetupTransitionTimeline } from '../../hooks/TransitionController';
import { gsap } from 'gsap';
import { fadeFromTo } from '@/animation/fade';
import { countTo } from '@/animation/counter';
import { stroke } from '@/animation/stroke';
import { loseStroke } from '@/animation/loseStroke';
import { SoundManager } from '@/hooks/SoundManager/useSoundManager';
import { SampleName } from '@/hooks/SoundManager/SampleName';
import { Jackpot } from '@/data/enums/Jackpot';
import gameResultSpecifications from '@/data/gameResultSpecifications';
import { GameResult } from '@/data/enums/GameResult';

export const setupTransitionInTimeline: SetupTransitionTimeline<
  GameResultControllerRefs
> = (refs, timeline, { getElementTimeline }) => {
  const { element } = refs;

  timeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
};

type ResultTransitionParams = {
  [key in Jackpot]: {
    sampleName: SampleName;
    resultLabel: {
      flashes: number;
      rounds: number;
      duration: number;
    };
    amountDuration: number;
  };
};

const resultTransitionParams: ResultTransitionParams = {
  [Jackpot.Zero]: {
    sampleName: SampleName.Won,
    resultLabel: {
      flashes: 1,
      rounds: 1,
      duration: 1.2,
    },
    amountDuration: 0,
  },
  [Jackpot.XSmall]: {
    sampleName: SampleName.Won,
    resultLabel: {
      flashes: 2,
      rounds: 2,
      duration: 2.4,
    },
    amountDuration: 2.1,
  },
  [Jackpot.Small]: {
    sampleName: SampleName.SmallJackpot,
    resultLabel: {
      rounds: 3,
      flashes: 3,
      duration: 2.2,
    },
    amountDuration: 1.9,
  },
  [Jackpot.Medium]: {
    sampleName: SampleName.MediumJackpot,
    resultLabel: {
      rounds: 5,
      flashes: 4,
      duration: 3.8,
    },
    amountDuration: 3.5,
  },
  [Jackpot.Large]: {
    sampleName: SampleName.LargeJackpot,
    resultLabel: {
      rounds: 10,
      flashes: 7,
      duration: 6.7,
    },
    amountDuration: 6.4,
  },
};

const findJackpotLevel = (winningSum: number): Jackpot => {
  if (winningSum === 0) {
    return Jackpot.Zero;
  }

  if (winningSum < gameResultSpecifications[Jackpot.Small]) {
    return Jackpot.XSmall;
  }

  if (winningSum < gameResultSpecifications[Jackpot.Medium]) {
    return Jackpot.Small;
  }

  if (winningSum < gameResultSpecifications[Jackpot.Large]) {
    return Jackpot.Medium;
  }

  return Jackpot.Large;
};

export const resultTransition = (
  refs: GameResultControllerRefs,
  highlightLength: number,
  className: 'win-heading-character-outline' | 'tie-heading-character-outline',
  winningSum: number,
  setWinningSumValue: React.Dispatch<React.SetStateAction<number>>,
  gameResult: GameResult.Won | GameResult.Tie,
  soundManager: SoundManager
) => {
  const { element, resultLabelChars, amountLabel, amount } = refs;
  const jackpot =
    gameResult === GameResult.Won
      ? findJackpotLevel(winningSum)
      : winningSum === 0
      ? Jackpot.Zero
      : Jackpot.XSmall;
  const {
    sampleName,
    resultLabel: { rounds, flashes, duration },
    amountDuration,
  } = resultTransitionParams[jackpot];
  const timeline = gsap.timeline();

  timeline.set(resultLabelChars, {
    className,
  });
  timeline.to(element, { autoAlpha: 1, duration: 0.2 });
  timeline.add(() => {
    soundManager[sampleName].play();
  }, 0.1);
  timeline.add(
    stroke(
      resultLabelChars,
      highlightLength,
      className,
      rounds,
      flashes,
      duration
    ),
    0.1
  );
  timeline.add(fadeFromTo(amountLabel, 0.25), 0.2);
  timeline.add(fadeFromTo(amount, 0.25), 0.2);
  timeline.add(() => {
    if (jackpot !== Jackpot.Zero) {
      soundManager[SampleName.CoinsDrop].play();
    }
  }, 0.3);
  timeline.add(countTo(0, winningSum, setWinningSumValue, amountDuration), 0.3);

  return timeline;
};

export const lostResultTransition = (
  refs: GameResultControllerRefs,
  soundManager: SoundManager
): gsap.core.Timeline => {
  const { element, resultLabelChars, amountLabel, amount } = refs;
  const timeline = gsap.timeline();

  timeline.set(resultLabelChars, {
    className: 'lose-heading-character-outline',
  });
  timeline.to(element, { autoAlpha: 1, duration: 0.2 });
  timeline.add(() => {
    soundManager[SampleName.Lost].play();
  }, 0.1);
  timeline.add(
    loseStroke(resultLabelChars, 'lose-heading-character-outline', 0.35),
    0.1
  );
  timeline.add(fadeFromTo(amountLabel, 0.25), 0.1);
  timeline.add(fadeFromTo(amount, 0.25), 0.1);

  return timeline;
};
