import { fromJS } from 'immutable';

const initialState = fromJS({
  isInited: false,
  token: undefined,
  syncToken: undefined
});

export default (state = initialState, action) => {
  if (action.type === 'INIT_SETTINGS') {
    state = state.set('isInited', true)
      .set('syncToken', action.payload.syncToken)
      .set('token', action.payload.token);
  }

  if (action.type === 'STORED_TOKEN') {
    state = state.set('token', action.payload.token);
  }

  if (action.type === 'STORED_SYNC_TOKEN') {
    state = state.set('syncToken', action.payload.syncToken);
  }

  if (action.type === 'INIT_FRESH') {
    state = state.set('isInited', true);
  }

  return state;
};
