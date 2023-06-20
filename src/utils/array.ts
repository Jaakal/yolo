export const shuffleArray = (array: Array<any>): Array<any> => {
  const shuffledArray = [...array];
  for (let index = shuffledArray.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledArray[index], shuffledArray[swapIndex]] = [
      shuffledArray[swapIndex],
      shuffledArray[index],
    ];
  }
  return shuffledArray;
};
