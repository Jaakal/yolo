import { type Howl, type Howler } from 'howler';
import { SampleName } from './SampleName';

// type SoundParams = {
//   fadeInTime: number;
//   noiseShift: number;
//   volume: number;
// };

// const effectSoundParams: SoundParams = {
//   fadeInTime: 0,
//   noiseShift: 0,
//   volume: 1,
// };

// const loopSoundParams: SoundParams = {
//   fadeInTime: 500,
//   noiseShift: 500,
//   volume: 0.8,
// };

export type SoundManager = Record<SampleName, Howl>;

let soundManager: SoundManager | null = null;

export const useSoundManager = (): SoundManager => {
  if (!soundManager && typeof window !== 'undefined') {
    soundManager = {} as SoundManager;

    // const video = document.createElement('video');
    // const canPlayWebM = video.canPlayType('video/webm; codecs="vp8, vorbis"');
    // const fileExtension = ['probably', 'maybe'].includes(canPlayWebM)
    //   ? 'webm'
    //   : 'mp3';

    Object.values(SampleName).forEach((sampleName) => {
      soundManager![sampleName] = {
        play: () => {},
      } as Howl;
      // import(`../../../public/sounds/${sampleName}.${fileExtension}`).then(
      //   (response) => {
      //     soundManager![sampleName] = new Howl({
      //       src: [response.default],
      //       autoplay: sampleName.includes('loop'),
      //       loop: sampleName.includes('loop'),
      //       volume: 0,
      //       onplay: () => {
      //         const { fadeInTime, noiseShift, volume } = {
      //           ...(sampleName.includes('loop')
      //             ? loopSoundParams
      //             : effectSoundParams),
      //         };

      //         setTimeout(() => {
      //           soundManager![sampleName].fade(0, volume, fadeInTime);
      //         }, noiseShift);
      //       },
      //     });
      //   }
      // );
    });

    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'visible') {
    //     Howler.volume(1);
    //   } else {
    //     Howler.volume(0);
    //   }
    // });
  }

  return soundManager as SoundManager;
};
