export const createElementArrayKeys = (elementCount: number) => {
  const keyPrefix = crypto.randomUUID();
  return [...Array(elementCount)].map((_, index) => `${keyPrefix}-${index}`);
};
