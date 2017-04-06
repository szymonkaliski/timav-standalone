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

const makeSettingsStorer = key =>
  (item, callback) => db.update({ type: 'settings' }, { $set: { [key]: item } }, { upsert: true }, callback);

export const storeToken = makeSettingsStorer('token');
export const storeSyncToken = makeSettingsStorer('syncToken');
export const storeCalendars = makeSettingsStorer('calendars');
export const storeTrackingCalendarId = makeSettingsStorer('trackingCalendarId');

// export const storeEvents = (events, callback) => {
//   // TODO: db.insert([event, event, ...], (err) => ...
// };
