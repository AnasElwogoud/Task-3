const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      type: Buffer,
    },
  },
  { timestamps: true }
);
newsSchema.methods.toJSON = function () {
  const news = this;
  const newsObject = news.toObject();
  return newsObject;
};

const News = mongoose.model("News", newsSchema);
module.exports = News;
