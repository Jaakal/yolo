import { useTranslations } from 'next-intl';
import HomePageTransitionController from '@/components/HomePageTransitionController/HomePageTransitionController';
import styles from './page.module.scss';

export default function Home() {
  const t = useTranslations('rockPaperScissors');

  return (
    <main className={styles.element}>
      <HomePageTransitionController
        playerBalanceLabel={t('statsBar.playerBalance.label')}
        playerLastRoundBet={t('statsBar.playerLastRoundBet.label')}
        playerLastRoundWin={t('statsBar.playerLastRoundWin.label')}
        rockLabel={t('gamePosition.rock')}
        paperLabel={t('gamePosition.paper')}
        scissorsLabel={t('gamePosition.scissors')}
        versusLabel={t('gamePlayHeading.versus')}
        wonLabel={t('gameResultHeading.won')}
        tieLabel={t('gameResultHeading.tie')}
        lostLabel={t('gameResultHeading.lost')}
        amountLabel={t('gameResultHeading.amount')}
        kickerLabel={t('gamePositionKicker')}
        playCtaPrimaryLabel={t('playCta.primaryState.label')}
        playCtaSecondaryLabel={t('playCta.secondaryState.label')}
      />
    </main>
  );
}
