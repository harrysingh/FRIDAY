import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import DVUtils from 'shared/utils';

import './namespace';
import App from './app';

window.DV.user = DVUtils.getUser();

const Root = ({
  store,
  history,
}) => (
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <App />
    </ConnectedRouter>
  </Provider>
);

export default Root;
