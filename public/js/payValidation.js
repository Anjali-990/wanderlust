document.getElementById("payForm").addEventListener("submit", function (e) {
  let valid = true;

  // Reset errors
  document.querySelectorAll(".form-control, .form-select").forEach((el) => {
    el.classList.remove("is-invalid");
  });

  // Check which method is selected
  const selected = document.querySelector(
    "input[name='paymentMethod']:checked"
  );
  let method = null;

  if (selected) {
    method = selected.value;
  }
  // ⚠️ else case remove kar diya → ab backend handle karega flash ke sath

  if (method === "card") {
    const cardNumber = document.getElementById("cardNumber");
    if (!/^\d{16}$/.test(cardNumber.value.trim())) {
      cardNumber.classList.add("is-invalid");
      valid = false;
    }

    const expiry = document.getElementById("expiry");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value.trim())) {
      expiry.classList.add("is-invalid");
      valid = false;
    }

    const cvv = document.getElementById("cvv");
    if (!/^\d{3}$/.test(cvv.value.trim())) {
      cvv.classList.add("is-invalid");
      valid = false;
    }

    const cardName = document.getElementById("cardName");
    if (cardName.value.trim().length < 2) {
      cardName.classList.add("is-invalid");
      valid = false;
    }
  }

  if (method === "upi") {
    const upiId = document.getElementById("upiId");
    if (!/^\w+@\w+$/.test(upiId.value.trim())) {
      upiId.classList.add("is-invalid");
      valid = false;
    }
  }

  if (method === "netbanking") {
    const bank = document.getElementById("bank");
    if (bank.value === "Choose..." || bank.value === "") {
      bank.classList.add("is-invalid");
      valid = false;
    }
  }

  if (!valid) e.preventDefault();
});
