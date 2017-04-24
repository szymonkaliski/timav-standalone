import Measure from 'react-measure';
import React, { Component } from 'react';
import autobind from 'react-autobind';

import Chart from './chart';
import { stringifyMilliseconds, stringifyCash } from '../../utils';

export default class Detail extends Component {
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
    const { project, currencySymbol } = this.props;

    const margin = 20;

    const width = Math.floor(dimensions.width) - margin;
    const height = Math.floor(dimensions.height) - margin;

    return (
      <div className="project-detail__content">
        <div className="project-detail__info">
          <div className="project-detail__events">
            {project.events.length} {project.events.length === 1 ? 'log' : 'logs'}
          </div>

          <div className="project-detail__duration">
            {stringifyMilliseconds(project.duration)}
          </div>

          {project.cash > 0 &&
            <div className="project-detail__cash-h">
              {stringifyCash(project.cash / (project.duration / (1000 * 60 * 60)))}{currencySymbol}/h
            </div>}

          {project.cash > 0 &&
            <div className="project-detail__cash">
              {stringifyCash(project.cash)}{currencySymbol}
            </div>}

          <div className="project-detail__name">
            {project.name}
          </div>
        </div>

        <Measure onMeasure={this.onMeasure}>
          <div className="project-detail__chart-wrapper">
            {width > 0 && <Chart width={width} height={height} project={project} currencySymbol={currencySymbol} />}
          </div>
        </Measure>
      </div>
    );
  }
}
