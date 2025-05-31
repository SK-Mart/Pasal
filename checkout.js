document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary = document.getElementById("cart-summary");
  const checkoutForm = document.getElementById("checkout-form");
  const cartDataInput = document.getElementById("cart-data");
  const paymentMethodInput = document.getElementById("payment-method");
  const esewaQr = document.getElementById("esewa-qr");
  const paymentRadios = document.querySelectorAll('input[name="payment"]');

  // Render cart summary
  if (cart.length === 0) {
    cartSummary.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    let total = 0;
    let table = `
      <h3>Order Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Weight</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
    `;
    cart.forEach(item => {
      const itemTotal = item.adjustedPrice * item.quantity;
      total += itemTotal;
      table += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.weight}</td>
          <td>Rs. ${itemTotal}</td>
        </tr>
      `;
    });
    table += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total</td>
            <td>Rs. ${total}</td>
          </tr>
        </tfoot>
      </table>
    `;
    cartSummary.innerHTML = table;
  }

  // Toggle eSewa QR code
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      esewaQr.style.display = radio.value === "eSewa" ? "block" : "none";
      paymentMethodInput.value = radio.value;
    });
  });
  paymentMethodInput.value = "eSewa"; // Default

  // Handle form submission
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    cartDataInput.value = JSON.stringify(cart);
    console.log("Submitting order:", {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      postal: document.getElementById("postal").value,
      payment: paymentMethodInput.value,
      cart: cart
    });

    // Submit to Formspree
    fetch(checkoutForm.action, {
      method: "POST",
      body: new FormData(checkoutForm),
      headers: { "Accept": "application/json" }
    })
    .then(response => {
      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
      } else {
        alert("Error placing order. Please try again.");
      }
    })
    .catch(error => {
      console.error("Form submission error:", error);
      alert("Error placing order. Please try again.");
    });
  });
});