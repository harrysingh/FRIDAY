export const SEARCH_REQ = 'Search.SEARCH_REQ';
export const SEARCH_RESULT = 'Search.SEARCH_RESULT';
export const SEARCH_ERR = 'Search.SEARCH_ERR';

export const GET_SETTINGS_REQ = 'Search.GET_SETTINGS_REQ';
export const GET_SETTINGS_RESULT = 'Search.GET_SETTINGS_RESULT';
export const GET_SETTINGS_ERR = 'Search.GET_SETTINGS_ERR';
export const UPDATE_SETTINGS_REQ = 'Search.UPDATE_SETTINGS_REQ';
export const UPDATE_SETTINGS_RESULT = 'Search.UPDATE_SETTINGS_RESULT';
export const UPDATE_SETTINGS_ERR = 'Search.UPDATE_SETTINGS_ERR';

export const searchItems = (params) => {
  return {
    method: 'POST',
    url: '/v1/search',
    type: SEARCH_REQ,
    data: params,
  };
};

export const getSettings = () => {
  return {
    method: 'GET',
    url: '/v1/settings',
    type: GET_SETTINGS_REQ,
  };
};

export const updateSettings = (settings) => {
  return {
    method: 'PUT',
    url: '/v1/settings',
    type: UPDATE_SETTINGS_REQ,
    data: settings,
  };
};
