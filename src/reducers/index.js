import { fromJS } from 'immutable';

const initialState = fromJS({
  isInited: false,
  token: undefined,
  syncToken: undefined,
  trackingCalendarId: undefined,
  calendars: []
});

export default (state = initialState, action) => {
  if (action.type === 'INIT_WITH_SETTINGS') {
    state = state.set('isInited', true).merge(fromJS(action.payload));
  }

  if (action.type === 'INIT_FRESH') {
    state = state.set('isInited', true);
  }

  if (action.type === 'STORE_TOKEN') {
    state = state.set('token', fromJS(action.payload.token));
  }

  if (action.type === 'STORE_SYNC_TOKEN') {
    state = state.set('syncToken', action.payload.syncToken);
  }

  if (action.type === 'SET_CALENDARS') {
    state = state.set('calendars', fromJS(action.payload.calendars));
  }

  if (action.type === 'SET_TRACKING_CALENDAR_ID') {
    state = state.set('trackingCalendarId', action.payload.calendarId);
  }

  console.log('store', state.toJS());

  return state;
};
