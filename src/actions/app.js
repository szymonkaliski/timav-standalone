import * as calendar from '../services/google-calendar';
import { pick } from '../utils';

export const routeTo = (path, args) => ({
  type: 'ROUTE',
  payload: {
    path,
    args
  }
});

export const setToken = token =>
  dispatch => {
    dispatch({
      type: 'SET_TOKEN',
      payload: {
        token
      }
    });

    dispatch(getCalendars());
    dispatch(getEvents());
  };

export const setSyncToken = syncToken => ({
  type: 'SET_SYNC_TOKEN',
  payload: {
    syncToken
  }
});

export const setTrackingCalendarId = calendarId =>
  dispatch => {
    dispatch({
      type: 'SET_TRACKING_CALENDAR_ID',
      payload: {
        calendarId
      }
    });

    dispatch(getEvents());
  };

export const getCalendars = () =>
  (dispatch, getState) => {
    const token = getState().get('token');

    if (!token) {
      return console.warn('Tried to getCalendars without token set');
    }

    calendar.getCalendars(token, (err, response) => {
      if (err) {
        return console.error(err);
      }

      const calendars = response.items.map(item => pick(['id', 'summary'], item));

      dispatch({
        type: 'SET_CALENDARS',
        payload: {
          calendars
        }
      });
    });
  };

export const getEvents = () =>
  (dispatch, getState) => {
    const state = getState();

    const token = state.get('token');
    const syncToken = state.get('syncToken');
    const trackingCalendarId = state.get('trackingCalendarId');

    if (!token || !trackingCalendarId) {
      return console.warn('Tried to getEvents without token or trackingCalendarId set');
    }

    console.info('Getting events from API...');

    console.time('getAllEvents');
    calendar.getAllEvents(token, syncToken, trackingCalendarId, (err, data) => {
      console.timeEnd('getAllEvents');

      if (err) {
        return console.error(err);
      }

      const { syncToken } = data;

      console.time('parseEvents');
      const events = calendar.parseEvents(data.events);
      console.timeEnd('parseEvents');

      dispatch(setSyncToken(syncToken));

      console.time('setEvents');
      dispatch({
        type: 'SET_EVENTS',
        payload: {
          new: events.new,
          removed: events.removed
        }
      });
      console.timeEnd('setEvents');
    });
  };
