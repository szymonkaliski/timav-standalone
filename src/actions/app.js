import * as db from '../services/db';

export const initFresh = () => ({
  type: 'INIT_FRESH'
});

export const initSettings = ({ token }) => ({
  type: 'INIT_SETTINGS',
  payload: {
    token
  }
});

export const getSettings = () =>
  dispatch => {
    db.getSettings((err, settings) => {
      if (err || !settings) {
        dispatch(initFresh());
      } else {
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
