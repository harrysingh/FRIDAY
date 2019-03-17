import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import DVUtils from 'shared/utils';
import ListComponent from 'common/list-container/component';
import ListEnums from 'common/list-container/enum';
import Logger from 'lib/logger';
import { REQ_RESULT } from 'shared/enum';
import searchConfig from 'shared/search-config';
import SearchUtils from 'shared/search-utils';

import DownloadResults from './download-results';
import FileUpload from './upload-data';
import SearchListItem from './search-list-item';
import SearchSettings from './search-settings';
import { getSettings, searchItems } from './actions';

import './style.less';

const defaultListConfig = ListComponent.populateDefaultProps(searchConfig);

class SearchContainer extends Component {
  static getValidParams() {
    return [ 'search', 'index', 'exact', 'maxScore' ];
  }

  static getDefaultFetchParams() {
    const fetchParams = _.extend({}, searchConfig.list.data.fetchParams);
    _.each(SearchContainer.getValidParams(), (param) => {
      fetchParams[param] = fetchParams[param] || DVUtils.EMPTY_STRING;
    });

    return fetchParams;
  }

  static getHashString(fetchParams) {
    const validParams = _.pick(fetchParams || {}, SearchContainer.getValidParams());
    const hashValueArray = [];

    _.map(validParams, (value, param) => {
      hashValueArray.push(param.concat(DVUtils.EQUAL_TO).concat(value));
    });

    return hashValueArray.join(DVUtils.AMPERSAND);
  }

  static getFetchParamsFromHash() {
    return _.extend(SearchContainer.getDefaultFetchParams(), _.object(DVUtils.getStringFromHash()
      .split(DVUtils.AMPERSAND)
      .map(s => s.split(DVUtils.EQUAL_TO))));
  }

  static hasFilters(fetchParams) {
    const params = fetchParams || {};
    return !_.isEmpty(params.search);
  }

  constructor(props) {
    super(props);

    this.triggerFetchSettings();
    this.triggerFetchSettings = this.triggerFetchSettings.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.updateList = this.updateList.bind(this);
    this.getListItemTemplate = this.getListItemTemplate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.get_action === REQ_RESULT.SUCCESS) {
      const fetchParams = SearchContainer.getFetchParamsFromHash();
      const fieldsConfig = SearchUtils.getFieldsConfig(nextProps.settings, searchConfig, fetchParams.index);
      this.updateList({ fields: fieldsConfig.search });
    }
  }

  onActionClick(action) {
    const fetchParams = this.searchList.getWrappedInstance().getFetchParams();
    switch (action) {
      case ListEnums.ACTIONS.DOWNLOAD:
        const settingsConfig = this.props.settings[fetchParams.index] || {};
        this.downloadDialog.showDialog(_.extend({
          count: this.props.total || 20,
          output: settingsConfig.output || [],
        }, fetchParams, { offset: 0 }));
        break;

      case ListEnums.ACTIONS.SETTINGS:
        this.searchSettingsDialog.getWrappedInstance().showDialog({
          index: fetchParams.index,
        });
        break;

      case ListEnums.ACTIONS.UPLOAD:
        this.fileUploadDialog.showDialog({
          index: fetchParams.index,
        });
        break;

      default:
    }
  }

  getListItemTemplate(itemJson, params) {
    const fetchParams = SearchContainer.getFetchParamsFromHash();
    const fieldsConfig = SearchUtils.getFieldsConfig(this.props.settings, searchConfig, fetchParams.index);

    const itemProps = _.extend({ fieldsToRender: fieldsConfig.output }, itemJson, params);
    return <SearchListItem { ...itemProps } />;
  }

  getListComponentProps() {
    const searchListConfig = DVUtils.deepClone(defaultListConfig);
    const fetchParams = SearchContainer.getFetchParamsFromHash();
    const fieldsConfig = SearchUtils.getFieldsConfig(this.props.settings, searchConfig, fetchParams.index);

    searchListConfig.searcher.data.value = fetchParams.search;
    searchListConfig.searcher.data.exact = fetchParams.exact === 'true';

    searchListConfig.actionBar.config.onActionClick = this.onActionClick;
    searchListConfig.actionBar.config.actions[0].disabled = this.props.total === 0;

    searchListConfig.masterSelector.data.selected = fetchParams.index;
    searchListConfig.list.config = {
      ...searchListConfig.list.config,
      getListItemTemplate: this.getListItemTemplate,
      fetchItems: searchItems,
      getHashString: SearchContainer.getHashString,
      hasFilters: SearchContainer.hasFilters,
    };
    searchListConfig.list.data.total = this.props.total || 0;
    searchListConfig.list.data.items = this.props.items || [];
    searchListConfig.list.data.fetching = _.isBoolean(this.props.fetching) ? this.props.fetching : false;

    Logger.info(`Setting max score to ${ this.props.maxScore }`);
    fetchParams.maxScore = this.props.maxScore;
    fetchParams.fields = fieldsConfig.search;
    searchListConfig.list.data.fetchParams = fetchParams;

    searchListConfig.header.config.activeColumns = fieldsConfig.output;
    searchListConfig.list.config.key = fieldsConfig.key;

    return searchListConfig;
  }

  triggerFetchSettings() {
    this.props.dispatch(getSettings());
  }

  updateList(options) {
    this.searchList.getWrappedInstance().updateList(options);
  }

  render() {
    const listComponentProps = this.getListComponentProps();
    const downloadResultProps = { visible: false, count: _.size(listComponentProps.list.data.items) };
    const searchSettings = {
      settings: this.props.settings[listComponentProps.list.data.fetchParams.index],
      onChange: this.triggerFetchSettings,
      visible: false,
    };

    return (
      <div className="search-list-container">
        <DownloadResults ref={ (node) => { this.downloadDialog = node; } } { ...downloadResultProps } />
        <SearchSettings ref={ (node) => { this.searchSettingsDialog = node; } } { ...searchSettings } />
        <FileUpload ref={ (node) => { this.fileUploadDialog = node; } } />
        <ListComponent ref={ (node) => { this.searchList = node; } } { ...listComponentProps } />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  maxScore: state.searchReducer.maxScore,
  total: state.searchReducer.total,
  fetching: state.searchReducer.fetching,
  items: state.searchReducer.items,
  settings: state.searchReducer.settings,
  get_action: state.searchReducer.get_action,
  errorMessage: state.searchReducer.errorMessage,
});

export default connect(mapStateToProps)(SearchContainer);
