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
    this.setState({ text: e.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.text);
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text);
    }
  }

  render() {
    const { editable, formClassName, className, placeholder } = this.props;
    const { text } = this.state;

    return (
      <form onSubmit={this.onSubmit} className={formClassName}>
        <input
          value={text}
          onChange={this.onChange}
          onBlur={this.onSubmit}
          className={className}
          disabled={editable === undefined ? false : !editable}
          placeholder={placeholder}
        />
      </form>
    );
  }
}
