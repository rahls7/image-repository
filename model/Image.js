const { model, Schema } = require("mongoose");

const imageSchema = new Schema({
  imageUrl: String,
  username: String,
  createdAt: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  labels: [String]
});

module.exports = model("Image", imageSchema);
