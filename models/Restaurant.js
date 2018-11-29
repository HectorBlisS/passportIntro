const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restSchema = new Schema(
  {
    name: String,
    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: [Number]
    },
    images:[String],
    photo: String,
    file: String
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
);

module.exports = mongoose.model("Restaurant", restSchema);
