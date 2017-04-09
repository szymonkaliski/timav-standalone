import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist-immutable/constants';

export default (state, action) => {
  if (action.type === REHYDRATE) {
    state = fromJS(action.payload);
  }

  if (action.type === 'SET_TOKEN') {
    state = state.set('token', action.payload.token);
  }

  if (action.type === 'SET_SYNC_TOKEN') {
    state = state.set('syncToken', action.payload.syncToken);
  }

  if (action.type === 'SET_CALENDARS') {
    state = state.set('calendars', fromJS(action.payload.calendars));
  }

  if (action.type === 'SET_TRACKING_CALENDAR_ID') {
    // TODO: if different tracking calendar id set then clear events and sync token for fresh re-sync
    state = state.set('trackingCalendarId', action.payload.calendarId);
  }

  if (action.type === 'SET_EVENTS') {
    const newEvents = fromJS(action.payload.new);
    const removedEvents = action.payload.removed;

    state = state.update('events', events => {
      if (!events) {
        return newEvents;
      }

      // remove removed events by id
      events = removedEvents.reduce((acc, id) => events.delete(id), events);

      // merge with new events from sync
      events = events.merge(newEvents);

      return events;
    });
  }

  if (action.type === 'ROUTE') {
    state = state.setIn(['route', 'path'], action.payload.path).setIn(['route', 'args'], action.payload.args);
  }

  return state;
};
