import * as db from '../services/db';

export const initFresh = () => ({
  type: 'INIT_FRESH'
});

export const initSettings = ({ token, syncToken }) => ({
  type: 'INIT_SETTINGS',
  payload: {
    token,
    syncToken
  }
});

export const getSettings = () =>
  dispatch => {
    db.getSettings((err, settings) => {
      if (err || !settings) {
        dispatch(initFresh());
      } else {
        console.log({ settings });
        dispatch(initSettings(settings));
      }
    });
  };

export const storedToken = token => ({
  type: 'STORED_TOKEN',
  payload: {
    token
  }
});

export const storeToken = token =>
  dispatch => {
    db.storeToken(token, err => {
      if (!err) {
        dispatch(storedToken(token));
      }
    });
  };

export const storedSyncToken = syncToken => ({
  type: 'STORED_SYNC_TOKEN',
  payload: {
    syncToken
  }
});

export const storeSyncToken = syncToken =>
  dispatch => {
    db.storeSyncToken(syncToken, err => {
      if (!err) {
        dispatch(storedSyncToken(syncToken));
      }
    });
  };
