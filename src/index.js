import React from 'react';

import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Login from './components/login';

import appStore from './reducers';
import { getSettings } from './actions/app';

const store = createStore(appStore, applyMiddleware(thunk));

store.dispatch(getSettings());

const App = ({ isInitied, hasToken }) => {
  if (!isInitied) {
    return null;
  }

  return hasToken ? <div>welcome</div> : <Login />;
};

const mapStateToProps = state => ({
  isInitied: state.get('isInited'),
  hasToken: state.get('token') !== undefined
});

const AppConnected = connect(mapStateToProps)(App);

const AppWithStore = () => (
  <Provider store={store}>
    <AppConnected />
  </Provider>
);

export default AppWithStore;
