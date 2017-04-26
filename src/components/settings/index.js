import React, { Component } from 'react';
import classNames from 'classnames';
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

  renderCalendars() {
    const { calendars, trackingCalendarId } = this.props;

    if (calendars.length === 0) {
      return null;
    }

    return (
      <div className="settings__calendars">
        <div className="settings__info">
          Select calendar with tracking data
        </div>

        {calendars.map(({ id, summary }) => (
          <div
            className={classNames('settings__calendar', {
              'settings__calendar-active': trackingCalendarId === id
            })}
            key={id}
            onClick={() => this.props.setTrackingCalendarId(id)}
          >
            {summary}
          </div>
        ))}
      </div>
    );
  }

  renderCashSettings() {
    const { accessToken, cashTag, currencySymbol } = this.props;

    if (!accessToken) {
      return null;
    }

    return (
      <div className="settings__cash">
        <div className="settings__info">
          Set cash-related info
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

  render() {
    const { accessToken } = this.props;

    return (
      <div className="settings__wrapper">
        <div className="settings">
          {!accessToken && <Login />}

          {this.renderCashSettings()}
          {this.renderCalendars()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.get('accessToken'),
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
