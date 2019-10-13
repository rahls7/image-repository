const gql = require("graphql-tag");

module.exports = gql`
  type Image {
    id: ID!
    imageUrl: String!
    createdAt: String!
    username: String!
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
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    uploadImage(file: String!, public: Boolean!): Image!
    deleteImage(imageId: ID!): String!
  }
`;