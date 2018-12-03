const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const keys = require('../aws.config.js');


aws.config.update(keys);

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "thesis-profile-pictures",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: "testing_data" });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;
