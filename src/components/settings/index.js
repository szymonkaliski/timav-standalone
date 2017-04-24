import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getCalendars, setTrackingCalendarId, setCashTag, setCurrencySymbol } from '../../actions';

import Input from '../input';
import Login from '../login';

class Settings extends Component {
  componentDidMount() {
    if (this.props.calendars.length === 0) {
      this.props.getCalendars();
    }
  }

  render() {
    const { calendars, trackingCalendarId, cashTag, currencySymbol } = this.props;

    return (
      <div className="settings">
        Settings

        <Login />

        <div className="settings__calendars">
          {calendars.map(({ id, summary }) => (
            <div className="settings__calendar" key={id} onClick={() => this.props.setTrackingCalendarId(id)}>
              {trackingCalendarId === id && '* '}{summary}
            </div>
          ))}
        </div>

        <Input
          text={cashTag}
          onSubmit={this.props.setCashTag}
          formClassName="settings__input-form-cash"
          className="settings__input-cash"
          placeholder="@tag for cash"
        />

        <Input
          text={currencySymbol}
          onSubmit={this.props.setCurrencySymbol}
          formClassName="settings__input-form-cash"
          className="settings__input-cash"
          placeholder="currency symbold for cash"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  calendars: state.get('calendars') ? state.get('calendars').toJS() : [],
  trackingCalendarId: state.get('trackingCalendarId'),
  cashTag: state.get('cashTag'),
  currencySymbol: state.get('currencySymbol')
});

export default connect(mapStateToProps, {
  getCalendars,
  setTrackingCalendarId,
  setCashTag,
  setCurrencySymbol
})(Settings);
