// --- Google Sign-In and User Management ---
let userProfile = null; // Stores Google user profile information

function handleCredentialResponse(response) {
    // Decode the ID token to get user information
    const responsePayload = jwt_decode(response.credential);
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Email: ' + responsePayload.email);
    console.log('Image URL: ' + responsePayload.picture);

    userProfile = {
        id: responsePayload.sub,
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };

    updateUserDisplay();
    saveUserProfile(); // Save to local storage
}

function updateUserDisplay() {
    const signInButton = document.querySelector('.g_id_signin');
    const signOutButton = document.getElementById('sign-out-btn');
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayNameCheckout = document.getElementById('user-display-name-checkout'); // For checkout page

    if (userProfile) {
        if (signInButton) signInButton.style.display = 'none';
        if (signOutButton) signOutButton.style.display = 'inline-block';
        if (userDisplayName) userDisplayName.textContent = `Hello, ${userProfile.name.split(' ')[0]}!`;
        if (userDisplayNameCheckout) userDisplayNameCheckout.textContent = `Logged in as: ${userProfile.name}`;
    } else {
        if (signInButton) signInButton.style.display = 'block';
        if (signOutButton) signOutButton.style.display = 'none';
        if (userDisplayName) userDisplayName.textContent = '';
        if (userDisplayNameCheckout) userDisplayNameCheckout.textContent = 'Not logged in';
    }
}

function signOut() {
    google.accounts.id.disableAutoSelect(); // Prevent automatic re-login
    userProfile = null; // Clear user profile
    localStorage.removeItem('userProfile'); // Remove from local storage
    updateUserDisplay();
    // Optional: Redirect or refresh the page after sign out
    if (window.location.pathname.includes('checkout.html')) {
        window.location.href = 'index.html'; // Go back to homepage if on checkout
    }
}

function saveUserProfile() {
    if (userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
}

function loadUserProfile() {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
        userProfile = JSON.parse(storedProfile);
        updateUserDisplay();
    }
}

// Attach sign out listener
document.addEventListener('DOMContentLoaded', () => {
    const signOutButton = document.getElementById('sign-out-btn');
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
    loadUserProfile(); // Load user profile on page load
});

// --- Cart Management ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const DELIVERY_FEE = 50; // Fixed delivery fee

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay(); // Call this to refresh cart on checkout page
    updateCartTotals();  // Call this to refresh totals
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        // Add a bounce effect when count changes
        cartCountElement.classList.remove('bounce-animation'); // Reset animation
        void cartCountElement.offsetWidth; // Trigger reflow
        cartCountElement.classList.add('bounce-animation');
    }
}

// Product Quantity Logic (for main page product cards)
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('increase-product-quantity')) {
        const productCard = event.target.closest('.product-card');
        const quantityDisplay = productCard.querySelector('.product-quantity-display');
        let currentQuantity = parseInt(quantityDisplay.textContent);
        quantityDisplay.textContent = currentQuantity + 1;
    } else if (event.target.classList.contains('decrease-product-quantity')) {
        const productCard = event.target.closest('.product-card');
        const quantityDisplay = productCard.querySelector('.product-quantity-display');
        let currentQuantity = parseInt(quantityDisplay.textContent);
        if (currentQuantity > 1) {
            quantityDisplay.textContent = currentQuantity - 1;
        }
    }
});


// Add to Cart Functionality
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId;
        const productName = productCard.dataset.productName;
        const productImage = productCard.querySelector('img').src;
        const category = productCard.dataset.category;

        let quantity = 1; // Default quantity

        // Check if it's a fixed price product or one with a dropdown
        const quantitySelector = productCard.querySelector('.product-quantity-selector');
        const quantityDisplay = productCard.querySelector('.product-quantity-display'); // For +/- buttons

        let basePrice;
        let selectedUnit = ''; // To store '1kg', '500ml' etc.

        if (quantitySelector) {
            // For products with dropdown (e.g., oil, daal)
            quantity = parseInt(quantitySelector.value); // This is the multiplier
            basePrice = parseFloat(productCard.dataset.productBasePrice); // Price per 'unit' of multiplier
            selectedUnit = quantitySelector.options[quantitySelector.selectedIndex].dataset.unitName;
        } else if (quantityDisplay) {
            // For products with +/- buttons (fixed price per item)
            quantity = parseInt(quantityDisplay.textContent);
            basePrice = parseFloat(productCard.dataset.productPrice); // Use productPrice for fixed items
        } else {
            // Fallback for simple fixed price items if no specific controls are found (shouldn't happen with current HTML)
            basePrice = parseFloat(productCard.dataset.productPrice);
        }

        const price = basePrice * quantity; // Calculate total price for the item/unit chosen


        const existingItemIndex = cart.findIndex(item => item.id === productId && item.unit === selectedUnit);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
            cart[existingItemIndex].price += price; // Add to existing total price
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: price, // This is the price for the initial quantity/unit added
                quantity: quantity, // This is the initial quantity added
                image: productImage,
                category: category,
                unit: selectedUnit // Store the selected unit
            });
        }
        saveCart();

        // Visual feedback
        button.textContent = 'Added!';
        button.style.backgroundColor = 'var(--accent-color)';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = 'var(--accent-color)'; // Reset to original color
        }, 1000);
    }
});

// Update price based on dropdown selection (for mass products)
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('product-quantity-selector')) {
        const selectElement = event.target;
        const productCard = selectElement.closest('.product-card');
        const basePrice = parseFloat(productCard.dataset.productBasePrice);
        const selectedValue = parseInt(selectElement.value);
        const newPrice = basePrice * selectedValue;

        productCard.querySelector('.current-price').textContent = newPrice;
    }
});


// --- Checkout Page Logic ---
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    if (!cartItemsContainer) return; // Exit if not on checkout page

    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.productId = item.id;
            cartItemDiv.dataset.productUnit = item.unit; // Store unit for uniqueness

            const unitDisplay = item.unit ? ` (${item.unit})` : '';

            cartItemDiv.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}${unitDisplay}</h4>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-quantity" data-id="${item.id}" data-unit="${item.unit}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}" data-unit="${item.unit}">+</button>
                </div>
                <div class="cart-item-price">Rs. ${item.price}</div>
                <button class="remove-item" data-id="${item.id}" data-unit="${item.unit}"><i class="fas fa-trash-alt"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }
}

function updateCartTotals() {
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const cartTotalElement = document.getElementById('cart-total');
    const placeOrderBtn = document.getElementById('place-order-btn');

    if (!cartSubtotalElement) return; // Exit if not on checkout page

    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let total = subtotal + DELIVERY_FEE;

    cartSubtotalElement.textContent = subtotal;
    deliveryFeeElement.textContent = DELIVERY_FEE;
    cartTotalElement.textContent = total;

    // Update hidden form fields for Formspree
    if (document.getElementById('form-cart-items')) {
        document.getElementById('form-cart-items').value = JSON.stringify(cart.map(item => ({
            name: item.name + (item.unit ? ` (${item.unit})` : ''),
            quantity: item.quantity,
            price: item.price
        })));
        document.getElementById('form-order-subtotal').value = subtotal;
        document.getElementById('form-order-delivery-fee').value = DELIVERY_FEE;
        document.getElementById('form-order-total').value = total;
        document.getElementById('form-order-date').value = new Date().toLocaleString();
    }

    // Enable/disable place order button
    if (placeOrderBtn) {
        placeOrderBtn.disabled = cart.length === 0;
        if (cart.length === 0) {
            placeOrderBtn.textContent = 'Cart is Empty';
        } else {
            placeOrderBtn.textContent = 'Place Order';
        }
    }
}

// Event delegation for cart item controls on checkout page
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('increase-quantity')) {
        const productId = event.target.dataset.id;
        const productUnit = event.target.dataset.unit || '';
        const itemIndex = cart.findIndex(item => item.id === productId && (item.unit || '') === productUnit);

        if (itemIndex > -1) {
            const item = cart[itemIndex];
            let basePricePerUnit;

            // Get base price for calculation based on unit or fixed item
            if (item.unit) { // It's a mass product with a unit
                basePricePerUnit = item.price / item.quantity;
            } else { // It's a fixed item
                basePricePerUnit = parseFloat(document.querySelector(`.product-card[data-product-id="${productId}"]`).dataset.productPrice);
            }

            if (basePricePerUnit !== undefined) {
                cart[itemIndex].quantity++;
                cart[itemIndex].price += basePricePerUnit;
                saveCart();
            } else {
                console.warn(`Could not find base price for product ${productId} with unit ${productUnit}`);
            }
        }
    } else if (event.target.classList.contains('decrease-quantity')) {
        const productId = event.target.dataset.id;
        const productUnit = event.target.dataset.unit || '';
        const itemIndex = cart.findIndex(item => item.id === productId && (item.unit || '') === productUnit);

        if (itemIndex > -1) {
            const item = cart[itemIndex];
            if (item.quantity > 1) {
                let basePricePerUnit;
                if (item.unit) {
                    basePricePerUnit = item.price / item.quantity; // Price of one unit
                } else {
                    basePricePerUnit = parseFloat(document.querySelector(`.product-card[data-product-id="${productId}"]`).dataset.productPrice);
                }

                if (basePricePerUnit !== undefined) {
                    cart[itemIndex].quantity--;
                    cart[itemIndex].price -= basePricePerUnit;
                    saveCart();
                }
            } else {
                // If quantity is 1, remove item from cart
                cart.splice(itemIndex, 1);
                saveCart();
            }
        }
    } else if (event.target.classList.contains('remove-item') || event.target.closest('.remove-item')) {
        const button = event.target.closest('.remove-item');
        const productId = button.dataset.id;
        const productUnit = button.dataset.unit || '';
        const itemIndex = cart.findIndex(item => item.id === productId && (item.unit || '') === productUnit);

        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
            saveCart();
        }
    }
});


// --- Form Submission (Formspree) ---
document.addEventListener('DOMContentLoaded', function() {
    const deliveryForm = document.getElementById('delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before placing an order.');
                return;
            }

            const placeOrderBtn = document.getElementById('place-order-btn');
            placeOrderBtn.disabled = true; // Disable button to prevent multiple submissions
            placeOrderBtn.textContent = 'Placing Order...';

            const formData = new FormData(deliveryForm);
            const response = await fetch(deliveryForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Order placed successfully! Thank you for shopping with SK Enterprises.');
                cart = []; // Clear cart after successful order
                saveCart(); // Update local storage and UI
                deliveryForm.reset(); // Clear form fields
                // Optional: Redirect to a confirmation page
                // window.location.href = 'order-confirmation.html';
            } else {
                alert('There was an error placing your order. Please try again.');
                placeOrderBtn.disabled = false; // Re-enable button
                placeOrderBtn.textContent = 'Place Order';
            }
        });
    }
});


// --- Category Filtering Logic ---
function filterProductsByCategory(categoryId) {
    const allProductCategories = document.querySelectorAll('.product-category');
    const heroBanner = document.querySelector('.hero-banner');
    const locationSection = document.querySelector('.our-location');
    const aboutUsSection = document.querySelector('.about-us-section');

    // Hide all product categories initially
    allProductCategories.forEach(category => {
        category.classList.remove('active');
    });

    // Handle visibility of hero banner and other sections
    if (categoryId === '#all-products') {
        allProductCategories.forEach(category => {
            category.classList.add('active'); // Show all categories
        });
        if (heroBanner) heroBanner.style.display = 'block';
        if (locationSection) locationSection.style.display = 'block';
        if (aboutUsSection) aboutUsSection.style.display = 'block';
    } else if (categoryId) {
        const targetCategory = document.querySelector(categoryId);
        if (targetCategory) {
            targetCategory.classList.add('active'); // Show only the selected category
        }
        // Hide hero banner and other sections when a specific category is selected
        if (heroBanner) heroBanner.style.display = 'none';
        if (locationSection) locationSection.style.display = 'none';
        if (aboutUsSection) aboutUsSection.style.display = 'none';
    }
}


// Event listener for category navigation links
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.header-categories a, .footer-category-link'); // Select all category links including footer

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent default anchor link behavior IF on the index page
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                event.preventDefault();

                // Remove active class from all header category links
                document.querySelectorAll('.header-categories a').forEach(a => a.classList.remove('active'));

                // Add active class to the clicked link
                event.target.classList.add('active');

                // Get the target category ID from the href
                const categoryId = event.target.getAttribute('href');
                filterProductsByCategory(categoryId);
            }
            // For links not on the current page, allow default navigation
        });
    });

    // Initial load: display all products or the specific category if linked directly
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const initialCategory = window.location.hash || '#all-products';
        filterProductsByCategory(initialCategory);
        // Set active class for the initial category
        document.querySelectorAll('.header-categories a').forEach(a => {
            if (a.getAttribute('href') === initialCategory) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }

    updateCartCount(); // Update cart count on all pages
    if (document.body.classList.contains('checkout-page')) {
        updateCartDisplay(); // Only update detailed cart on checkout page
        updateCartTotals();  // Only update totals on checkout page
    }
    // Add 'checkout-page' class to body if it's the checkout.html
    if (window.location.pathname.includes('checkout.html')) {
        document.body.classList.add('checkout-page');
    }
});


// --- JWT Decode Library (required for Google Sign-In) ---
// This is a minimal implementation of jwt-decode.
// In a real project, you would include the full library from a CDN or npm.
// For demonstration, here's a simple version.
function jwt_decode(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return {};
    }
}