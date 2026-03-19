document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll("input[name='paymentMethod']");
  let selected = null;

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (selected && selected !== radio) {
        // close previous section
        const prevTarget = document.querySelector(selected.dataset.bsTarget);
        new bootstrap.Collapse(prevTarget, { hide: true });
      }

      // open current section
      const target = document.querySelector(radio.dataset.bsTarget);
      new bootstrap.Collapse(target, { show: true });

      // update selected
      selected = radio;
    });
  });
});
