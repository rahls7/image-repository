const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(__dirname, "../service-account-key.json"),
  projectId: "shopify-image"
});

const bucketName = "shopify-image";

module.exports = { bucket: storage.bucket(bucketName), bucketName };
