const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { PROJECT_NAME, BUCKET_NAME } = require("../config");

const storage = new Storage({
  keyFilename: path.join(__dirname, "../service-account-key.json"),
  projectId: PROJECT_NAME
});

const bucketName = BUCKET_NAME;

module.exports = { bucket: storage.bucket(bucketName), bucketName };
