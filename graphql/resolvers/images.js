const { AuthenticationError } = require("apollo-server");
const path = require("path");
const vision = require("@google-cloud/vision");

const Image = require("../../model/Image");
const checkAuth = require("../../util/check-auth");
const { bucket, bucketName } = require("../../util/storage");

const client = new vision.ImageAnnotatorClient();

module.exports = {
  Query: {
    async getImages(_, params, context) {
      try {
        const user = checkAuth(context);
        if (!user) {
          throw new AuthenticationError(
            "You are not logged in. Please log in to get your images."
          );
        }
        const images = await Image.find({ username: user.username }).sort({
          createdAt: -1
        });
        return images;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getImage(_, { imageId }, context) {
      try {
        const user = checkAuth(context);
        const image = await Image.findById(imageId);
        if (image && user.username === image.username) {
          return image;
        } else {
          throw new Error("Image not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async searchImage(_, { text }, context) {
      try {
        const user = checkAuth(context);
        const tokens = text.split(" ");
        const images = await Image.find({ labels: { $in: tokens } });
        if (images && user.username === images[0].username) {
          return images;
        } else {
          throw new Error("Image not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async reverseImageSearch(_, { file }, context) {
      try {
        const user = checkAuth(context);
        const filePath = path.join(__dirname, `../../${file}`);
        const [result] = await client.labelDetection(filePath);
        const labels = result.labelAnnotations;
        const descriptions = [];
        labels.forEach(label => descriptions.push(label.description));
        const images = await Image.find({ labels: { $in: descriptions } });
        if (images && user.username === images[0].username) {
          return images;
        } else {
          throw new Error("Image not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async uploadImage(_, { file, public }, context) {
      const filePath = path.join(__dirname, `../../${file}`);
      // const fileDestination = await getFileDestination(filePath, context);
      const user = checkAuth(context);
      const fileNameArray = filePath.split("/");
      const fileName = fileNameArray[fileNameArray.length - 1];
      const fileDestination = `/data/${user.username}/${fileName}`;
      await bucket.upload(filePath, { destination: fileDestination });
      if (public) {
        await bucket.file(fileDestination).makePublic();
      } else {
        await bucket.file(fileDestination).acl.owners.addUser(user.email);
      }
      const imageUrl = `https://storage.cloud.google.com/${bucketName}${fileDestination}`;

      const [result] = await client.labelDetection(filePath);
      const labels = result.labelAnnotations;
      const descriptions = [];
      labels.forEach(label => descriptions.push(label.description));
      const newImage = new Image({
        imageUrl,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        labels: descriptions
      });
      const image = await newImage.save();
      return image;
    },
    async deleteImage(_, { imageId }, context) {
      const user = checkAuth(context);
      try {
        const image = await Image.findById(imageId);
        if (user.username === image.username) {
          await image.delete();
          return "Image Deleted";
        } else {
          throw new AuthenticationError(
            "You are not authorized to delete this image"
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};

async function getFileDestination(filePath, context) {
  const user = checkAuth(context);
  const fileNameArray = filePath.split("/");
  const fileName = fileNameArray[fileNameArray.length - 1];
  const fileDestination = `/data/${user.username}/${fileName}`;
  return fileDestination;
}
