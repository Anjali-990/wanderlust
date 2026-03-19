const express = require("express");
const router = express.Router({ mergeParams: true });
const { isloggedIn } = require("../middleware");
const reserveController = require("../controllers/reservation");

// Booking flow (protected)
router.post("/reserve", isloggedIn, reserveController.reserve);
router.get("/book", isloggedIn, reserveController.getBookPage);

router.get("/payment", isloggedIn, reserveController.getPaymentPage);
router.post("/confirm", isloggedIn, reserveController.confirmPayment);
router.get("/confirmation", isloggedIn, reserveController.getConfirmationPage);

// New reservation form (protected)
router.get("/new", isloggedIn, reserveController.NewReservationForm);

// Create reservation (protected)
router.post("/", isloggedIn, reserveController.CreateReservation);

// Show reservation by ID
router.get("/:reservationId", isloggedIn, reserveController.ShowReservation);

module.exports = router;
