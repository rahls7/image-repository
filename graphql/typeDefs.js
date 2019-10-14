const gql = require("graphql-tag");

module.exports = gql`
  type Image {
    id: ID!
    imageUrl: String!
    createdAt: String!
    username: String!
    labels: [String]!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getImages: [Image]
    getImage(imageId: ID!): Image!
    searchImage(text: String!): [Image]
    reverseImageSearch(file: String!): [Image]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    uploadImage(file: String!, public: Boolean!): Image!
    uploadDirectory(dir: String!): [Image]
    deleteImage(imageId: ID!): String!
    deleteImages(imageIds: [ID]!): String!
  }
`;
