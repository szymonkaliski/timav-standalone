import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const render = () => {
  const App = require('../src').default;

  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  );
};

const reloadCSS = () => {
  const linkHref = document.querySelector('link').href;
  document.querySelector('link').href = `${linkHref}?t=${new Date().getTime()}`;
};

render();

if (module.hot) {
  module.hot.accept(render);
  module.hot.accept(reloadCSS);
}
