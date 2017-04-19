import Measure from 'react-measure';
import autobind from 'react-autobind';
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { histogram } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { timeDay } from 'd3-time';

import { parseProject } from '../../services/google-calendar';
import { clamp, minDate, maxDate, prop } from '../../utils';

import Input from './input';

const CHAINS_CONFIGS_MOCK = ['@health', '@health(meditation)', '@personal @writing', '@personal', '@work'];

const ChainGraph = ({ events, match, width }) => {
  const height = 8;
  const matchTags = parseProject(match).tags;

  const tags = events.filter(({ tags }) => {
    return matchTags.every(match => {
      const tagMatch = tags.find(({ tag }) => tag === match.tag);
      const subTagsMatch = match.subTag ? tags.find(({ subTag }) => subTag === match.subTag) : true;
      return tagMatch && subTagsMatch;
    });
  });

  const start = tags.reduce((acc, { start }) => minDate(acc, start), new Date());
  const end = tags.reduce((acc, { start }) => maxDate(acc, start), new Date());

  const histogramScale = scaleTime().domain([start, end]).nice(timeDay);
  const histogramTicks = histogramScale.ticks(timeDay, 1);

  const calculateHistogram = histogram()
    .value(prop('start'))
    .domain(histogramScale.domain())
    .thresholds(histogramTicks);

  const tagHistogram = calculateHistogram(tags);

  // we don't want lines with less than 1px width
  const targetWidth = clamp(tagHistogram.length, 0, width);
  const finalTagHistogram = tagHistogram.slice(-targetWidth);

  const scale = scaleTime()
    .domain([finalTagHistogram[0].x0, finalTagHistogram[finalTagHistogram.length - 1].x1])
    .range([0, width]);

  return (
    <svg width={width} height={height} className="chain__graph">
      {finalTagHistogram.map(tagBin => {
        const width = Math.floor(scale(tagBin.x1)) - Math.floor(scale(tagBin.x0));

        return (
          <rect
            x={Math.floor(scale(tagBin.x0))}
            y={0}
            width={width}
            height={height}
            className={classNames('chain__graph-bar', {
              'chain__graph-bar--filled': tagBin.length > 0
            })}
          />
        );
      })}
    </svg>
  );
};

const Chain = ({ events, match, width, editable }) => {
  return (
    <div className="chain">
      <div className="chain__input-wrapper">
        <Input
          editable={editable !== undefined ? editable : true}
          text={match}
          onSubmit={text => {
            console.log({ text });
          }}
        />
      </div>
      <div className="chain__graph-wrapper">
        <ChainGraph events={events} match={match} width={width - 200 - 4} />
      </div>
    </div>
  );
};

class Chains extends Component {
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
    const { events } = this.props;
    const { dimensions } = this.state;

    return (
      <Measure onMeasure={this.onMeasure}>
        <div className="chains">
          {dimensions.width > 0 && CHAINS_CONFIGS_MOCK.map(CONFIG_MOCK => (
            <Chain width={dimensions.width} events={events} match={CONFIG_MOCK} />
          ))}
        </div>
      </Measure>
    );
  }
}

const mapStateToProps = state => {
  const events = state.get('events') ? state.get('events').valueSeq().toJS() : [];
  return { events };
};

const areStatesEqual = (a, b) => a.get('events').equals(b.get('events'));

export default connect(mapStateToProps, null, null, { areStatesEqual })(Chains);
