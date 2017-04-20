import Measure from 'react-measure';
import autobind from 'react-autobind';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Chain from './chain';

const CHAINS_CONFIGS_MOCK = ['@health', '@health(meditation)', '@personal @writing', '@personal', '@work'];

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
    const { dimensions } = this.state;
    const { events } = this.props;

    return (
      <Measure onMeasure={this.onMeasure}>
        <div className="chains">
          {dimensions.width > 0 &&
            CHAINS_CONFIGS_MOCK.map(CONFIG_MOCK => (
              <Chain width={dimensions.width} events={events} match={CONFIG_MOCK} />
            ))}
          <Chain width={dimensions.width} events={events} />
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
