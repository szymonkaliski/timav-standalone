import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist-immutable/constants';

export default (state, action) => {
  if (action.type === REHYDRATE) {
    state = fromJS(action.payload);
  }

  if (action.type === 'SET_TOKEN') {
    const { accessToken, refreshToken } = action.payload;

    if (accessToken) {
      state = state.set('accessToken', accessToken);
    }

    if (refreshToken) {
      state = state.set('refreshToken', refreshToken);
    }
  }

  if (action.type === 'SET_SYNC_TOKEN') {
    state = state.set('syncToken', action.payload.syncToken);
  }

  if (action.type === 'SET_CALENDARS') {
    state = state.set('calendars', fromJS(action.payload.calendars));
  }

  if (action.type === 'SET_TRACKING_CALENDAR_ID') {
    state = state.set('trackingCalendarId', action.payload.calendarId);
  }

  if (action.type === 'SET_CASH_TAG') {
    state = state.set('cashTag', action.payload.cashTag);
  }

  if (action.type === 'SET_CURRENCY_SYMBOL') {
    state = state.set('currencySymbol', action.payload.currencySymbol);
  }

  if (action.type === 'RESET_EVENTS') {
    state = state.delete('events');
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

  if (action.type === 'ADD_CHAIN' || action.type === 'UPDATE_CHAIN') {
    state = state.setIn(['chains', action.payload.id], action.payload.match);
  }

  if (action.type === 'REMOVE_CHAIN') {
    state = state.deleteIn(['chains', action.payload.id]);
  }

  if (action.type === 'ROUTE') {
    state = state.setIn(['route', 'path'], action.payload.path).setIn(['route', 'args'], action.payload.args);
  }

  return state;
};
