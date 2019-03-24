import React, { Component } from 'react';
import _ from 'underscore';

import searchConfig from 'shared/search-config';
import MasterSelector from 'common/list-container/master-selector/component';

class UploadData extends Component {
  constructor(props) {
    super(props);

    this.state = { visible: false };
    this.closeDialog = this.closeDialog.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
  }

  handleMaterialChange(selectedIndex) {
    this.setState(selectedIndex);
  }

  showDialog(options) {
    this.setState(_.extend({
      visible: true,
    }, options));
  }

  closeDialog() {
    this.setState({ visible: false });
  }

  render() {
    if (!this.state.visible) {
      return <span/>;
    }

    const masterSelectorProps = _.extend(searchConfig.masterSelector, { onChange: this.handleMaterialChange });

    return (
      <div className="upload-container">
        <div className="overlay" />
        <div className="content light-border">
          <h2>Upload CSV File</h2>
          <MasterSelector { ...masterSelectorProps } />
          <div className="row">
            <form
              ref="uploadForm"
              id="uploadForm"
              action={
                '/upload?index='.concat(this.state.index).concat('&redirect=/search').concat(window.location.hash)
              }
              method="post"
              encType="multipart/form-data"
            >
              <input type="file" className="select-file" name="sampleFile" />
              <div className="action-buttons">
                <button type="button" className="cancel light-border" onClick={ this.closeDialog } >Cancel</button>
                <input type="submit" className="upload light-border" value="Upload" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadData;
