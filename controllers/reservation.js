const Listing = require("../models/listing.js");
const Reservation = require("../models/reservation.js");
const mongoose = require("mongoose");

// --- Helper: format date dd-mm-yyyy ---
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

// --- Reserve Controller ---
module.exports.reserve = async (req, res) => {
  try {
    const {
      checkin,
      checkout,
      adults = 0,
      children = 0,
      infants = 0,
      listingId,
    } = req.body;

    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      req.flash("error", "Invalid date range selected.");
      return res.redirect("back");
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("back");
    }

    const totalPriceBeforeTax = nights * listing.price;
    const taxRate = 0.03;
    const taxAmount = Math.round(totalPriceBeforeTax * taxRate);
    const totalPrice = totalPriceBeforeTax + taxAmount;

    const reservation = new Reservation({
      user: req.user._id,
      listing: listingId,
      checkin,
      checkout,
      nights,
      adults,
      children,
      infants,
      totalPrice,
    });
    await reservation.save();

    req.session.reservation = {
      listingId,
      checkin,
      checkout,
      nights,
      adults,
      children,
      infants,
      pricePerNight: listing.price,
      totalPriceBeforeTax,
      taxAmount,
      totalPrice,
      finalTotal: totalPrice,
      propertyTitle: listing.title,
    };

    res.redirect("/reservations/book");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong during reservation.");
    res.redirect("back");
  }
};

// --- Book Page ---
module.exports.getBookPage = (req, res) => {
  const reservation = req.session.reservation;
  if (!reservation) {
    req.flash("error", "No reservation found.");
    return res.redirect("/");
  }
  const checkInDate = new Date(reservation.checkin).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );
  const checkOutDate = new Date(reservation.checkout).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  res.render("reservations/book", {
    reservation: {
      ...reservation,
      guests: `${reservation.adults} adults, ${reservation.children} children, ${reservation.infants} infants`,
      checkInDate,
      checkOutDate,
    },
  });
};

// --- Payment Page ---
module.exports.getPaymentPage = async (req, res) => {
  const reservation = req.session.reservation;
  if (!reservation) {
    req.flash("error", "No reservation found.");
    return res.redirect("/");
  }

  const listing = await Listing.findById(reservation.listingId);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/");
  }

  const checkInDate = new Date(reservation.checkin).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );
  const checkOutDate = new Date(reservation.checkout).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  res.render("reservations/payment", {
    reservation: {
      ...reservation,
      guests: `${reservation.adults} adults, ${reservation.children} children, ${reservation.infants} infants`,
      checkInDate,
      checkOutDate,
    },
    listing,
  });
};

// --- New reservation form ---
module.exports.NewReservationForm = (req, res) => {
  res.render("reservations/new", { listingId: req.params.id });
};

// --- Create reservation ---
module.exports.CreateReservation = async (req, res) => {
  const reservation = new Reservation(req.body);
  reservation.user = req.user._id;
  await reservation.save();
  req.flash("success", "Reservation confirmed!");
  res.redirect(`/reservations/${reservation._id}`);
};

// --- Show reservation ---
module.exports.ShowReservation = async (req, res) => {
  const { reservationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    req.flash("error", "Invalid reservation ID");
    return res.redirect("/");
  }

  const reservation = await Reservation.findById(reservationId).populate(
    "user"
  );
  if (!reservation) {
    req.flash("error", "Reservation not found");
    return res.redirect("/");
  }

  res.render("reservations/show", { reservation });
};

// --- Confirmation Page ---
module.exports.getConfirmationPage = (req, res) => {
  const reservation = req.session.reservation;
  if (!reservation) {
    req.flash("error", "No reservation found.");
    return res.redirect("/");
  }

  const checkInDate = new Date(reservation.checkin).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );
  const checkOutDate = new Date(reservation.checkout).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  const extraTax = Math.round(reservation.totalPrice * 0.03);
  const grandTotal = reservation.totalPrice + extraTax;

  res.render("reservations/confirmation", {
    reservation: {
      ...reservation,
      extraTax,
      grandTotal,
      guests: `${reservation.adults} adults, ${reservation.children} children, ${reservation.infants} infants`,
      checkInDate,
      checkOutDate,
    },
  });
};
// --- Confirm Payment ---
module.exports.confirmPayment = (req, res) => {
  const reservation = req.session.reservation;
  if (!reservation) {
    req.flash("error", "No reservation found.");
    return res.redirect("/");
  }

  const { paymentMethod } = req.body;

  if (!paymentMethod) {
    // only one flash
    req.flash("error", "Please select a payment method before proceeding.");
    return res.redirect("/reservations/payment");
  }

  // only one flash
  req.flash("success", "Payment successful!");
  return res.redirect("/reservations/confirmation");
};
