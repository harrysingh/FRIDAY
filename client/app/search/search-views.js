import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import { updateSettings } from 'app/search/actions';
import { REQ_RESULT } from 'shared/enum';
import searchConfig from 'shared/search-config';

import SearchSettings from './search-settings';

const fieldLabelConfig = searchConfig.header.config.columns;

class SearchViews extends Component {
  static getSettingJson(fields, selected) {
    return fields.map((field) => {
      return {
        value: field,
        label: fieldLabelConfig[field].label,
        selected,
      };
    });
  }

  static getDefaultView(index) {
    const defaultFields = searchConfig.fieldsConfig[index];

    return {
      name: 'New View',
      search: SearchViews.getSettingJson(defaultFields.search, true),
      output: SearchViews.getSettingJson(defaultFields.output, true),
    };
  }

  static getDefaultState(index) {
    if (_.isEmpty(index)) {
      return { index, search: [], output: [] };
    }

    return {
      index,
      selectedView: 0,
      views: [ SearchViews.getDefaultView(index) ],
    };
  }

  constructor(props) {
    super(props);

    this.state = _.extend(SearchViews.getDefaultState(props.index), props);

    this.addView = this.addView.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleViewSelect = this.handleViewSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.save_action === REQ_RESULT.SUCCESS) {
      this.props.onChange();
      this.closeDialog();
    }
  }

  saveSettings(settingJson) {
    const settingsToUpdate = {};
    const { views } = this.state;
    views[this.state.selectedView] = settingJson;
    settingsToUpdate[this.state.index] = { views, selected: this.state.selectedView };
    this.props.dispatch(updateSettings({ settings: settingsToUpdate }));
  }

  showDialog(inputOptions) {
    const options = _.extend({}, inputOptions);
    if (_.isEmpty(options.index)) {
      return;
    }

    this.setState(_.extend({
      visible: true,
    }, options));
  }

  closeDialog() {
    this.setState({ visible: false });
  }

  handleViewSelect(event) {
    this.setState({ selectedView: event.currentTarget.value });
  }

  addView() {
    this.setState((currentState) => {
      return {
        selectedView: currentState.views.length,
        views: _.union(currentState.views, [ SearchViews.getDefaultView(currentState.index) ]),
      };
    });
  }

  render() {
    if (!this.state.visible) {
      return <span/>;
    }

    const currentSettings = _.extend({}, this.state.views[this.state.selectedView], {
      index: this.state.index,
      getSettingJson: SearchViews.getSettingJson,
      saveSettings: this.saveSettings,
      closeDialog: this.closeDialog,
    });

    return (
      <div className="user-settings-container">
        <div className="overlay" />
        <div className="content light-border">
          <div className="view-dropdown">
            <div className="name-label">Select View</div>
            <select className="view-selector" onChange={ this.handleViewSelect }>
              {
                this.state.views.map((view, index) => {
                  return (
                    <option
                      className="active"
                      value={ index }
                      selected={ this.state.selectedView === index }
                    >
                      { view.name }
                    </option>
                  );
                })
              }
            </select>
            <button type="button" className="add-view" onClick={ this.addView } >Add</button>
          </div>
          <SearchSettings { ...currentSettings } />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.searchReducer.fetching,
  save_action: state.searchReducer.save_action,
  errorMessage: state.searchReducer.errorMessage,
});

export default connect(mapStateToProps, null, null, { withRef: true })(SearchViews);
