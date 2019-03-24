const FileUpload = require('../elasticsearch/fileUpload');

const upload = async(req, res) => {
  FileUpload.upload(req, res);
};

module.exports = {
  upload,
};
