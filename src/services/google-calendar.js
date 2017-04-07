import google from 'googleapis';
import googleAuth from 'google-auth-library';

import CREDENTIALS from '../../client-secret.json';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const getCalendars = (token, callback) => {
  const calendar = google.calendar('v3');

  const config = {
    auth: getOauth2Client(token)
  };

  calendar.calendarList.list(config, callback);
};

const getEvents = ({ token, pageToken, syncToken, calendarId, callback }) => {
  const calendar = google.calendar('v3');

  const config = {
    calendarId,

    auth: getOauth2Client(token),
    maxResults: 1000,
    singleEvents: true
  };

  if (pageToken) {
    config.pageToken = pageToken;
  }

  if (syncToken) {
    config.syncToken = syncToken;
  }
  // else {
  //   config.timeMin = new Date().toISOString();
  // }

  calendar.events.list(config, callback);
};

const getAllEventsInternal = ({ token, pageToken, syncToken, calendarId, allEvents, callback }) => {
  getEvents({
    token,
    pageToken,
    syncToken,
    calendarId,
    callback: (err, response) => {
      if (err) {
        return callback(err);
      }

      if (!response.nextPageToken) {
        return callback(null, {
          events: allEvents.concat(response.items),
          syncToken: response.nextSyncToken
        });
      }

      getAllEventsInternal({
        token,
        syncToken,
        calendarId,
        callback,

        pageToken: response.nextPageToken,
        allEvents: allEvents.concat(response.items)
      });
    }
  });
};

export const getAllEvents = (token, syncToken, calendarId, callback) => {
  getAllEventsInternal({ token, syncToken, calendarId, allEvents: [], callback });
};

export const getNewToken = (oauth2Client, code, callback) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      callback(err);
    }

    callback(null, token);
  });
};

export const getAuthUrl = oauth2Client => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
};

export const getOauth2Client = token => {
  const clientId = CREDENTIALS.web.client_id;
  const clientSecret = CREDENTIALS.web.client_secret;
  const redirectUrl = CREDENTIALS.web.redirect_uris[0];
  const auth = new googleAuth();

  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  if (token) {
    oauth2Client.credentials = token;
  }

  return oauth2Client;
};
