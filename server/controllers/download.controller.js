const _ = require('underscore');
const Json2csvParser = require('json2csv').Parser;
const DVUtils = require('../../shared/utils');
const elasticService = require('../services/elasticsearch.service');
const searchConfig = require('../../shared/search-config');
const SearchUtils = require('../../shared/search-utils');
const { to, reE } = require('../services/util.service');

const download = async(req, res) => {
  const options = req.query || {};
  const [ err, queryResult ] = await to(elasticService.searchWithPagination(_.extend(options, { maxScore: 0 })));

  if (err) {
    return reE(res, err);
  }

  const results = [];
  const fieldLabelConfig = searchConfig.header.config.columns;
  const indexConfig = searchConfig.fieldsConfig[options.index] || {};

  const user = {};
  try { user.role = parseInt(options.role, 10); } catch (err) {
    // TODO
  }
  let { fields } = indexConfig;
  if (DVUtils.isUserAdmin(user)) {
    fields = _.union(fields, searchConfig.adminFields);
  }

  _.each(queryResult.items, (item) => {
    const resultJson = {};
    _.each(fields, (field) => {
      resultJson[fieldLabelConfig[field].label] = SearchUtils.getFieldValues(item, field).join('\\n');
    });
    results.push(resultJson);
  });

  res.statusCode = 200;
  res.set({
    'Content-Disposition': 'attachment; filename="'
      .concat(options.name || SearchUtils.getFileName(options.index))
      .concat(DVUtils.DOUBLE_QUOTES),
    'Content-Type': 'text/csv',
  });

  return res.send(new Json2csvParser().parse(results));
};

module.exports = {
  download,
};
