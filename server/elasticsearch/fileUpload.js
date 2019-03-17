const _ = require('underscore');
const csvToJson = require('csvtojson');
const ElasticClient = require('./queryclient');
const IndexManager = require('../elasticsearch/indexmanager');
const config = require('../config/config');
const fieldConfig = require('../../shared/search-config');
const { reE } = require('../services/util.service');

const insert = (index, key, query, successCallback, errorCallback) => {
  ElasticClient.index({
    index,
    type: config.search.profileType,
    body: query,
  }, (error) => {
    if (error) {
      errorCallback();
    } else {
      successCallback();
    }
  });
};

const responseIfComplete = (res, index, total, successCount, failedCount) => {
  if (successCount + failedCount === total) {
    res.redirect('/search#index='
      .concat(index)
      .concat('&uploadS=')
      .concat(successCount)
      .concat('&uploadF=')
      .concat(failedCount));
  }
};

const upload = async(req, res) => {
  const { index } = req.query;
  if (_.isEmpty(index)) {
    return reE(res, 'Invalid index to upload file');
  }

  const indexConfig = IndexManager.getIndexConfig(index);
  return csvToJson({ output: 'json' })
    .fromString(Buffer.from(req.files.sampleFile.data, 'binary').toString('utf8'))
    .then((jsonArray) => {
      const linesToProcess = _.size(jsonArray);
      let linesProcessed = 0;
      let failedCount = 0;

      jsonArray.map((line) => {
        const key = line[fieldConfig.fieldsConfig[index].key];
        if (_.isUndefined(key)) {
          // eslint-disable-next-line no-console
          console.log(`Skipping entry without primary key: ${ JSON.stringify(line) }`);
          failedCount += 1;
          responseIfComplete(res, index, linesToProcess, linesProcessed, failedCount);
          return 0;
        }

        return insert(indexConfig.index, key, line, () => {
          linesProcessed += 1;
          responseIfComplete(res, index, linesToProcess, linesProcessed, failedCount);
        }, () => {
          failedCount += 1;
          responseIfComplete(res, index, linesToProcess, linesProcessed, failedCount);
        });
      });
    });
};

module.exports = {
  upload,
};
