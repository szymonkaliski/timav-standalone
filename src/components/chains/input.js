import React, { Component } from 'react';
import autobind from 'react-autobind';

export default class Input extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      text: props.text !== undefined ? props.text : ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== undefined) {
      this.setState({ text: nextProps.text });
    }
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text);
    }
  }

  render() {
    const { editable } = this.props;
    const { text } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="chain__input-form">
        <input
          value={text}
          onChange={this.onChange}
          className="chain__input"
          disabled={!editable}
          placeholder="Type @tag to make a graph"
        />
      </form>
    );
  }
}
