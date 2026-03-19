const Listing = require("../models/listing.js");

//index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

//new form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

//show
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested listing doesn't exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};
//create route
module.exports.createListing = async (req, res, next) => {
  try {
    const listingData = req.body.listing;

    // Normalize amenities (always array)
    if (listingData.amenities) {
      listingData.amenities = Array.isArray(listingData.amenities)
        ? listingData.amenities
        : [listingData.amenities];
    } else {
      listingData.amenities = [];
    }

    if (!req.file) {
      throw new Error("Image is required.");
    }

    listingData.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    };

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// Edit route
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params; // Ensure 'id' is correctly defined
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Requested listing doesn't exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).send("Server error");
  }
};
// Update route
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;

  // Normalize amenities
  if (listingData.amenities) {
    listingData.amenities = Array.isArray(listingData.amenities)
      ? listingData.amenities
      : [listingData.amenities];
  } else {
    listingData.amenities = [];
  }

  if (typeof listingData.image === "string") {
    listingData.image = {
      filename: "default.jpg",
      url: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=1170&auto=format&fit=crop",
    };
  }

  try {
    if (req.file) {
      listingData.image = {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      };
    }

    await Listing.findByIdAndUpdate(id, listingData, { new: true });
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).send("Server error");
  }
};

// Delete route
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params; // Ensure 'id' is correctly defined
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
