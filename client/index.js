import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import configureStore from 'lib/configure-store';

import Root from './root';

const history = createHistory();
const store = configureStore(history, {});

const init = (App) => {
  render(
    <AppContainer>
      <App store={ store } history={ history } />
    </AppContainer>,
    document.getElementById('dv-ui'),
  );
};

if (module.hot) {
  module.hot.accept('./Root', () => {
    init(Root);
  });
}

init(Root);
