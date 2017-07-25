import Measure from 'react-measure';
import React, { Component } from 'react';
import autobind from 'react-autobind';
import moment from 'moment';
import { connect } from 'react-redux';
import { histogram } from 'd3-array';
import { line } from 'd3-shape';
import { nest } from 'd3-collection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeDay } from 'd3-time';

import { prop, stringifyDateShort } from '../../utils';
import { GridY, GridX, AxisY, AxisX } from '../chart-utils';

const stringifyPercent = value => `${parseInt(value * 100)}%`;

const avgProp = (arr = [], key) => {
  if (!arr.length) {
    return 0;
  }

  return arr.map(prop(key)).reduce((a, b) => a + b, 0) / arr.length;
};

const FocusChart = ({ width, height, events }) => {
  const startDate = events[0].start;
  const endDate = events[events.length - 1].end;

  const margin = 26;

  const scaleX = scaleTime().domain([startDate, endDate]).range([margin, width - margin]).nice();
  const scaleY = scaleLinear().domain([0, 1]).range([height - margin, margin]).nice();

  const histogramScale = scaleTime().domain([startDate, endDate]).nice(timeDay);
  const histogramTicks = histogramScale.ticks(timeDay, 1);

  const calculateHistogram = histogram().value(prop('start')).domain(scaleX.domain()).thresholds(histogramTicks);

  const eventsHistogram = calculateHistogram(events);

  const focusHistogram = eventsHistogram
    // .slice(1, eventsHistogram.length - 1)
    .slice(1)
    .map(bin => {
      const durationTotal = bin.reduce((acc, { duration }) => acc + duration, 0);
      const durationBin = bin.length > 0 ? bin[bin.length - 1].end.getTime() - bin[0].start.getTime() : 0;

      return {
        start: bin.x0,
        end: bin.x1,
        durationTotal,
        durationPercent: durationTotal / (8 * 60 * 60 * 1000),
        durationBin,
        focusPercent: durationTotal > 0 && durationBin > 0 ? durationTotal / durationBin : 0,
        bin
      };
    });

  const nestedHistogram = nest()
    .key(d => moment(d.start).format('YYYY-MM'))
    .rollup(d => ({
      start: d[0].start,
      bins: d,
      durationPercent: avgProp(d, 'durationPercent'),
      focusPercent: avgProp(d, 'focusPercent')
    }))
    .entries(focusHistogram.filter(d => d.focusPercent > 0))
    .map(prop('value'));

  const calculatePath = key => line().x(d => scaleX(d.start)).y(d => scaleY(d[key]));
  const pathFocusPercent = calculatePath('focusPercent')(nestedHistogram);
  const pathTotalTime = calculatePath('durationPercent')(nestedHistogram);

  // TODO: add legend
  // const calcAverageProp = key => {
  //   return focusHistogram.map(prop(key)).filter(_ => _ > 0).reduce((a, b) => a + b, 0) / focusHistogram.length;
  // };

  // const averageFocusPercent = calcAverageProp('focusPercent');
  // const averageDurationPercent = calcAverageProp('durationPercent');

  // console.log({ averageFocusPercent, averageDurationPercent });

  return (
    <svg width={width} height={height} className="focus__chart">
      <path d={pathFocusPercent} className="focus__chart-path focus__chart-focus-duration-path" />
      <path d={pathTotalTime} className="focus__chart-path focus__chart-total-time-path" />

      <GridX scale={scaleX} ticks={scaleX.ticks()} height={height} className="focus__chart-grid-x-tick" />
      <GridY scale={scaleY} ticks={scaleY.ticks()} width={width} className="focus__chart-grid-y-tick" />

      <g transform={`translate(0, ${height - 6})`}>
        <AxisX
          scale={scaleX}
          ticks={scaleX.ticks(width / 80)}
          className="focus__chart-axis-x-tick"
          stringifyFn={stringifyDateShort}
        />
      </g>

      <AxisY
        scale={scaleY}
        ticks={scaleY.ticks()}
        className="focus__chart-axis-y-tick"
        stringifyFn={stringifyPercent}
      />
    </svg>
  );
};

class Focus extends Component {
  constructor() {
    super();
    autobind(this);

    this.state = {
      dimensions: {
        width: 0,
        height: 0
      }
    };
  }

  onMeasure(dimensions) {
    this.setState({ dimensions });
  }

  render() {
    const { dimensions } = this.state;
    const { events } = this.props;

    const margin = 20;

    const width = Math.floor(dimensions.width) - margin;
    const height = Math.floor(dimensions.height) - margin;

    return (
      <div className="focus__content">
        <Measure onMeasure={this.onMeasure}>
          <div className="focus__chart-wrapper">
            {width > 0 && <FocusChart width={width} height={height} events={events} />}
          </div>
        </Measure>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const events = state.get('events').valueSeq().toJS().sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });

  return { events };
};

export default connect(mapStateToProps)(Focus);
