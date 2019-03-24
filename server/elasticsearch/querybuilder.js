const _ = require('underscore');
const DVUtils = require('../../shared/utils');
const { throwError } = require('../services/util.service');
const ESEnums = require('./enum');

const commonSearchQueries = require('./stop-words');

const getWildCardQuery = (inputOptions) => {
  const options = inputOptions || { fields: [] };

  return {
    query: {
      query_string: {
        query: options.search,
        fields: options.fields,
      },
    },
  };
};

const getMultiMatchQueryJson = (inputOptions) => {
  const options = inputOptions || {};

  return {
    multi_match: _.extend({
      query: options.search,
      type: options.type || ESEnums.MULTI_MATCH_TYPE.CROSS_FIELDS,
      fields: options.fields,
      operator: options.operator || ESEnums.OPERATOR.AND,
    }, options.attrs),
  };
};

const getFieldsToSearch = (fieldsToSearch) => {
  let fields = fieldsToSearch;
  if (_.isString(fieldsToSearch)) {
    fields = [ fieldsToSearch ];
  }

  if (_.isEmpty(fields)) {
    throwError('Invalid fields to construct search query');
  }

  return fields;
};

const getPhraseQuery = (field, phrase) => {
  return {
    query: {
      match_phrase: {
        [field]: phrase,
      },
    },
  };
};

const getExactMatchQuery = (inputOptions) => {
  const searchOptions = inputOptions || {};

  if (_.isEmpty(searchOptions.search)) {
    throwError('Invalid search string');
  }

  if (_.contains(searchOptions.search, DVUtils.ASTERISK) || _.contains(searchOptions.search, DVUtils.QM)) {
    return getWildCardQuery({
      search: searchOptions.search,
      fields: getFieldsToSearch(searchOptions.fields),
    });
  }

  return {
    query: getMultiMatchQueryJson({
      search: searchOptions.search,
      fields: getFieldsToSearch(searchOptions.fields),
      type: ESEnums.MULTI_MATCH_TYPE.CROSS_FIELDS,
    }),
  };
};

const getFuzzySearchString = (options) => {
  if (String(options.common) !== 'true') {
    return options.search;
  }

  return _.difference(options.search.split(DVUtils.SPACE), commonSearchQueries).join(DVUtils.SPACE);
};

const getSearchQuery = (inputOptions) => {
  const searchOptions = inputOptions || {};
  const minScoreOption = {};

  if (_.isEmpty(searchOptions.search)) {
    throwError('Invalid search string');
  }

  if (_.isNumber(searchOptions.min_score)) {
    minScoreOption.min_score = searchOptions.min_score;
  }
  const mixWords = searchOptions.search.replace(/\s/g, '');
  const fields = getFieldsToSearch(searchOptions.fields);
  const fuzzySearch = getFuzzySearchString(searchOptions);
  const options = {
    search: searchOptions.search,
    fields,
    type: ESEnums.MULTI_MATCH_TYPE.BEST_FIELDS,
  };

  return _.extend(minScoreOption, {
    query: {
      dis_max: {
        queries: [
          {
            multi_match: {
              query: mixWords,
              type: ESEnums.MULTI_MATCH_TYPE.MOST_FIELDS,
              fields,
              boost: 30,
            },
          },
          getMultiMatchQueryJson(_.extend(options, { attrs: { fuzziness: 1 } })),
          getMultiMatchQueryJson(_.extend(options, { attrs: { boost: 3000 } })),
          getMultiMatchQueryJson(_.extend({
            operator: ESEnums.OPERATOR.AND,
            type: ESEnums.MULTI_MATCH_TYPE.MOST_FIELDS,
          }, options, { search: fuzzySearch, attrs: { fuzziness: 1 } })),
          getMultiMatchQueryJson(_.extend({
            operator: ESEnums.OPERATOR.OR,
          }, options, { search: fuzzySearch, attrs: { boost: 3 } })),
        ],
      },
    },
  });
};

module.exports = {
  getSearchQuery,
  getPhraseQuery,
  getExactMatchQuery,
};
