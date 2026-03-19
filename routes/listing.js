const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { upload } = require("../middleware");
const Listing = require("../models/listing");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

// Index route
router.get("/", wrapAsync(listingController.index));

// Create New route
router.get("/new", isloggedIn, listingController.renderNewForm);

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

// Create route
router.post(
  "/",
  isloggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.createListing),
);
// Edit route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

// Update route
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing),
);

// Delete route
router.delete(
  "/:id",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

module.exports = router;
