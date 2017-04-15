import Measure from 'react-measure';
import React, { Component } from 'react';
import autobind from 'react-autobind';

import Chart from './chart';

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
    const { project } = this.props;

    const width = Math.floor(dimensions.width);
    const height = Math.floor(dimensions.height);

    return (
      <Measure onMeasure={this.onMeasure}>
        <div className="project-detail__chart-wrapper">
          {width > 0 && height > 0 && <Chart width={width} height={height} project={project} />}
        </div>
      </Measure>
    );
  }
}
