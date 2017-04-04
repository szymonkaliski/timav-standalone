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

export const getEvents = (token, calendarId, callback) => {
  const calendar = google.calendar('v3');

  const config = {
    auth: getOauth2Client(token),
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime'
  };

  calendar.events.list(config, callback);
};

export const getNewToken = (oauth2Client, code, callback) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      throw new Error('Error while trying to retrieve access token', err);
    }

    callback(token);
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
