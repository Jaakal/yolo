'use client';

import { useEffect, useRef } from 'react';
import { useRefs } from '../../hooks/useRefs';
import { useTransitionController } from '../../hooks/TransitionController';
import { setupTransitionInTimeline } from './TransitionController';
import StatsBar from '../stats-bar/StatsBar/StatsBar';
import GamePlayController from '../GamePlayController/GamePlayController';
import GameResultController from '../GameResultController/GameResultController';
import GamePositionPicker from '../GamePositionPicker/GamePositionPicker';
import GameNavigation from '../GameNavigation/GameNavigation';
import classNames from 'classnames';
import { useSoundManager } from '@/hooks/SoundManager/useSoundManager';
import styles from './HomePageTransitionController.module.scss';

export interface HomePageTransitionControllerProps
  extends React.HTMLProps<HTMLDivElement> {
  playerBalanceLabel: string;
  playerLastRoundBet: string;
  playerLastRoundWin: string;
  rockLabel: string;
  paperLabel: string;
  scissorsLabel: string;
  versusLabel: string;
  wonLabel: string;
  tieLabel: string;
  lostLabel: string;
  amountLabel: string;
  kickerLabel: string;
  playCtaPrimaryLabel: string;
  playCtaSecondaryLabel: string;
}

export type HomePageTransitionControllerRefs = {
  backgroundWrapper: HTMLDivElement;
  element: HTMLDivElement;
  statsBar: HTMLDivElement;
  gamePlayController: HTMLDivElement;
  gameResultController: HTMLDivElement;
  gamePositionPicker: HTMLDivElement;
  gameNavigation: HTMLDivElement;
};

const HomePageTransitionController: React.FunctionComponent<
  HomePageTransitionControllerProps
> = ({
  playerBalanceLabel,
  playerLastRoundBet,
  playerLastRoundWin,
  rockLabel,
  paperLabel,
  scissorsLabel,
  versusLabel,
  wonLabel,
  tieLabel,
  lostLabel,
  amountLabel,
  kickerLabel,
  playCtaPrimaryLabel,
  playCtaSecondaryLabel,
}) => {
  const refs = useRefs<HomePageTransitionControllerRefs>();
  const hasTransitionedIn = useRef<boolean>(false);

  const transitionController =
    useTransitionController<HomePageTransitionControllerRefs>({
      ref: refs.element,
      refs,
      setupTransitionInTimeline,
    });

  useSoundManager();

  useEffect(() => {
    if (transitionController && !hasTransitionedIn.current) {
      hasTransitionedIn.current = true;
      transitionController.transitionIn();
    }
  }, [transitionController]);

  return (
    <div
      className={styles.element}
      ref={refs.element}
    >
      <div className={styles.backgroundCropper}>
        <div
          className={styles.backgroundWrapper}
          ref={refs.backgroundWrapper}
        >
          <div className={classNames(styles.background, styles.background1)} />
          <div className={classNames(styles.background, styles.background2)} />
        </div>
      </div>

      <div className={styles.content}>
        <StatsBar
          className={styles.statsBar}
          playerBalanceLabel={playerBalanceLabel}
          playerLastRoundBet={playerLastRoundBet}
          playerLastRoundWin={playerLastRoundWin}
          ref={refs.statsBar}
        />
        <div className={styles.statsBarSpacer} />
        <div className={classNames('heading-01', styles.controllersWrapper)}>
          <GamePlayController
            rockLabel={rockLabel}
            paperLabel={paperLabel}
            scissorsLabel={scissorsLabel}
            versusLabel={versusLabel}
            ref={refs.gamePlayController}
          />
          <GameResultController
            rockLabel={rockLabel}
            paperLabel={paperLabel}
            scissorsLabel={scissorsLabel}
            wonLabel={wonLabel}
            tieLabel={tieLabel}
            lostLabel={lostLabel}
            amountLabel={amountLabel}
            ref={refs.gameResultController}
          />
        </div>
        <div className={styles.controlsWrapperSpacer} />
        <GamePositionPicker
          kickerLabel={kickerLabel}
          rockLabel={rockLabel}
          paperLabel={paperLabel}
          scissorsLabel={scissorsLabel}
          ref={refs.gamePositionPicker}
        />
        <div className={styles.gamePositionSpacer} />
        <GameNavigation
          playCtaPrimaryLabel={playCtaPrimaryLabel}
          playCtaSecondaryLabel={playCtaSecondaryLabel}
          ref={refs.gameNavigation}
        />
        <div className={styles.gameNavigationSpacer} />
      </div>
    </div>
  );
};

export default HomePageTransitionController;
