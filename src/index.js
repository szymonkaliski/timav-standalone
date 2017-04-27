import React, { Component } from 'react';
import get from 'lodash.get';
import path from 'path';
import { Map } from 'immutable';
import { isDebug } from './utils';
import { remote, ipcRenderer } from 'electron';

import nedbPersist from 'nedb-persist';
import thunk from 'redux-thunk';
import { autoRehydrate, persistStore } from 'redux-persist-immutable';
import { compose, createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';

import reducer from './reducers';

import Chains from './components/chains';
import Projects from './components/projects';
import Settings from './components/settings';
import Sidebar from './components/sidebar';

import { refreshOauth2Token } from './services/google-calendar';
import { setToken, routeTo, resetTokenAndRelatedSettings } from './actions';

const DB_PATH = path.join(remote.app.getPath('userData'), 'timav.db');

const initialStore = Map();

const store = createStore(reducer, initialStore, compose(applyMiddleware(thunk), autoRehydrate({ log: true })));

// access store from console for debug
if (isDebug) {
  window.getStoreState = () => store.getState().toJS();
}

const ROUTES = {
  projects: Projects,
  chains: Chains,
  settings: Settings
};

class App extends Component {
  componentDidMount() {
    const { accessToken, refreshToken } = this.props;

    if (accessToken && refreshToken) {
      refreshOauth2Token({ accessToken, refreshToken }, (err, newToken) => {
        if (err) {
          console.error('refreshToken error', err);
          this.props.resetTokenAndRelatedSettings();
          this.props.routeTo('settings');
        } else {
          this.props.setToken({
            accessToken: newToken.access_token,
            refreshToken: newToken.refresh_token
          });
        }
      });
    }

    // routes from shortcuts in main app menu
    ipcRenderer.on('route', (_, page) => this.props.routeTo(page));
  }

  renderDownloadingOverlay() {
    return (
      <div className="downloading-overlay">
        <div className="downloading-overlay__text">
          Downloading events...
        </div>
      </div>
    );
  }

  render() {
    const { route, isDownloadingEvents } = this.props;
    const Component = ROUTES[get(route, 'path')];

    return (
      <div className="app">
        {isDownloadingEvents && this.renderDownloadingOverlay()}

        <Sidebar />

        <div className="content">
          {Component && <Component args={get(route, 'args')} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const route = state.get('route');

  return {
    accessToken: state.get('accessToken'),
    refreshToken: state.get('refreshToken'),
    isDownloadingEvents: state.get('isDownloadingEvents'),
    route: route ? route.toJS() : undefined
  };
};

const AppConnected = connect(mapStateToProps, { setToken, routeTo, resetTokenAndRelatedSettings })(App);

export default class AppProvider extends Component {
  constructor() {
    super();

    this.state = { isInited: false };
  }

  componentWillMount() {
    const options = { storage: nedbPersist({ filename: DB_PATH }) };

    persistStore(store, options, () => {
      this.setState({ isInited: true });
    });
  }

  render() {
    const { isInited } = this.state;

    if (!isInited) {
      return null;
    }

    return (
      <Provider store={store}>
        <AppConnected />
      </Provider>
    );
  }
}
