import React, { Component } from 'react';

import { connect } from 'react-redux';

import { getCalendars, setTrackingCalendarId } from '../../actions/app';
import Login from '../login';

class Settings extends Component {
  componentDidMount() {
    if (this.props.calendars.length === 0) {
      this.props.getCalendars();
    }
  }

  render() {
    const { calendars, trackingCalendarId } = this.props;

    return (
      <div>
        Settings
        <Login />
        {calendars.map(({ id, summary }) => (
          <div key={id} onClick={() => this.props.setTrackingCalendarId(id)}>
            {trackingCalendarId === id && '* '}{summary}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  calendars: state.get('calendars') ? state.get('calendars').toJS() : [],
  trackingCalendarId: state.get('trackingCalendarId')
});

export default connect(mapStateToProps, {
  getCalendars,
  setTrackingCalendarId
})(Settings);
