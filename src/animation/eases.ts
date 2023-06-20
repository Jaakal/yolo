import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const softElastic = CustomEase.create(
  'softElastic',
  'M0,0 C0.05556,0 0.10833,1.08929 0.27778,1.08929 0.38667,1.08929 0.43593,0.97619 0.53704,0.97619 0.628,0.97619 0.67231,1.00893 0.77027,1.00893 0.86676,1.00893 0.88973,1 1,1'
);

export const vinnieInOut = CustomEase.create(
  'vinnieInOut',
  'M0,0 C0.2,0 0,1 1,1'
);
