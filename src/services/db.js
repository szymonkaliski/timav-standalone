import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

const DB_PATH = path.join(remote.app.getPath('userData'), 'timav.db');

const db = new Datastore({ filename: DB_PATH, autoload: true });

export const getSettings = callback => {
  db.find({ type: 'settings' }, (err, docs) => {
    callback(err, docs && docs[0]);
  });
};

export const storeToken = (token, callback) => {
  db.update({ type: 'settings' }, { $set: { token } }, { upsert: true }, callback);
};

export const storeSyncToken = (syncToken, callback) => {
  db.update({ type: 'settings' }, { $set: { syncToken} }, { upsert: true }, callback);
};

export const storeEvents = (events, callback) => {
  // TODO: db.insert([event, event, ...], (err) => ...
};
