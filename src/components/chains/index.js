import React from 'react';
import { connect } from 'react-redux';
import { histogram } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { timeDay } from 'd3-time';

import { parseProject } from '../../services/google-calendar';
import { minDate, maxDate, prop } from '../../utils';

const CHAINS_CONFIGS_MOCK = ['@health', '@language(js)', '@personal', '@work'];

const Chain = ({ events, match }) => {
  // TODO: <Measure>

  const matchTags = parseProject(match).tags;

  const tags = events.filter(({ tags }) => {
    return matchTags.every(match => {
      const tagMatch = tags.find(({ tag }) => tag === match.tag);
      const subTagsMatch = match.subTag ? tags.find(({ subTag }) => subTag === match.subTag) : true;
      return tagMatch && subTagsMatch;
    });
  });

  const width = 500;
  const height = 20;

  const start = tags.reduce((acc, { start }) => minDate(acc, start), new Date());
  const end = tags.reduce((acc, { start }) => maxDate(acc, start), new Date());

  console.log('start/end tags', tags[0], tags[tags.length - 1], start, end);

  const histogramScale = scaleTime().domain([start, end]).nice(timeDay);
  const histogramTicks = histogramScale.ticks(timeDay, 1);

  console.log(histogramScale.domain())

  const calculateHistogram = histogram()
    .value(prop('start'))
    .domain(histogramScale.domain())
    .thresholds(histogramTicks);

  const tagHistogram = calculateHistogram(tags);

  // we don't want lines with less than 1px width
  const finalTagHistogram = tagHistogram.slice(-Math.min(width, tagHistogram.length));

  const scale = scaleTime()
    .domain([finalTagHistogram[0].x0, finalTagHistogram[finalTagHistogram.length - 1].x0])
    .range([0, width]);

  console.log({ finalTagHistogram, match })

  return (
    <div>
      <span style={{ width: 200, display: 'inline-block' }}>
        {match}
      </span>

      <svg width={width} height={height}>
        {finalTagHistogram.map(tagBin => {
          return (
            <rect
              x={Math.floor(scale(tagBin.x0))}
              y={0}
              width={Math.floor(width / finalTagHistogram.length)}
              height={height}
              fill={tagBin.length > 0 ? 'black' : 'white'}
            />
          );
        })}
      </svg>
    </div>
  );
};

const Chains = ({ events }) => {
  return (
    <div className="chains">
      {CHAINS_CONFIGS_MOCK.map(CONFIG_MOCK => <Chain events={events} match={CONFIG_MOCK} />)}
    </div>
  );
};

const mapStateToProps = state => {
  const events = state.get('events') ? state.get('events').valueSeq().toJS() : [];
  return { events };
};

const areStatesEqual = (a, b) => a.get('events').equals(b.get('events'));

export default connect(mapStateToProps, null, null, { areStatesEqual })(Chains);
