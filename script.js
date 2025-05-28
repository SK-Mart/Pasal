// Function to decode JWT (for Google ID Token)
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Google Sign-In Callback function (global scope for Google's API)
window.handleCredentialResponse = (response) => {
    if (response.credential) {
        const decodedToken = decodeJwtResponse(response.credential);
        console.log("Decoded Google Token:", decodedToken);

        // Store user info in localStorage (for client-side persistence)
        const user = {
            fullName: decodedToken.name,
            email: decodedToken.email,
            // You can add more info like picture if needed: decodedToken.picture
        };
        localStorage.setItem('skEnterprisesGoogleUser', JSON.stringify(user));
        localStorage.setItem('skEnterprisesGoogleUserEmail', user.email); // Store email for revoke
        updateGoogleSignInUI(user);

        // Pre-fill checkout form if on checkout page
        if (document.querySelector('.checkout-page')) {
            document.getElementById('full-name').value = user.fullName || '';
            // If you added an email field to checkout form, uncomment:
            // document.getElementById('email').value = user.email || '';
        }
    }
};

function updateGoogleSignInUI(user) {
    const googleSignInButton = document.querySelector('.g_id_signin');
    const signOutButton = document.getElementById('sign-out-btn');
    const userDisplayNameIndex = document.getElementById('user-display-name');
    const userDisplayNameCheckout = document.getElementById('user-display-name-checkout'); // For checkout page

    if (user) {
        if (googleSignInButton) googleSignInButton.style.display = 'none';
        if (signOutButton) signOutButton.style.display = 'inline-block';
        if (userDisplayNameIndex) userDisplayNameIndex.textContent = `Welcome, ${user.fullName.split(' ')[0]}!`;
        if (userDisplayNameCheckout) userDisplayNameCheckout.textContent = `Welcome, ${user.fullName.split(' ')[0]}!`;
    } else {
        if (googleSignInButton) googleSignInButton.style.display = 'block';
        if (signOutButton) signOutButton.style.display = 'none';
        if (userDisplayNameIndex) userDisplayNameIndex.textContent = '';
        if (userDisplayNameCheckout) userDisplayNameCheckout.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check for existing Google user on page load
    const storedGoogleUser = JSON.parse(localStorage.getItem('skEnterprisesGoogleUser'));
    updateGoogleSignInUI(storedGoogleUser);

    // Sign out functionality
    const signOutButton = document.getElementById('sign-out-btn');
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            // Google's client-side sign-out
            if (google.accounts.id) {
                google.accounts.id.disableAutoSelect(); // Prevent automatic re-login
                const userEmailToRevoke = localStorage.getItem('skEnterprisesGoogleUserEmail');
                if (userEmailToRevoke) {
                    google.accounts.id.revoke(userEmailToRevoke, (done) => {
                        console.log('Google account revoked:', done);
                        localStorage.removeItem('skEnterprisesGoogleUser');
                        localStorage.removeItem('skEnterprisesGoogleUserEmail');
                        updateGoogleSignInUI(null);
                        // Optionally, clear form fields if on checkout
                        if (document.querySelector('.checkout-page')) {
                            document.getElementById('full-name').value = '';
                            // document.getElementById('email').value = ''; // If you have an email field
                        }
                    });
                } else {
                    console.warn('No Google user email found for revoke.');
                    localStorage.removeItem('skEnterprisesGoogleUser');
                    localStorage.removeItem('skEnterprisesGoogleUserEmail');
                    updateGoogleSignInUI(null);
                     if (document.querySelector('.checkout-page')) {
                        document.getElementById('full-name').value = '';
                        // document.getElementById('email').value = '';
                    }
                }
            } else {
                // Fallback if Google API not fully loaded or not applicable
                localStorage.removeItem('skEnterprisesGoogleUser');
                localStorage.removeItem('skEnterprisesGoogleUserEmail');
                updateGoogleSignInUI(null);
                 if (document.querySelector('.checkout-page')) {
                    document.getElementById('full-name').value = '';
                    // document.getElementById('email').value = '';
                }
            }
        });
    }

    // --- Global Cart Logic (Simulated with localStorage) ---
    let cart = JSON.parse(localStorage.getItem('skEnterprisesCart')) || [];
    const cartCountSpan = document.getElementById('cart-count');

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
            // Add a little animation when cart count updates (already in CSS bounceIn)
        }
    }

    function saveCart() {
        localStorage.setItem('skEnterprisesCart', JSON.stringify(cart));
        updateCartCount();
    }

    // Updated addProductToCart to accept quantity directly
    function addProductToCart(productId, productName, productPrice, quantityToAdd, unitName = null, cartItemId = null) {
        const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        let imageUrl = 'https://via.placeholder.com/80x80?text=Product';
        if (productCard) {
            const imgElement = productCard.querySelector('img');
            if (imgElement) {
                imageUrl = imgElement.src;
            }
        }

        const finalCartItemId = cartItemId || productId;

        const existingItemIndex = cart.findIndex(item => item.cartItemId === finalCartItemId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantityToAdd;
        } else {
            cart.push({
                id: productId,
                cartItemId: finalCartItemId,
                name: unitName ? `${productName} (${unitName})` : productName,
                price: productPrice,
                quantity: quantityToAdd, // Use quantityToAdd here
                image: imageUrl
            });
        }
        saveCart();
        const cartIcon = document.querySelector('.cart-icon a');
        if (cartIcon) {
            cartIcon.classList.add('flash');
            setTimeout(() => {
                cartIcon.classList.remove('flash');
            }, 300);
        }
        alert(`${quantityToAdd} x ${unitName ? `${productName} (${unitName})` : productName} added to cart!`);
    }

    // --- Index Page Logic ---
    if (document.querySelector('.hero-banner')) { // A way to detect if we are on index.html
        updateCartCount();

        // Function to update displayed price on product card based on selector
        function updateProductCardPrice(selectElement) {
            const productCard = selectElement.closest('.product-card');
            const basePrice = parseFloat(productCard.dataset.productBasePrice);
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            const multiplier = parseFloat(selectedOption.value);
            const currentPriceSpan = productCard.querySelector('.current-price');
            currentPriceSpan.textContent = (basePrice * multiplier).toFixed(2);
        }

        // Initialize prices and add change listeners for quantity selectors (dropdowns)
        document.querySelectorAll('.product-quantity-selector').forEach(select => {
            updateProductCardPrice(select); // Set initial price
            select.addEventListener('change', (event) => {
                updateProductCardPrice(event.target);
                // Reset product quantity display to 1 when dropdown changes
                const productCard = event.target.closest('.product-card');
                const quantityDisplay = productCard.querySelector('.product-quantity-display');
                if (quantityDisplay) {
                    quantityDisplay.textContent = '1';
                }
            });
        });

        // Add event listeners for +/- buttons on product cards
        document.querySelectorAll('.product-card').forEach(productCard => {
            const increaseBtn = productCard.querySelector('.increase-product-quantity');
            const decreaseBtn = productCard.querySelector('.decrease-product-quantity');
            const quantityDisplay = productCard.querySelector('.product-quantity-display');

            if (increaseBtn && decreaseBtn && quantityDisplay) {
                increaseBtn.addEventListener('click', () => {
                    let currentQuantity = parseInt(quantityDisplay.textContent);
                    quantityDisplay.textContent = currentQuantity + 1;
                });

                decreaseBtn.addEventListener('click', () => {
                    let currentQuantity = parseInt(quantityDisplay.textContent);
                    if (currentQuantity > 1) {
                        quantityDisplay.textContent = currentQuantity - 1;
                    }
                });
            }
        });


        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productCard = event.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                const productName = productCard.dataset.productName;
                const imgElement = productCard.querySelector('img');
                const imageUrl = imgElement ? imgElement.src : 'https://via.placeholder.com/80x80?text=Product';

                // Get quantity from the new +/- controls
                const desiredQuantityToAdd = parseInt(productCard.querySelector('.product-quantity-display').textContent);


                const quantitySelector = productCard.querySelector('.product-quantity-selector');
                let finalPrice;
                let unitName = null;
                let cartItemId = productId; // Default cart item ID for fixed products

                if (quantitySelector) {
                    // Product has a quantity scaler (dropdown)
                    const basePrice = parseFloat(productCard.dataset.productBasePrice);
                    const selectedOption = quantitySelector.options[quantitySelector.selectedIndex];
                    const multiplier = parseFloat(selectedOption.value);
                    unitName = selectedOption.dataset.unitName;
                    finalPrice = basePrice * multiplier;
                    cartItemId = `${productId}_${unitName}`; // Unique ID for scaled product
                } else {
                    // Product is a fixed unit, price is directly on the card
                    finalPrice = parseFloat(productCard.dataset.productPrice);
                    // For fixed products, the name is just the productName
                    // and cartItemId is just the productId
                }

                addProductToCart(productId, productName, finalPrice, desiredQuantityToAdd, unitName, cartItemId);

                // Reset the quantity display on the product card back to 1 after adding to cart
                const quantityDisplay = productCard.querySelector('.product-quantity-display');
                if (quantityDisplay) {
                    quantityDisplay.textContent = '1';
                }
            });
        });

        const shopNowBtn = document.querySelector('.shop-now-btn');
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                const firstCategory = document.querySelector('.product-category');
                if (firstCategory) {
                    firstCategory.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // --- Search Functionality ---
        const searchInput = document.getElementById('search-input');
        const productCards = document.querySelectorAll('.product-card');

        if (searchInput) {
            searchInput.addEventListener('keyup', (event) => {
                const searchTerm = event.target.value.toLowerCase();

                productCards.forEach(card => {
                    const productName = card.querySelector('h3').textContent.toLowerCase();
                    const productCategory = card.dataset.category.toLowerCase();

                    if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                        card.style.display = 'block'; // Show card
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.style.display = 'none'; // Hide card
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                    }
                });

                // Optionally, hide empty categories if all products are hidden
                document.querySelectorAll('.product-category').forEach(categorySection => {
                    const visibleProducts = categorySection.querySelectorAll('.product-card[style*="display: block"]');
                    if (visibleProducts.length === 0 && searchTerm !== '') {
                        categorySection.style.display = 'none';
                    } else {
                        categorySection.style.display = 'block';
                    }
                });
            });
        }
    }


    // --- Checkout Page Logic ---
    if (document.querySelector('.checkout-page')) { // A way to detect if we are on checkout.html
        const cartItemsContainer = document.getElementById('cart-items-container');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSubtotalSpan = document.getElementById('cart-subtotal');
        const deliveryFeeSpan = document.getElementById('delivery-fee');
        const cartTotalSpan = document.getElementById('cart-total');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const deliveryForm = document.getElementById('delivery-form');

        const DELIVERY_FEE = 50; // Example delivery fee

        function calculateTotals() {
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            const total = subtotal + DELIVERY_FEE;

            cartSubtotalSpan.textContent = subtotal.toFixed(2);
            deliveryFeeSpan.textContent = DELIVERY_FEE.toFixed(2);
            cartTotalSpan.textContent = total.toFixed(2);

            return { subtotal, total, deliveryFee: DELIVERY_FEE };
        }

        function renderCartItems() {
            cartItemsContainer.innerHTML = ''; // Clear previous items

            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                placeOrderBtn.disabled = true; // Disable order button if cart is empty
            } else {
                emptyCartMessage.style.display = 'none';
                placeOrderBtn.disabled = false;

                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `
                        <div class="cart-item-details">
                            <img src="${item.image}" alt="${item.name}">
                            <h4>${item.name}</h4>
                        </div>
                        <div class="cart-item-controls">
                            <button class="decrease-quantity" data-cart-item-id="${item.cartItemId}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-cart-item-id="${item.cartItemId}">+</button>
                        </div>
                        <div class="cart-item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</div>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });
            }

            calculateTotals();

            // Add event listeners for quantity buttons after rendering
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', (event) => {
                    const cartItemId = event.target.dataset.cartItemId;
                    const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
                    if (itemIndex > -1) {
                        cart[itemIndex].quantity++;
                        saveCart();
                        renderCartItems();
                    }
                });
            });

            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', (event) => {
                    const cartItemId = event.target.dataset.cartItemId;
                    const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
                    if (itemIndex > -1) {
                        if (cart[itemIndex].quantity > 1) {
                            cart[itemIndex].quantity--;
                        } else {
                            cart.splice(itemIndex, 1); // Remove item if quantity is 1
                        }
                        saveCart();
                        renderCartItems();
                    }
                });
            });
        }

        renderCartItems(); // Initial render of cart items

        // Pre-fill form if Google user exists
        const user = JSON.parse(localStorage.getItem('skEnterprisesGoogleUser'));
        if (user) {
            document.getElementById('full-name').value = user.fullName || '';
            // If you added an email field to checkout form:
            // const emailField = document.getElementById('email');
            // if (emailField) emailField.value = user.email || '';
        }


        // --- Formspree Integration ---
        deliveryForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default browser submission

            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before placing an order.');
                return;
            }

            placeOrderBtn.disabled = true; // Disable button to prevent multiple submissions
            placeOrderBtn.textContent = 'Placing Order...';

            const totals = calculateTotals();
            const orderItemsString = cart.map(item => `${item.name} (Qty: ${item.quantity}, Price: Rs. ${item.price})`).join('\n');

            // Set hidden input values for Formspree
            document.getElementById('form-cart-items').value = orderItemsString;
            document.getElementById('form-order-subtotal').value = totals.subtotal.toFixed(2);
            document.getElementById('form-order-delivery-fee').value = totals.deliveryFee.toFixed(2);
            document.getElementById('form-order-total').value = totals.total.toFixed(2);
            document.getElementById('form-order-date').value = new Date().toLocaleString();

            // Manually construct FormData for Formspree
            const formData = new FormData(deliveryForm);

            try {
                const response = await fetch(deliveryForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Order Placed Successfully! We will contact you soon.');
                    // Optionally clear the cart after successful order placement
                    cart = [];
                    saveCart();
                    renderCartItems(); // Update cart display
                    deliveryForm.reset(); // Clear form fields
                } else {
                    const data = await response.json();
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        alert(`Error: ${data["errors"].map(error => error["message"]).join(", ")}`);
                    } else {
                        alert('Oops! There was a problem placing your order.');
                    }
                }
            } catch (error) {
                console.error('Network or submission error:', error);
                alert('Oops! There was a network error. Please try again.');
            } finally {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
            }
        });
    }
});