import React from 'react';
import classNames from 'classnames';
import { histogram } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { timeDay } from 'd3-time';

import { parseProject } from '../../services/google-calendar';
import { clamp, minDate, maxDate, prop } from '../../utils';

import Input from './input';

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

const Chain = ({ events, match, width, editable, onChangeMatch, onDelete }) => {
  return (
    <div className="chain">
      <div className="chain__input-wrapper">
        <Input editable={editable !== undefined ? editable : true} text={match} onSubmit={onChangeMatch} />
      </div>
      <div className="chain__graph-wrapper">
        {match && <ChainGraph events={events} match={match} width={Math.max(0, width - 200 - 4 - 16)} />}
      </div>
      <div className="chain__remove">
        {match && <i className="fa fa-times" onClick={onDelete} />}
      </div>
    </div>
  );
};

export default Chain;
