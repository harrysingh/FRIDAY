import React, { Component } from 'react';
import _ from 'underscore';

import searchConfig from 'shared/search-config';
import SearchUtils from 'shared/search-utils';

import SortableFields from './sortable-fields';

class SearchSettings extends Component {
  constructor(props) {
    super(props);

    this.state = _.extend({}, _.pick(props, [ 'search', 'output', 'name' ]));

    this.closeDialog = this.closeDialog.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onOutputFieldsReorder = this.onOutputFieldsReorder.bind(this);
    this.handleOutputInputChange = this.handleOutputInputChange.bind(this);
    this.onSearchFieldsReorder = this.onSearchFieldsReorder.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(_.extend({}, _.pick(nextProps, [ 'search', 'output', 'name' ])));
  }

  onSearchFieldsReorder(items) {
    this.setState({ search: items });
  }

  onOutputFieldsReorder(items) {
    this.setState({ output: items });
  }

  getSelectionDOM(name) {
    const isEmpty = _.isEmpty(_.filter(this.state[name], item => item.selected));
    const fieldsSettings = searchConfig.fieldsConfig[this.props.index];

    return (
      <label>
        <input
          type="checkbox"
          checked={ false }
          onChange={ isEmpty
            ? this.selectAll.bind(this, name, _.clone(fieldsSettings[name]))
            : this.deselectAll.bind(this, name, _.clone(fieldsSettings[name]))
          }
        />
        { isEmpty ? 'Select All' : 'Deselect All' }
      </label>
    );
  }

  getUpdatedSettings(searchFields, target) {
    _.each(searchFields, (field) => {
      if (field.value === target.name) {
        field.selected = target.checked;
      }
    });

    return searchFields;
  }

  closeDialog() {
    this.props.closeDialog();
  }

  saveSettings() {
    this.props.saveSettings(_.pick(this.state, [ 'search', 'output', 'name' ]));
  }

  handleSearchInputChange(event) {
    const { target } = event;
    this.setState((currentState) => {
      return { search: this.getUpdatedSettings(currentState.search, target) };
    });
  }

  handleOutputInputChange(event) {
    const { target } = event;
    this.setState((currentState) => {
      return { output: this.getUpdatedSettings(currentState.output, target) };
    });
  }

  selectAll(name, fields) {
    const stateToUpdate = {};
    stateToUpdate[name] = this.props.getSettingJson(fields, true);
    this.setState(stateToUpdate);
  }

  deselectAll(name, fields) {
    const stateToUpdate = {};
    stateToUpdate[name] = this.props.getSettingJson(fields, false);
    this.setState(stateToUpdate);
  }

  handleNameChange(event) {
    this.setState({ name: event.currentTarget.value });
  }

  render() {
    return (
      <div className="settings-container">
        <div className="update-setting-label">Update Search settings</div>
        <div className="name-container">
          <div className="name-label">Name</div>
          <input
            className="view-name light-border"
            title="Name"
            value={ this.state.name }
            onChange={ this.handleNameChange }
            placeholder="Enter Name"
          />
        </div>
        <div className="fields-container">
          <div className="search-fields">
            <h4>Search Fields</h4>
            { this.getSelectionDOM('search') }
            <SortableFields { ...{
              items: this.state.search,
              onChange: this.onSearchFieldsReorder,
              onSelectionChange: this.handleSearchInputChange,
            } }
            />
          </div>
          <div className="output-fields">
            <h4>Output Fields</h4>
            { this.getSelectionDOM('output') }
            <SortableFields { ...{
              items: this.state.output,
              onChange: this.onOutputFieldsReorder,
              onSelectionChange: this.handleOutputInputChange,
            } }
            />
          </div>
        </div>
        <div className="action-buttons">
          <button type="button" className="cancel light-border" onClick={ this.closeDialog } >Cancel</button>
          <button
            type="button"
            disabled={ _.isEmpty(SearchUtils.getSelectedFields(this.state.output))
              || _.isEmpty(SearchUtils.getSelectedFields(this.state.search))
            }
            className="save light-border primary"
            onClick={ this.saveSettings }
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default SearchSettings;
