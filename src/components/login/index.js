import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { remote } from 'electron';

import { getOauth2Client, getAuthUrl, getNewToken } from '../../services/google-calendar';
import { setToken } from '../../actions';

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

    console.log({ authUrl });

    authWindow.loadURL(authUrl);

    const handleCallback = url => {
      // allow navigating to other google-related pages
      if (url.indexOf('accounts.google') >= 0) {
        return;
      }

      const rawCode = /code=([^&]*)/.exec(url) || null;
      const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
      const err = /\?error=(.+)$/.exec(url);

      authWindow.destroy();

      if (code) {
        getNewToken(oauth2Client, code, (err, token) => {
          if (err) {
            // TODO: handle error
            return console.error(err);
          }

          if (!token) {
            return console.warn('No token?');
          }

          this.props.setToken({ accessToken: token.access_token, refreshToken: token.refresh_token });
        });
      } else if (err) {
        // TODO: handle error
        return console.error(err);
      }
    };

    authWindow.on('close', authWindow.destroy);
    authWindow.webContents.on('will-navigate', (event, url) => handleCallback(url));
    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => handleCallback(newUrl));
  }

  render() {
    return (
      <div className="login__wrapper">
        <div className="login__button" onClick={this.authGoogleCalendar}>
          Login to Google Calendar
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ setToken }, dispatch);

export default connect(null, mapDispatchToProps)(Login);
