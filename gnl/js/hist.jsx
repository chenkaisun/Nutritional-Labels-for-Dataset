// import PropTypes from 'prop-types';
import React from "react";
import ReactDOM from "react-dom";
import { chartTheme } from '@data-ui/theme';
import {
  Histogram,
  BarSeries,
  DensitySeries,
  XAxis,
  YAxis,
  PatternLines,
  LinearGradient,
  withScreenSize,
} from '@data-ui/histogram';

export default class Hgram extends React.Component {
  constructor(props) {
    super(props);
    console.log("hgram ctor");
    this.state = {
      isnumeric: this.props.isnumeric,
    }


  }

  render() {
    console.log("hgram render");
    if (this.state.isnumeric) {
      const ResponsiveHistogram = withScreenSize(({ screenWidth, children, ...rest }) => (
        <Histogram
          width={Math.min(1000, screenWidth / 2.5)}
          height={Math.min(1000 / 1.8, screenWidth / 2 / 1.8)}
          ariaLabel="Histogram showing ..."
          theme={chartTheme}
          {...rest}
        >
          {children}
        </Histogram>
      ));
      console.log("hgram return ");
      return (
        <ResponsiveHistogram
          ariaLabel="test"
          orientation="vertical"
          cumulative={false}
          normalized={true}
          binCount={25}
          binType="numeric"
          valueAccessor={datum => datum}
          renderTooltip={({ event, datum, data, color }) => (
            <div>
              <strong style={{ color }}>{datum.bin0} to {datum.bin1}</strong>
              <div><strong>count </strong>{datum.count}</div>
              <div><strong>cumulative </strong>{datum.cumulative}</div>
              <div><strong>density </strong>{datum.density}</div>
            </div>
          )}
        >
          <PatternLines
            id="normal"
            height={8}
            width={8}
            stroke="#fff"
            background="#e64980"
            strokeWidth={1}
            orientation={["horizontal", "vertical"]}
          />
          <BarSeries
            animated
            stroke="#e64980"
            fillOpacity={0.15}
            fill="url(#normal)"
            rawData={this.props.data}
          />
          <DensitySeries
            stroke="#e64980"
            showArea={false}
            smoothing={0.01}
            kernel="parabolic"
            rawData={this.props.data}
          />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>
      );
    } else {
      const ResponsiveHistogram = withScreenSize(({ screenWidth, children, ...rest }) => (
        <Histogram
          width={Math.min(1000, screenWidth / 2.5)}
          height={Math.min(1000 / 1.8, screenWidth / 2 / 1.8)}
          ariaLabel="Histogram showing ..."
          theme={chartTheme}
          {...rest}
        >
          {children}
        </Histogram>
      ));
      return (
        <ResponsiveHistogram
          ariaLabel="test"
          orientation="vertical"
          cumulative={false}
          normalized={true}
          binCount={25}
          binType="categorical"
          valueAccessor={datum => datum}
          renderTooltip={({ event, datum, data, color }) => (
            <div>
              <strong style={{ color }}>{datum.bin0} to {datum.bin1}</strong>
              <div><strong>count </strong>{datum.count}</div>
              <div><strong>cumulative </strong>{datum.cumulative}</div>
              <div><strong>density </strong>{datum.density}</div>
            </div>
          )}
        >
          <PatternLines
            id="categorical"
            height={8}
            width={8}
            background="#fff"
            stroke="#22b8cf"
            strokeWidth={0.5}
            orientation={["diagonal"]}
          />
          <DensitySeries
            showLine={false}
            rawData={this.props.data}
            fillOpacity={0.2}
          />
          <BarSeries
            rawData={this.props.data}
            stroke="#22b8cf"
            fill="url(#categorical)"
          />
          <XAxis />
          <YAxis />
        </ResponsiveHistogram>

      )




    }


  }
}
// Hgram.propTypes = propTypes;
// Hgram.defaultProps = defaultProps;

// Hgram;
