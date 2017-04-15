import React from 'react';
import { area, curveStepBefore } from 'd3-shape';
import { histogram } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeDay, timeWeek, timeMonth } from 'd3-time';

import { prop } from '../../utils';

const durationInDays = duration => Math.ceil(duration / (1000 * 60 * 60) / 24);

const spreadToTimeScale = ({ start, end }) => {
  const days = durationInDays(end - start);

  if (days < 2 * 30) {
    return timeDay;
  } else if (days < 12 * 30) {
    return timeWeek;
  } else {
    return timeMonth;
  }
};

const AxisX = ({ scale, ticks, height = 10 }) => {
  return (
    <g>
      {ticks.map(tick => {
        const x = scale(tick);
        return <line x1={x} x2={x} y1={-height / 2} y2={height / 2} stroke="red"/>;
      })}
    </g>
  );
};

const Chart = ({ width, height, project }) => {
  console.log({ project });

  const timeScale = spreadToTimeScale(project);

  const scaleX = scaleTime().domain([project.start, project.end]).range([0, width]).nice(timeScale, 1);
  const ticks = scaleX.ticks(timeScale, 1);

  const calculateHistogram = histogram().value(d => d.start).domain(scaleX.domain()).thresholds(ticks);

  const bins = calculateHistogram(project.events.filter(event => !event.isMarker)).map(bin => ({
    ...bin,
    duration: bin.reduce((acc, event) => acc + event.duration, 0)
  }));

  const scaleY = scaleLinear().domain([0, Math.max(...bins.map(prop('duration')))]).range([height - 20, 0]);

  const calculatePath = area()
    .x((d, i) => scaleX(i === 0 ? d.x0 : d.x1))
    .y(d => scaleY(d.duration))
    .curve(curveStepBefore);

  const path = calculatePath(bins);

  return (
    <svg className="project-detail__chart" width={width} height={height}>
      <path d={path} stroke="#EEE" />

      <g transform={`translate(0, ${height - 10})`}>
        <AxisX scale={scaleX} ticks={ticks} />
      </g>
    </svg>
  );
};

export default Chart;
