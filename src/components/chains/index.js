import Measure from 'react-measure';
import React, { Component } from 'react';
import autobind from 'react-autobind';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Chain from './chain';

import { addChain, updateChain, removeChain, moveChain } from '../../actions';
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

  moveChainUp(id) {
    this.props.moveChain(id, 'UP');
  }

  moveChainDown(id) {
    this.props.moveChain(id, 'DOWN');
  }

  render() {
    const { dimensions } = this.state;
    const { events, chains, addChain, updateChain, removeChain } = this.props;

    const startDate = events.reduce((acc, { start }) => minDate(acc, start), new Date());
    const endDate = new Date();

    return (
      <Measure onMeasure={this.onMeasure}>
        <div className="chains">
          {chains.map(([id, match], i) =>
            <div key={id} className="chain__wrapper">
              <div className="chain__order-buttons">
                <i
                  onClick={() => this.moveChainUp(id)}
                  className={classNames('fa fa-angle-up chain__order-button', {
                    'chain__order-button-disabled': i === 0
                  })}
                />
                <i
                  onClick={() => this.moveChainDown(id)}
                  className={classNames('fa fa-angle-down chain__order-button', {
                    'chain__order-button-disabled': i === chains.length - 1
                  })}
                />
              </div>

              <Chain
                key={id}
                width={dimensions.width - 24}
                events={events}
                match={match}
                onChangeMatch={match => updateChain(id, match)}
                onDelete={() => removeChain(id)}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}

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

export default connect(mapStateToProps, { addChain, updateChain, removeChain, moveChain })(Chains);
