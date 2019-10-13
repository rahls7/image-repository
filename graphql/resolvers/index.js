const imageResolvers = require("./images");
const userResolvers = require("./users");

module.exports = {
  Query: {
    ...imageResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...imageResolvers.Mutation
  }
};
