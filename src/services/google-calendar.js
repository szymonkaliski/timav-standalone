import google from 'googleapis';
import googleAuth from 'google-auth-library';
import { flatten } from '../utils.js';

import CREDENTIALS from '../../client-secret.json';

const FULL_DAY_EVENT_DATE_LENGTH = 'yyyy-mm-dd'.length;
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const getCalendars = (tokens, callback) => {
  const calendar = google.calendar('v3');

  const config = {
    auth: getOauth2Client(tokens)
  };

  calendar.calendarList.list(config, callback);
};

const getEvents = ({ tokens, pageToken, syncToken, calendarId, callback }) => {
  const calendar = google.calendar('v3');

  const config = {
    calendarId,

    auth: getOauth2Client(tokens),
    maxResults: 1000,
    singleEvents: true
  };

  if (pageToken) {
    config.pageToken = pageToken;
  }

  if (syncToken) {
    config.syncToken = syncToken;
  }

  calendar.events.list(config, callback);
};

const getAllEventsInternal = ({ tokens, pageToken, syncToken, calendarId, allEvents, callback }) => {
  getEvents({
    tokens,
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
        tokens,
        syncToken,
        calendarId,
        callback,

        pageToken: response.nextPageToken,
        allEvents: allEvents.concat(response.items)
      });
    }
  });
};

export const getAllEvents = (tokens, syncToken, calendarId, callback) => {
  getAllEventsInternal({ tokens, syncToken, calendarId, allEvents: [], callback });
};

export const getNewToken = (oauth2Client, code, callback) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      callback(err);
    }

    callback(null, token);
  });
};

export const refreshOauth2Token = (tokens, callback) => {
  getOauth2Client(tokens).refreshAccessToken(callback);
};

export const getAuthUrl = oauth2Client => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
};

export const getOauth2Client = ({ accessToken, refreshToken } = {}) => {
  const clientId = CREDENTIALS.web.client_id;
  const clientSecret = CREDENTIALS.web.client_secret;
  const redirectUrl = CREDENTIALS.web.redirect_uris[0];
  const auth = new googleAuth();

  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.credentials = {
    ...(accessToken ? { access_token: accessToken } : undefined),
    ...(refreshToken ? { refresh_token: refreshToken } : undefined)
  };

  return oauth2Client;
};

const parseTitle = title => {
  const project = title.split('@')[0].trim();
  const tags = flatten(
    title.split('@').slice(1).map(tag => {
      if (tag.indexOf('(') >= 0) {
        const tagName = tag.match(/(.+)\(/)[1];
        const subTags = tag.match(/\((.+)(,|\))/)[1];

        return subTags.split(',').map(subTag => ({ tag: tagName, subTag }));
      } else {
        return { tag: tag.trim() };
      }
    })
  );

  return { project, tags };
};

export const parseEvent = event => {
  // full-day events become markers
  const isMarker = event.start.date &&
    event.end.date &&
    event.start.date.length === FULL_DAY_EVENT_DATE_LENGTH &&
    event.end.date.length === FULL_DAY_EVENT_DATE_LENGTH;

  const start = new Date(event.start.dateTime || event.start.date);
  const end = new Date(event.end.dateTime || event.end.date);

  const duration = !isMarker ? end - start : 0;
  const id = event.id;
  const note = event.description;

  const { project, tags } = parseTitle(event.summary);

  return {
    duration,
    end,
    id,
    isMarker,
    note,
    project,
    start,
    tags
  };
};

export const parseEvents = events => ({
  new: events.filter(({ status }) => status === 'confirmed').reduce((acc, event) => {
    const parsed = parseEvent(event);
    acc[parsed.id] = parsed;
    return acc;
  }, {}),

  removed: events.filter(({ status }) => status === 'cancelled').map(({ id }) => id)
});
