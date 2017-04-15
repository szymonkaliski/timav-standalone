import React, { Component } from 'react';

export default class Chart extends Component {
  render() {
    const { width, height, project } = this.props;

    console.log({ project })

    return <svg className="project-detail__chart" width={width} height={height} />
  }
}
