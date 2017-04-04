import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { remote } from 'electron';

import { getOauth2Client, getAuthUrl, getNewToken } from '../services/google-calendar';
import { storeToken } from '../actions/app';

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

      authWindow.destroy();

      if (code) {
        getNewToken(oauth2Client, code, token => {
          this.props.storeToken(token);
        });
      } else if (error) {
        throw new Error(error);
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

const mapDispatchToProps = dispatch => bindActionCreators({ storeToken }, dispatch);

export default connect(null, mapDispatchToProps)(Login);
