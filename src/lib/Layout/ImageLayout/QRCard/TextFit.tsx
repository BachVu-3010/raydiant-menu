import React from 'react';

import * as Styles from './TextFit.styles';

interface OverflowState {
  overflowVertical: boolean;
  overflowHorizontal: boolean;
}

interface TextFitProps {
  maxFontSize?: number;
  minFontSize?: number;
  step?: number;
  onCalculated?: (overflow: OverflowState) => void;
}

export const getOverflow = (ref: React.RefObject<HTMLDivElement>): OverflowState => {
  if (!ref.current) {
    return { overflowVertical: false, overflowHorizontal: false };
  }

  const { scrollWidth, scrollHeight, clientWidth, clientHeight } = ref.current;
  return {
    overflowVertical: scrollHeight > clientHeight,
    overflowHorizontal: scrollWidth > clientWidth,
  };
};

const TextFit: React.FC<TextFitProps> = ({ maxFontSize, minFontSize, step, onCalculated, children }) => {
  const [fontSize, setFontSize] = React.useState(maxFontSize);
  const [calculating, setCalculating] = React.useState(false);

  React.useEffect(() => {
    setFontSize(maxFontSize);
    setCalculating(true);
  }, [children, maxFontSize]);

  const ref = React.useRef(null);

  React.useEffect(() => {
    if (calculating) {
      const nextFontSize = fontSize - step;
      // In Menus, we don't need to shrink the text if it exceeds the height
      const overflows = getOverflow(ref);

      if (!overflows.overflowHorizontal || nextFontSize < minFontSize) {
        setCalculating(false);
        onCalculated(overflows);
      } else {
        setFontSize(nextFontSize);
      }
    }
  }, [calculating, fontSize, minFontSize, step, ref, onCalculated]);

  return (
    <Styles.TextContent ref={ref} elFontSize={fontSize} calculating={calculating}>
      {children}
    </Styles.TextContent>
  );
};

TextFit.defaultProps = {
  maxFontSize: 100,
  minFontSize: 1,
  step: 1,
  onCalculated: () => null,
};

export default TextFit;
