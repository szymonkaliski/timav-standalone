import React, { Component } from 'react';
import autobind from 'react-autobind';

import { remote } from 'electron';

import { getOauth2Client, getAuthUrl, getNewToken, getEvents, getCalendars } from './services/google-calendar';

class Login extends Component {
  constructor() {
    super();
    autobind(this);
  }

  authGoogleCalendar() {
    const authWindow = new remote.BrowserWindow({
      width: 600,
      height: 400,
      show: true,
      webPreferences: {
        nodeIntegration: false
      }
    });

    const oauth2Client = getOauth2Client();

    const authUrl = getAuthUrl(oauth2Client);
    console.log(authUrl);

    authWindow.loadURL(authUrl);

    const handleCallback = url => {
      const rawCode = /code=([^&]*)/.exec(url) || null;
      const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
      const error = /\?error=(.+)$/.exec(url);

      // close the browser if code found or error
      authWindow.destroy();

      if (code) {
        getNewToken(oauth2Client, code, oauth2ClientWithToken => {
          console.log({ oauth2ClientWithToken });

          getCalendars(oauth2ClientWithToken, (err, calendars) => {
            console.log({ err, calendars });
          });

          getEvents(oauth2ClientWithToken, 'primary', (err, events) => {
            console.log({ err, events });
          });
        });
      } else if (error) {
        // TODO: display error with setState
      }
    };

    authWindow.on('close', authWindow.destroy);
    authWindow.webContents.on('will-navigate', (event, url) => handleCallback(url));
    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => handleCallback(newUrl));
  }

  render() {
    return (
      <div>
        <button onClick={this.authGoogleCalendar}>
          Authorize Google Calendar Access
        </button>
      </div>
    );
  }
}

const App = () => (
  <div>
    Timav!
    <Login />
  </div>
);

export default App;
