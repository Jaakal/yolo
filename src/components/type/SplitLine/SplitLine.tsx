import { memo } from 'react';

type SplitLine = {
  copy: string;
  copyCharacterKeys: Array<string>;
  addCharacterRef: (element: HTMLDivElement) => () => void;
};

const SplitLine = memo(function SplitLine({
  copy,
  copyCharacterKeys,
  addCharacterRef,
}: SplitLine): React.ReactElement {
  return (
    <>
      {copy.split('').map((character: string, index: number) => {
        return character === ' ' ? (
          <span key={copyCharacterKeys[index]}> </span>
        ) : (
          <span
            key={copyCharacterKeys[index]}
            ref={addCharacterRef}
          >
            {character}
          </span>
        );
      })}
    </>
  );
});

export default SplitLine;
