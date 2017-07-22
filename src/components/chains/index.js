import Measure from 'react-measure';
import autobind from 'react-autobind';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Chain from './chain';

import { addChain, updateChain, removeChain } from '../../actions';
import { minDate } from '../../utils';

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
    const { events, chains, addChain, updateChain, removeChain } = this.props;

    const startDate = events.reduce((acc, { start }) => minDate(acc, start), new Date());
    const endDate = new Date();

    console.log('dim', dimensions)

    return (
      <Measure onMeasure={this.onMeasure}>
        <div className="chains">
          {chains.map(([id, match]) => (
            <Chain
              key={id}
              width={dimensions.width}
              events={events}
              match={match}
              onChangeMatch={match => updateChain(id, match)}
              onDelete={() => removeChain(id)}
              startDate={startDate}
              endDate={endDate}
            />
          ))}

          <Chain width={dimensions.width} events={events} onChangeMatch={addChain} match="" />
        </div>
      </Measure>
    );
  }
}

const mapStateToProps = state => {
  const chains = state.get('chains') ? state.get('chains').entrySeq().toJS() : [];
  const events = state.get('events') ? state.get('events').valueSeq().toJS() : [];

  return { events, chains };
};

export default connect(mapStateToProps, { addChain, updateChain, removeChain })(Chains);
