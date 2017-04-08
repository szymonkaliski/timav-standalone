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
    state = state.set('trackingCalendarId', action.payload.calendarId);
  }

  if (action.type === 'SET_EVENTS') {
    state = state.set('events', fromJS(action.payload.events));
  }

  console.log(state.toJS(), action)

  return state;
};
