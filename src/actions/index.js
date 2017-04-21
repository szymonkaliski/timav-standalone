import uuid from 'uuid';

import * as calendar from '../services/google-calendar';
import { pick } from '../utils';

export const routeTo = (path, args) => ({
  type: 'ROUTE',
  payload: {
    path,
    args
  }
});

export const setToken = ({ accessToken, refreshToken }) => dispatch => {
  dispatch({
    type: 'SET_TOKEN',
    payload: {
      accessToken,
      refreshToken
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

export const setTrackingCalendarId = calendarId => dispatch => {
  dispatch({
    type: 'SET_TRACKING_CALENDAR_ID',
    payload: {
      calendarId
    }
  });

  dispatch(getEvents());
};

export const getCalendars = () => (dispatch, getState) => {
  const accessToken = getState().get('accessToken');

  if (!accessToken) {
    return console.warn('Tried to getCalendars without accessToken set');
  }

  calendar.getCalendars({ accessToken }, (err, response) => {
    if (err) {
      return console.error(err);
    }

    const calendars = response.items.map(pick(['id', 'summary']));

    dispatch({
      type: 'SET_CALENDARS',
      payload: {
        calendars
      }
    });
  });
};

export const getEvents = () => (dispatch, getState) => {
  const state = getState();

  const accessToken = state.get('accessToken');
  const syncToken = state.get('syncToken');
  const trackingCalendarId = state.get('trackingCalendarId');

  if (!accessToken || !trackingCalendarId) {
    return console.warn('Tried to getEvents without accessToken or trackingCalendarId set');
  }

  console.info('Getting events from API...');

  console.time('getAllEvents');
  calendar.getAllEvents({ accessToken }, syncToken, trackingCalendarId, (err, data) => {
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

export const addChain = match => ({
  type: 'ADD_CHAIN',
  payload: {
    id: uuid.v4(),
    match
  }
});

export const updateChain = (id, match) => ({
  type: 'UPDATE_CHAIN',
  payload: {
    id,
    match
  }
});

export const removeChain = id => ({
  type: 'REMOVE_CHAIN',
  payload: {
    id
  }
});
