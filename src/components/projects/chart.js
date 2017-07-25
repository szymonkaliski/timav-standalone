import React from 'react';
import { area, curveStepAfter } from 'd3-shape';
import { histogram } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeDay, timeWeek, timeMonth } from 'd3-time';
import { get } from 'lodash';

import { prop, stringifyMilliseconds, stringifyDateShort, stringifyCash } from '../../utils';
import { GridY, GridX, AxisY, AxisX } from '../chart-utils';

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

const Markers = ({ scale, height, project, currencySymbol }) => {
  const events = project.events.filter(prop('isMarker'));

  return (
    <g>
      {events.map(event => {
        const x = scale(event.start);
        const cash = get(event, ['tags', 0, 'cash']);

        return (
          <g key={event.id} transform={`translate(${x}, 26)`}>
            <line x1={0} x2={0} y1={0} y2={height - 26 - 26} className="project-detail__chart-marker" />
            <text x={4} y={-6} className="project-detail__chart-marker-text">
              {stringifyDateShort(event.start)}
              {event.note && `: ${event.note}`}
              {cash && `: ${stringifyCash(cash)}${currencySymbol}`}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const Chart = ({ width, height, project, currencySymbol }) => {
  const margin = 26;

  const timeScale = spreadToTimeScale(project);

  const endDate = new Date(project.end);
  endDate.setDate(endDate.getDate() + 1);

  const scaleX = scaleTime().domain([project.start, endDate]).range([margin, width - margin]).nice();
  const ticks = scaleX.ticks(timeScale, 1);

  const calculateHistogram = histogram().value(prop('start')).domain(scaleX.domain()).thresholds(ticks);

  const bins = calculateHistogram(project.events.filter(event => !event.isMarker)).map(bin => ({
    ...bin,
    duration: bin.reduce((acc, event) => acc + event.duration, 0)
  }));

  const scaleY = scaleLinear()
    .domain([0, Math.max(...bins.map(prop('duration')))])
    .range([height - margin, margin])
    .nice();

  const calculatePath = area()
    .x((d, i) => scaleX(i === 0 ? d.x0 : d.x1))
    .y(d => scaleY(d.duration))
    .curve(curveStepAfter);

  const path = calculatePath(bins);

  return (
    <svg className="project-detail__chart" width={width} height={height}>
      <path d={path} className="project-detail__chart-path" />
      <Markers scale={scaleX} height={height} project={project} currencySymbol={currencySymbol} />

      <GridX scale={scaleX} ticks={ticks} height={height} className="project-detail__chart-grid-x-tick" />
      <GridY scale={scaleY} ticks={scaleY.ticks()} width={width} className="project-detail__chart-grid-y-tick" />

      <g transform={`translate(0, ${height - 6})`}>
        <AxisX
          scale={scaleX}
          ticks={scaleX.ticks(width / 80)}
          className="project-detail__chart-axis-x-tick"
          stringifyFn={stringifyDateShort}
        />
      </g>

      <AxisY
        scale={scaleY}
        ticks={scaleY.ticks()}
        className="project-detail__chart-axis-y-tick"
        stringifyFn={stringifyMilliseconds}
      />
    </svg>
  );
};

export default Chart;
