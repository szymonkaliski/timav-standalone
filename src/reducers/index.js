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

  if (action.type === 'RESET_TOKEN_AND_RELATED_SETTINGS') {
    state = state
      .delete('accessToken')
      .delete('refreshToken')
      .delete('syncToken')
      .delete('trackingCalendarId')
      .delete('isDownloadingEvents')
      .delete('calendars');
  }

  if (action.type === 'SET_CASH_TAG') {
    state = state.set('cashTag', action.payload.cashTag);
  }

  if (action.type === 'SET_CURRENCY_SYMBOL') {
    state = state.set('currencySymbol', action.payload.currencySymbol);
  }

  if (action.type === 'RESET_EVENTS') {
    state = state.delete('isDownloadingEvents').delete('syncToken').delete('events');
  }

  if (action.type === 'EVENTS_DOWNLOAD_STARTED') {
    state = state.set('isDownloadingEvents', true);
  }

  if (action.type === 'SET_EVENTS') {
    const newEvents = fromJS(action.payload.new);
    const removedEvents = action.payload.removed;

    state = state
      .update('events', events => {
        if (!events) {
          return newEvents;
        }

        // remove removed events by id
        events = removedEvents.reduce((acc, id) => events.delete(id), events);

        // merge with new events from sync
        events = events.merge(newEvents);

        return events;
      })
      .set('isDownloadingEvents', false);
  }

  if (action.type === 'ADD_CHAIN' || action.type === 'UPDATE_CHAIN') {
    const { match } = action.payload;

    if (match && match.length > 0) {
      state = state.setIn(['chains', action.payload.id], match);
    }
  }

  if (action.type === 'REMOVE_CHAIN') {
    state = state.deleteIn(['chains', action.payload.id]);
  }

  if (action.type === 'MOVE_CHAIN') {
    // to move chain just swap it with neighbour one

    const chainsSeq = state.get('chains').entrySeq();
    const index = chainsSeq.findIndex(chain => chain[0] === action.payload.id);
    const swapTo = chainsSeq.get(index + (action.payload.direction === 'UP' ? -1 : 1));
    const swapFrom = state.getIn(['chains', action.payload.id]);

    state = state
      .setIn(['chains', swapTo[0]], swapFrom)
      .setIn(['chains', action.payload.id], swapTo[1]);
  }

  if (action.type === 'ROUTE') {
    state = state.setIn(['route', 'path'], action.payload.path).setIn(['route', 'args'], action.payload.args);
  }

  return state;
};
