import React, { Component } from 'react';

import DVUtils from 'shared/utils';
import Logger from 'lib/logger';
import searchConfig from 'shared/search-config';
import SearchUtils from 'shared/search-utils';

class SearchListItem extends Component {
  getBucket() {
    const bucket = Math.round(Math.log2((parseFloat(this.props.maxScore) + this.props.min_score) / this.props.score));
    Logger.debug(`Score: ${ this.props.score } Bucket ${ bucket }`);
    return 'bucket_'.concat(bucket);
  }

  render() {
    const fieldsConfig = SearchUtils.getFieldsConfig(searchConfig, this.props.index);

    return (
      <div className={ [ 'row fixed list-row', this.getBucket() ].join(DVUtils.SPACE) }>
        {
          fieldsConfig.fields.map((field) => {
            return (
              <div className={ [ 'cell middle', field.replace(DVUtils.PERIOD, DVUtils.HYPHEN) ].join(DVUtils.SPACE) }>
                {
                  SearchUtils.getFieldValues(this.props, field).map((value) => {
                    return (
                      <span>
                        { value }
                        <br />
                      </span>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default SearchListItem;
