import React from 'react';

import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

// import { storeSyncToken } from './actions/app';

import Settings from './components/settings';

import appStore from './reducers';
import { getSettings } from './actions/app';

const store = createStore(appStore, applyMiddleware(thunk));

store.dispatch(getSettings());

// const App = ({ isInitied, hasToken }) => {
//   if (!isInitied) {
//     return null;
//   }

//   return hasToken ? <div>welcome</div> : <Login />;
// };

// import { getAllEvents, getCalendars } from './services/google-calendar';

// class App extends Component {
//   componentWillReceiveProps(nextProps) {
//     console.log(nextProps);

//     if (nextProps.token) {
//       // getCalendars(nextProps.token, (err, cals) => {
//       //   console.log({ err, cals });
//       // })

//       // getEvents(nextProps.token, 'primary', (err, events) => {
//       //   console.log({ err, events });
//       // });

//       // getAllEvents(nextProps.token, nextProps.syncToken, 'primary', (err, results) => {
//       //   console.log({ err, results });

//       //   if (!err && results.syncToken) {
//       //     this.props.storeSyncToken(results.syncToken);
//       //   }
//       // });
//     }
//   }

//   render() {
//     const hasToken = this.props.token !== undefined;

//     return hasToken ? <div>timav</div> : <Login />;
//   }
// }

const App = ({ isInitied }) => {
  if (!isInitied) {
    return <div>loading...</div>;
  } else {
    return <Settings />;
  }
};

const mapStateToProps = state => ({
  isInitied: state.get('isInited')
  // hasToken: state.get('token') !== undefined
  // token: state.get('token'),
  // syncToken: state.get('syncToken')
});

// const mapDispatchToProps = dispatch => bindActionCreators({ storeSyncToken }, dispatch);

const AppConnected = connect(mapStateToProps, null)(App);

const AppWithStore = () => (
  <Provider store={store}>
    <AppConnected />
  </Provider>
);

export default AppWithStore;
