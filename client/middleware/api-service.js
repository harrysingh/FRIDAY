import _ from 'underscore';
import cookie from 'cookie';
import DVUtils from 'shared/utils';
import HTTPLib from 'shared/http-request.lib';
import Logger from 'lib/logger';

const httpRequest = new HTTPLib(Logger, {
  preRequestProcessor: (config) => {
    if (config.method === 'get') {
      config.params = _.extend({}, config.params, { _: new Date().getTime() });
    }
    return config;
  },
});

const apiService = () => next => (action) => {
  const retVal = next(action);
  if (/_REQ$/.test(action.type)) {
    const actionTypePrefix = action.type.split('_REQ')[0];
    const cookiesMap = cookie.parse(document.cookie);

    return httpRequest.request({
      url: action.url,
      method: action.method || 'GET',
      headers: _.extend({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: cookiesMap[DVUtils.FRIDAY_AUTH_TOKEN_KEY],
      }, action.headers),
      data: action.data,
      params: action.params,
    })
      .then((response) => {
        return next({
          type: `${ actionTypePrefix }_RESULT`,
          data: response.data,
        });
      })
      .catch((error) => {
        return next({
          type: `${ actionTypePrefix }_ERR`,
          error,
        });
      });
  }
  return retVal;
};

export default apiService;
