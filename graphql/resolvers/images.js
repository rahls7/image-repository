const { AuthenticationError } = require("apollo-server");
const path = require("path");

const Image = require("../../model/Image");
const checkAuth = require("../../util/check-auth");
const { bucket, bucketName } = require("../../util/storage");

module.exports = {
  Query: {
    async getImages() {
      try {
        const images = await Image.find().sort({ createdAt: -1 });
        return images;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getImage(_, { imageId }) {
      try {
        const image = await Image.findById(imageId);
        if (image) {
          return image;
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
      const user = checkAuth(context);
      const fileNameArray = filePath.split("/");
      const fileName = fileNameArray[fileNameArray.length - 1];
      const fileDestination = `/data/${fileName}`;
      await bucket.upload(filePath, { destination: fileDestination });
      if (public) {
        await bucket.file(fileDestination).makePublic();
      } else {
        await bucket.file(fileDestination).acl.owners.addUser(user.email);
      }
      const imageUrl = `https://storage.cloud.google.com/${bucketName}${fileDestination}`;

      const newImage = new Image({
        imageUrl,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
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
