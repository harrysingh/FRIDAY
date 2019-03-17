import React, { Component } from 'react';
import _ from 'underscore';

import searchConfig from 'shared/search-config';

class SearchSettings extends Component {
  constructor(props) {
    super(props);

    this.state = _.extend({}, _.pick(props, [ 'search', 'output', 'name' ]));

    this.closeDialog = this.closeDialog.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleOutputInputChange = this.handleOutputInputChange.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(_.extend({}, _.pick(nextProps, [ 'search', 'output', 'name' ])));
  }

  getSelectionDOM(name) {
    const isEmpty = _.isEmpty(this.state[name]);
    const fieldsSettings = searchConfig.fieldsConfig[this.props.index];

    return (
      <label>
        <input
          type="checkbox"
          checked={ false }
          onChange={ isEmpty
            ? this.selectAll.bind(this, name, _.clone(fieldsSettings[name]))
            : this.deselectAll.bind(this, name)
          }
        />
        { isEmpty ? 'Select All' : 'Deselect All' }
      </label>
    );
  }

  closeDialog() {
    this.props.closeDialog();
  }

  saveSettings() {
    this.props.saveSettings(_.pick(this.state, [ 'search', 'output', 'name' ]));
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

  selectAll(name, fields) {
    const stateToUpdate = {};
    stateToUpdate[name] = fields;
    this.setState(stateToUpdate);
  }

  deselectAll(name) {
    const stateToUpdate = {};
    stateToUpdate[name] = [];
    this.setState(stateToUpdate);
  }

  handleNameChange(event) {
    this.setState({ name: event.currentTarget.value });
  }

  render() {
    const fieldsSettings = searchConfig.fieldsConfig[this.props.index];
    const fieldLabelConfig = searchConfig.header.config.columns;
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
            { this.getSelectionDOM('output') }
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
          <button
            type="button"
            disabled={ _.isEmpty(this.state.output) || _.isEmpty(this.state.search) }
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
