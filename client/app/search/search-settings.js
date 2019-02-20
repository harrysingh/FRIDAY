import React, { Component } from 'react';
import _ from 'underscore';

import { connect } from 'react-redux';
import searchConfig from 'shared/search-config';
import { REQ_RESULT } from 'shared/enum';
import { updateSettings } from 'app/search/actions';

class SearchSettings extends Component {
  static getDefaultState(index) {
    if (_.isEmpty(index)) {
      return { index, search: [], output: [] };
    }

    const defaultFields = searchConfig.fieldsConfig[index];
    return { index, search: defaultFields.search, output: defaultFields.output };
  }

  constructor(props) {
    super(props);

    this.state = SearchSettings.getDefaultState();
    this.closeDialog = this.closeDialog.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.handleOutputInputChange = this.handleOutputInputChange.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.save_action === REQ_RESULT.SUCCESS) {
      this.props.onChange();
      this.closeDialog();
    }
  }

  saveSettings() {
    const settingsToSave = {};
    settingsToSave[this.state.index] = _.pick(this.state, [ 'search', 'output' ]);
    this.props.dispatch(updateSettings({ settings: settingsToSave }));
  }

  showDialog(inputOptions) {
    const options = inputOptions || {};
    if (_.isEmpty(options.index)) {
      return;
    }

    const searchSetting = _.extend(SearchSettings.getDefaultState(options.index), this.props.settings);
    this.setState(_.extend({ ...searchSetting, visible: true }, options));
  }

  closeDialog() {
    this.setState({ visible: false });
  }

  handleSearchInputChange(event) {
    const { target } = event;
    const searchFields = this.state.search;

    this.setState({
      search: target.checked ? _.union(searchFields, [ target.name ]) : _.difference(searchFields, [ target.name ]),
    });
  }

  handleOutputInputChange(event) {
    const { target } = event;
    const searchFields = this.state.output;

    this.setState({
      output: target.checked ? _.union(searchFields, [ target.name ]) : _.difference(searchFields, [ target.name ]),
    });
  }

  render() {
    if (!this.state.visible) {
      return <span/>;
    }

    const fieldsSettings = searchConfig.fieldsConfig[this.state.index];
    const fieldLabelConfig = searchConfig.header.config.columns;
    return (
      <div className="user-settings-container">
        <div className="overlay" />
        <div className="content light-border">
          <h2>Update Search settings</h2>
          <div className="fields-container">
            <div className="search-fields">
              <h4>Search Fields</h4>
              {
                fieldsSettings.search.map((field) => {
                  return (
                    <label>
                      <input
                        name={ field }
                        type="checkbox"
                        checked={ _.contains(this.state.search, field) }
                        onChange={ this.handleSearchInputChange }
                      />
                      { fieldLabelConfig[field].label }
                    </label>
                  );
                })
              }
            </div>
            <div className="output-fields">
              <h4>Output Fields</h4>
              {
                fieldsSettings.output.map((field) => {
                  return (
                    <label>
                      <input
                        name={ field }
                        type="checkbox"
                        checked={ _.contains(this.state.output, field) }
                        onChange={ this.handleOutputInputChange }
                      />
                      { fieldLabelConfig[field].label }
                    </label>
                  );
                })
              }
            </div>
          </div>
          <div className="action-buttons">
            <button type="button" className="cancel light-border" onClick={ this.closeDialog } >Cancel</button>
            <button type="button" className="save light-border primary" onClick={ this.saveSettings }>Save</button>
          </div>
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

export default connect(mapStateToProps, null, null, { withRef: true })(SearchSettings);
