import React from 'react';

export const GridY = ({ scale, ticks, width = 10, className }) =>
  <g>
    {ticks.map(tick => {
      const y = scale(tick);
      return <line key={tick} x1={0} x2={width} y1={y} y2={y} className={className} />;
    })}
  </g>;

export const GridX = ({ scale, ticks, height = 10, className }) =>
  <g>
    {ticks.map(tick => {
      const x = scale(tick);
      return <line key={tick} x1={x} x2={x} y1={0} y2={height} className={className} />;
    })}
  </g>;

export const AxisY = ({ scale, ticks, className, stringifyFn }) =>
  <g>
    {ticks.slice(1).map(tick => {
      const y = scale(tick);
      return (
        <text key={tick} x={0} y={y + 3} className={className}>
          {stringifyFn(tick)}
        </text>
      );
    })}
  </g>;

export const AxisX = ({ scale, ticks, className, stringifyFn }) =>
  <g>
    {ticks.map(tick => {
      const x = scale(tick);
      return (
        <text key={tick} x={x} y={0} className={className}>
          {stringifyFn(tick)}
        </text>
      );
    })}
  </g>;
