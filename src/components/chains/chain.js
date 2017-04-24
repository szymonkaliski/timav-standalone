import React from 'react';
import classNames from 'classnames';
import { histogram } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { timeDay } from 'd3-time';

import { parseProject } from '../../services/google-calendar';
import { clamp, minDate, maxDate, prop } from '../../utils';

import Input from '../input';

const TICK_PX_WIDTH = 4;

const ChainGraph = ({ events, match, width, startDate, endDate }) => {
  const height = 8;
  const matchTags = parseProject(match).tags;

  const tags = events.filter(({ tags }) => {
    return matchTags.every(match => {
      const tagMatch = tags.find(({ tag }) => tag === match.tag);
      const subTagsMatch = match.subTag ? tags.find(({ subTag }) => subTag === match.subTag) : true;
      return tagMatch && subTagsMatch;
    });
  });

  const start = startDate || tags.reduce((acc, { start }) => minDate(acc, start), new Date());
  const end = endDate || tags.reduce((acc, { start }) => maxDate(acc, start), new Date());

  const histogramScale = scaleTime().domain([start, end]).nice(timeDay);
  const histogramTicks = histogramScale.ticks(timeDay, 1);

  const calculateHistogram = histogram()
    .value(prop('start'))
    .domain(histogramScale.domain())
    .thresholds(histogramTicks);

  const tagHistogram = calculateHistogram(tags);

  // we don't want lines with less than TICK_PX_WIDTH
  const targetWidth = clamp(tagHistogram.length, 0, width / TICK_PX_WIDTH);
  const clampedTagHistogram = tagHistogram.slice(-targetWidth);

  const scale = scaleTime()
    .domain([clampedTagHistogram[0].x0, clampedTagHistogram[clampedTagHistogram.length - 1].x1])
    .range([0, width]);

  return (
    <svg width={width} height={height} className="chain__graph">
      {clampedTagHistogram.map(tagBin => {
        const width = Math.floor(scale(tagBin.x1)) - Math.floor(scale(tagBin.x0));

        return (
          <rect
            key={tagBin.x0}
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

// TODO: current streak: xx day(s)
// TODO: hover with info
const Chain = ({ events, match, width, editable, startDate, endDate, onChangeMatch, onDelete }) => (
  <div className="chain">
    <div className="chain__content">
      <div className="chain__remove">
        {match && <i className="fa fa-times" onClick={onDelete} />}
      </div>
      <div className="chain__input-wrapper">
        <Input
          editable={editable !== undefined ? editable : true}
          text={match}
          onSubmit={onChangeMatch}
          formClassName="chain__input-form"
          className="chain__input"
          placeholder="Type @tag to make a graph"
        />
      </div>
      <div className="chain__graph-wrapper">
        {match &&
          <ChainGraph
            events={events}
            match={match}
            width={Math.max(0, width - 10 - 10)}
            startDate={startDate}
            endDate={endDate}
          />}
      </div>
    </div>
  </div>
);

export default Chain;
