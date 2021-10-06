import React from 'react';
import deepEqual from 'lodash.isequal';

import { PriceFormatter } from '../types';

export const FONT_SIZES = [14, 16, 18, 21, 24, 32, 42, 54];
const FITTING_EPS = 1; // in pxl, to avoid rounding issue

export interface FitValues {
  fontSize: number;
  columns: number;
  wrap?: boolean;
}

export interface CalculatingChildProps extends FitValues {
  measureRef: (element: HTMLElement) => void,
  hide: boolean,
}

interface CalculateTextLayoutProps {
  width: number;
  height: number;
  children: React.FC<CalculatingChildProps>;
  maxColumns?: number;
  onCalculated?: (values: FitValues) => void;
  textSizeDependencies?: object;
  priceFormatter?: PriceFormatter;
}

interface CalculateTextLayoutState {
  fontSizesIndex: number,
  columnsCount: number,
  wrap: boolean,
  hide: boolean,
}

class CalculateTextLayout extends React.Component<CalculateTextLayoutProps, CalculateTextLayoutState> {
  static defaultProps = {
    textSizeDependencies: {},
    maxColumns: 4,
  };

  state: CalculateTextLayoutState = {
    fontSizesIndex: 0,
    columnsCount: 1,
    wrap: true,
    hide: true,
  };

  currentBestFit: Omit<CalculateTextLayoutState, 'hide'> = null;
  didTestNoWrap = false;
  setTimeout: ReturnType<typeof setTimeout> = null;
  element: HTMLElement = null;

  componentDidMount() {
    this.calculate();
  }

  componentWillReceiveProps(nextProps: CalculateTextLayoutProps ){
    const forceRecalculate = !deepEqual(nextProps.textSizeDependencies, this.props.textSizeDependencies);
    const widthChanged = this.props.width !== nextProps.width;
    const heightChanged = this.props.height !== nextProps.height;

    if (forceRecalculate || widthChanged || heightChanged) {
      // Reset calculations.
      this.currentBestFit = null;
      this.didTestNoWrap = false;
      this.setState({
        fontSizesIndex: 0,
        columnsCount: 1,
        wrap: true,
        hide: true,
      });
    }
  }

  shouldComponentUpdate(nextProps: CalculateTextLayoutProps , nextState: CalculateTextLayoutState) {
    // Prevent recalculating if we haven't reset the calculations or aren't
    // currently calculating.
    return (
      (this.currentBestFit === null && this.state.hide) || // while calculating
      this.state.fontSizesIndex !== nextState.fontSizesIndex ||
      this.state.columnsCount !== nextState.columnsCount ||
      this.state.wrap !== nextState.wrap ||
      this.state.hide !== nextState.hide ||
      this.props.priceFormatter !== nextProps.priceFormatter
    );
  }

  componentDidUpdate() {
    // In case another update happens before we've calculated, clear the current setTimeout
    // before creating a new one.
    clearTimeout(this.setTimeout);
    this.setTimeout = setTimeout(() => {
      this.calculate();
      // set timeout duration to mimic rAF at 60 FPS
    }, 1000 / 60);
  }

  componentWillUnmount() {
    clearTimeout(this.setTimeout);
  }

  setElement = (el: HTMLElement) => {
    this.element = el;
  };

  doneCalculating() {
    const { fontSizesIndex, columnsCount, wrap } = this.state;
    this.setState({ hide: false });
    this.props.onCalculated({
      fontSize: FONT_SIZES[fontSizesIndex],
      columns: columnsCount,
      wrap,
    });
  }

  calculate() {
    if (!this.element) {
      return;
    }

    const { maxColumns } = this.props;
    const { fontSizesIndex, columnsCount, wrap } = this.state;
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = this.element;
    const fontSize = FONT_SIZES[fontSizesIndex];

    // These extra sizes are because ColumnItem margin: '-1em -1em 0 -1em'
    const doContentsFit =
      scrollWidth <= clientWidth + 2 * fontSize + FITTING_EPS &&
      scrollHeight <= clientHeight + fontSize + FITTING_EPS;
    const hasMoreFontSizesToTest = fontSizesIndex < FONT_SIZES.length - 1;
    const hasMoreColumnsToTest = columnsCount < maxColumns;

    if (!doContentsFit) {
      // When we are testing the no wrap version, don't iterate over columns again.
      if (hasMoreColumnsToTest && !this.didTestNoWrap) {
        // Test the next column at current font size.
        this.setState({ columnsCount: columnsCount + 1 });
      } else {
        // This font size cannot fit any columns, use the font size and
        // column that last fit (if it exists).
        if (this.currentBestFit) {
          // Test the no wrap version if we have not already.
          if (!this.didTestNoWrap) {
            this.didTestNoWrap = true;
            this.setState({ ...this.currentBestFit, wrap: false });
          } else {
            // We've tested the no wrap version already, revert back to the
            // wrapped version.
            this.setState(this.currentBestFit);
          }
        } else {
          // There is no best fit for the provided contents, font size and
          // columns. Done calculating. This will be the smallest font size
          // with the largest number of columns.
          this.doneCalculating();
        }
      }
    } else {
      // Save off the current best fit values
      this.currentBestFit = { fontSizesIndex, columnsCount, wrap };
      // When the contents fit and we already tried calculating the no
      // wrapped version, we are done calculating.
      if (wrap && !this.didTestNoWrap) {
        if (hasMoreFontSizesToTest) {
          // Test next largest font size at first columns index until
          // we reach a font size where no columns fit.
          this.setState({
            fontSizesIndex: fontSizesIndex + 1,
            columnsCount: 1,
          });
        } else {
          // This is the largest possible font size, test the no wrap version
          // if we have not already.
          this.didTestNoWrap = true;
          this.setState({ wrap: false });
        }
      } else {
        this.doneCalculating();
      }
    }
  }

  render() {
    const { fontSizesIndex, columnsCount, wrap, hide } = this.state;
    return this.props.children({
      measureRef: this.setElement,
      fontSize: FONT_SIZES[fontSizesIndex],
      columns: columnsCount,
      wrap,
      hide,
    });
  }
}

export default CalculateTextLayout;
