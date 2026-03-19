const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  adults: { type: Number, default: 0 },
  children: { type: Number, default: 0 },
  infants: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);
