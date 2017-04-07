import * as db from '../services/db';
import * as calendar from '../services/google-calendar';

// TODO: rethink action -> db store -> redux store...

const pick = (fields, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (fields.indexOf(key) >= 0) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {}
  );
};

const omit = (fields, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (fields.indexOf(key) < 0) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {}
  );
};

export const getSettings = () =>
  dispatch => {
    db.getSettings((err, settings) => {
      if (err || !settings) {
        dispatch({
          type: 'INIT_FRESH'
        });
      } else {
        dispatch({
          type: 'INIT_WITH_SETTINGS',
          payload: omit(['_id', 'type'], settings)
        });

        dispatch(getEvents());
      }
    });
  };

export const storeToken = token =>
  dispatch => {
    db.storeToken(token, err => {
      if (err) {
        return;
      }

      dispatch({
        type: 'STORE_TOKEN',
        payload: {
          token
        }
      });

      dispatch(getCalendars());
    });
  };

export const storeSyncToken = syncToken =>
  dispatch => {
    db.storeSyncToken(syncToken, err => {
      if (err) {
        return;
      }

      dispatch({
        type: 'STORE_SYNC_TOKEN',
        payload: {
          syncToken
        }
      });
    });
  };

export const getCalendars = () =>
  (dispatch, getState) => {
    const token = getState().get('token');

    if (!token) {
      return;
    }

    calendar.getCalendars(token.toJS(), (err, { items }) => {
      if (!err) {
        const calendars = items.map(item => pick(['id', 'summary'], item));

        db.storeCalendars(calendars, () => {
          dispatch({
            type: 'SET_CALENDARS',
            payload: {
              calendars
            }
          });
        });
      }
    });
  };

export const setTrackingCalendarId = calendarId =>
  dispatch => {
    db.storeTrackingCalendarId(calendarId, () => {
      dispatch({
        type: 'SET_TRACKING_CALENDAR_ID',
        payload: { calendarId }
      });
    });
  };

export const storeEvents = events =>
  dispatch => {
    db.storeEvents(events, () => {
      dispatch({
        type: 'SET_EVENTS',
        payload: { events }
      });
    });
  };

export const getEvents = () =>
  (dispatch, getState) => {
    const state = getState();

    const token = state.get('token').toJS();
    const syncToken = state.get('syncToken');
    const trackingCalendarId = state.get('trackingCalendarId');

    if (!token || !trackingCalendarId) {
      return;
    }

    console.log('getEvents', { token, syncToken });

    calendar.getAllEvents(token, syncToken, trackingCalendarId, (err, data) => {
      const events = data.events.map(event => ({
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        text: event.summary // TODO: parse into project and tags...
      }));

      console.log('getAllEvents', { data });

      if (data.syncToken) {
        dispatch(storeSyncToken(data.syncToken));
      }

      dispatch(storeEvents(events));
    });
  };
