import localFont from 'next/font/local';

export const cabin = localFont({
  src: [
    {
      path: '../assets/fonts/Cabin-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--cabin',
  display: 'swap',
});
