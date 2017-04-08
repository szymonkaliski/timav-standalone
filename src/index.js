import React, { Component } from 'react';
import path from 'path';
import { Map } from 'immutable';
import { remote } from 'electron';

import nedbPersist from 'nedb-persist';
import thunk from 'redux-thunk';
import { autoRehydrate, persistStore } from 'redux-persist-immutable';
import { compose, createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';

import reducer from './reducers';

import Settings from './components/settings';

import { refreshToken } from './services/google-calendar';
import { setToken } from './actions/app';

const DB_PATH = path.join(remote.app.getPath('userData'), 'timav.db');

const initialStore = Map();

const store = createStore(reducer, initialStore, compose(applyMiddleware(thunk), autoRehydrate({ log: true })));

class App extends Component {
  componentDidMount() {
    const { token } = this.props;

    if (token) {
      refreshToken(token, (err, newToken) => {
        if (err) {
          // TODO: remove token and route to Settings
        } else {
          this.props.setToken(newToken);
        }
      });
    }
  }

  render() {
    // const { token } = this.props;
    // if (token) {
    //   return <div>has</div>;
    // }

    return <Settings />;
  }
}

const mapStateToProps = state => ({
  token: state.get('token')
});

const AppConnected = connect(mapStateToProps, { setToken })(App);

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
