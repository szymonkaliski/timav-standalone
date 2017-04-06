import * as db from '../services/db';
import * as googleCal from '../services/google-calendar';

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
      }
    });
  };

export const storeToken = token =>
  dispatch => {
    db.storeToken(token, err => {
      if (!err) {
        dispatch({
          type: 'STORE_TOKEN',
          payload: {
            token
          }
        });
      }
    });
  };

export const storeSyncToken = syncToken =>
  dispatch => {
    db.storeSyncToken(syncToken, err => {
      if (!err) {
        dispatch({
          type: 'STORE_SYNC_TOKEN',
          payload: {
            syncToken
          }
        });
      }
    });
  };

export const getCalendars = () =>
  (dispatch, getState) => {
    const token = getState().get('token');

    if (token) {
      googleCal.getCalendars(token.toJS(), (err, {
        items
      }) => {
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
    }
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
