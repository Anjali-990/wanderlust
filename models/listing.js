const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("../models/review.js");
const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
});

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  country: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: imageSchema, required: true },
  amenities: [String],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

// Create a model from the schema
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
