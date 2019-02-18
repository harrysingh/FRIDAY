const _ = require('underscore');
const DVUtils = require('./../shared/utils');

const SearchUtils = {
  getFieldValueList(itemJson, fieldName) {
    if (fieldName.indexOf(DVUtils.PERIOD) === -1) {
      return [ itemJson[fieldName] ];
    }

    const parts = fieldName.split(DVUtils.PERIOD);
    const propsArray = itemJson[parts[0]];
    const fieldValues = [];
    _.each(propsArray, (props) => {
      fieldValues.push(props[parts[1]]);
    });

    return fieldValues;
  },

  getFieldValues(itemJson, fieldName) {
    if (fieldName === 'knb1_props.knb1_bukrs') {
      const values = [];
      _.each(itemJson.knb1_props, (prop) => {
        values.push(`Reconciliation Account in General Ledger : ${
          prop.knb1_akont
        }, Company Code : ${
          prop.knb1_bukrs
        },  Terms of Payment Key : ${
          prop.knb1_zterm
        }`);
      });

      return values;
    }

    if (fieldName === 'knvk_props.knvk_namev') {
      const values = [];
      _.each(itemJson.knvk_props, (prop) => {
        values.push(`Customer Name: ${
          prop.knvk_kunnr
        }, First Name: ${
          prop.knvk_namev
        }, Last Name: ${
          prop.knvk_name1
        }`);
      });

      return values;
    }

    return SearchUtils.getFieldValueList(itemJson, fieldName);
  },

  getFileName(index) {
    return 'Data'
      .concat(DVUtils.UNDERSCORE)
      .concat(index)
      .concat(DVUtils.UNDERSCORE)
      .concat(new Date().toLocaleString())
      .concat(DVUtils.PERIOD)
      .concat('csv');
  },

  getFieldsConfig(searchSettings, searchConfig, index) {
    const settings = searchSettings[index || DVUtils.EMPTY_STRING] || {};
    const config = searchConfig.fieldsConfig[index || DVUtils.EMPTY_STRING] || {};

    let outputFields = _.union(_.isEmpty(settings.output) ? config.output : settings.output, searchConfig.extraFields);
    if (DVUtils.isUserAdmin(window.DV.user)) {
      outputFields = _.union(outputFields, searchConfig.adminFields);
    }

    return {
      key: config.key,
      output: outputFields,
      search: _.isEmpty(settings.search) ? config.search : settings.search,
    };
  },
};

module.exports = SearchUtils;
