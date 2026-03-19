(() => {
  ("use strict");
  const forms = document.querySelectorAll(".needs-validation");
  console.log("Validation script loaded!"); // Add this to check
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//this is for dynamic price display for specific dates schedules
document.addEventListener("DOMContentLoaded", () => {
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const priceDisplay = document.getElementById("priceDisplay");
  const perNightText = document.getElementById("perNightText");

  if (!checkinInput || !checkoutInput || !priceDisplay || !perNightText) return;

  const nightlyPrice = parseInt(
    priceDisplay.textContent.replace(/[^0-9]/g, "")
  );

  //  Prevent past dates in both inputs
  const today = new Date().toISOString().split("T")[0];
  checkinInput.min = today;
  checkoutInput.min = today;

  function formatDateToInput(date) {
    return date.toISOString().split("T")[0];
  }

  checkinInput.addEventListener("change", () => {
    if (!checkinInput.value) return;

    const checkinDate = new Date(checkinInput.value);
    const nextDay = new Date(checkinDate);
    nextDay.setDate(nextDay.getDate() + 1);
    // Checkout cannot be earlier than 1 day after checkin
    checkoutInput.min = formatDateToInput(nextDay);
  });

  function updatePriceDisplay() {
    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);

    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      // Show original price / night if dates are invalid or cleared
      priceDisplay.textContent = `₹${nightlyPrice.toLocaleString("en-IN")}`;
      perNightText.textContent = "/night";
      return;
    }

    if (checkoutDate <= checkinDate) {
      priceDisplay.textContent = `₹${nightlyPrice.toLocaleString("en-IN")}`;
      perNightText.textContent = "/night";
      return;
    }

    const diffTime = checkoutDate - checkinDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = nights * nightlyPrice;

    priceDisplay.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;
    perNightText.textContent = `for ${nights} night${nights > 1 ? "s" : ""}`;
  }

  checkinInput.addEventListener("change", updatePriceDisplay);
  checkoutInput.addEventListener("change", updatePriceDisplay);
});

// Toggle payment method forms
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.addEventListener("change", function () {
      document.getElementById("cardDetails").classList.add("d-none");
      document.getElementById("upiDetails").classList.add("d-none");
      document.getElementById("netbankingDetails").classList.add("d-none");

      if (this.value === "card") {
        document.getElementById("cardDetails").classList.remove("d-none");
      } else if (this.value === "upi") {
        document.getElementById("upiDetails").classList.remove("d-none");
      } else if (this.value === "netbanking") {
        document.getElementById("netbankingDetails").classList.remove("d-none");
      }
    });
  });
});
