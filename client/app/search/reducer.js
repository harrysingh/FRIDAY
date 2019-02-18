import { REQ_RESULT } from 'shared/enum';

import {
  SEARCH_REQ,
  SEARCH_RESULT,
  SEARCH_ERR,
  GET_SETTINGS_REQ,
  GET_SETTINGS_RESULT,
  GET_SETTINGS_ERR,
  UPDATE_SETTINGS_REQ,
  UPDATE_SETTINGS_RESULT,
  UPDATE_SETTINGS_ERR,
} from './actions';

export default (state = {
  fetching: false,
  total: 0,
  items: [],
  settings: {},
  get_action: REQ_RESULT.INITIALIZED,
  save_action: REQ_RESULT.INITIALIZED,
  errorMessage: null,
}, action) => {
  switch (action.type) {
    case SEARCH_REQ:
      return {
        ...state,
        fetching: true,
        errorMessage: null,
        get_action: REQ_RESULT.INITIALIZED,
        save_action: REQ_RESULT.INITIALIZED,
      };
    case SEARCH_RESULT:
      return {
        ...state,
        fetching: false,
        total: action.data.total || 0,
        maxScore: action.data.maxScore,
        items: action.data.items,
        get_action: REQ_RESULT.INITIALIZED,
        save_action: REQ_RESULT.INITIALIZED,
      };
    case SEARCH_ERR:
      return {
        ...state,
        fetching: false,
        errorMessage: 'Failed to execute search query',
      };

    case GET_SETTINGS_REQ:
      return {
        ...state,
        fetching: true,
        errorMessage: null,
        get_action: REQ_RESULT.INITIALIZED,
        save_action: REQ_RESULT.INITIALIZED,
      };
    case GET_SETTINGS_RESULT:
      return {
        ...state,
        fetching: false,
        get_action: REQ_RESULT.SUCCESS,
        settings: action.data.settings,
      };
    case GET_SETTINGS_ERR:
      return {
        ...state,
        fetching: false,
        errorMessage: 'Failed to get search settings',
      };

    case UPDATE_SETTINGS_REQ:
      return {
        ...state,
        fetching: true,
        errorMessage: null,
        get_action: REQ_RESULT.INITIALIZED,
        save_action: REQ_RESULT.INITIALIZED,
      };
    case UPDATE_SETTINGS_RESULT:
      return {
        ...state,
        fetching: false,
        settings: action.data.settings,
        save_action: REQ_RESULT.SUCCESS,
      };
    case UPDATE_SETTINGS_ERR:
      return {
        ...state,
        fetching: false,
        errorMessage: 'Failed to update search settings',
        save_action: REQ_RESULT.ERROR,
      };

    default:
      return state;
  }
};
