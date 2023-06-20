export const arithmeticSequenceSum = (
  elementsCount: number,
  sequenceFirstMember: number,
  sequenceStep: number
): number => {
  const sequenceLastMember =
    sequenceFirstMember + (elementsCount - 1) * sequenceStep;
  const sequenceSum =
    (elementsCount / 2) * (sequenceFirstMember + sequenceLastMember);
  return sequenceSum;
};
