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
    if (document.body.classList.contains('checkout-page')) { // Only update detailed cart/totals if on checkout page
        updateCartDisplay();
        updateCartTotals();
    }
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
                // To get original base price for mass products, need to divide current price by quantity
                // This assumes `item.price` is total for `item.quantity`
                basePricePerUnit = item.price / item.quantity;
            } else { // It's a fixed item
                // For fixed items, price is directly on the product card data
                const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
                basePricePerUnit = productCard ? parseFloat(productCard.dataset.productPrice) : undefined;
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
                    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
                    basePricePerUnit = productCard ? parseFloat(productCard.dataset.productPrice) : undefined;
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
let activeCategory = '#all-products'; // Keep track of the currently active category

function filterProductsByCategory(categoryId) {
    const allProductCategories = document.querySelectorAll('.product-category');
    const heroBanner = document.querySelector('.hero-banner');
    const locationSection = document.querySelector('.our-location');
    const aboutUsSection = document.querySelector('.about-us-section');

    // Update active category tracker
    activeCategory = categoryId;

    // Remove active class from all category links in header
    document.querySelectorAll('.header-categories a').forEach(a => a.classList.remove('active'));
    // Add active class to the corresponding header category link
    document.querySelector(`.header-categories a[href="${categoryId}"]`).classList.add('active');


    // Hide all product categories initially
    allProductCategories.forEach(category => {
        category.classList.remove('active');
    });

    // Hide all product cards in case some were shown by search
    document.querySelectorAll('.product-card').forEach(card => card.classList.add('hidden'));


    // Handle visibility of hero banner and other sections
    if (categoryId === '#all-products') {
        allProductCategories.forEach(category => {
            category.classList.add('active'); // Show all categories
            category.querySelectorAll('.product-card').forEach(card => card.classList.remove('hidden')); // Show all cards within them
        });
        if (heroBanner) heroBanner.style.display = 'block';
        if (locationSection) locationSection.style.display = 'block';
        if (aboutUsSection) aboutUsSection.style.display = 'block';
    } else if (categoryId) {
        const targetCategory = document.querySelector(categoryId);
        if (targetCategory) {
            targetCategory.classList.add('active'); // Show only the selected category
            targetCategory.querySelectorAll('.product-card').forEach(card => card.classList.remove('hidden')); // Show all cards within it
        }
        // Hide hero banner and other sections when a specific category is selected
        if (heroBanner) heroBanner.style.display = 'none';
        if (locationSection) locationSection.style.display = 'none';
        if (aboutUsSection) aboutUsSection.style.display = 'none';
    }
}


// --- Search Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('.product-card');
    const allProductCategories = document.querySelectorAll('.product-category');
    const heroBanner = document.querySelector('.hero-banner');
    const locationSection = document.querySelector('.our-location');
    const aboutUsSection = document.querySelector('.about-us-section');

    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm.length > 0) {
            // Temporarily show all product categories for search results
            allProductCategories.forEach(category => {
                category.classList.add('active');
            });
            // Hide hero banner and other sections during search
            if (heroBanner) heroBanner.style.display = 'none';
            if (locationSection) locationSection.style.display = 'none';
            if (aboutUsSection) aboutUsSection.style.display = 'none';

            productCards.forEach(card => {
                const productName = card.dataset.productName ? card.dataset.productName.toLowerCase() : '';
                const productCategory = card.dataset.category ? card.dataset.category.toLowerCase() : '';

                if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // Remove active class from category links in header during search
            document.querySelectorAll('.header-categories a').forEach(a => a.classList.remove('active'));

        } else {
            // If search bar is empty, revert to active category display
            filterProductsByCategory(activeCategory); // Use the stored active category
        }
    });
});


// --- UPDATED: Header Hide/Show on Scroll Logic ---
let lastScrollY = 0;
const header = document.querySelector('header');
let hideThreshold = 0; // This will be set based on the end of the product section

// Set the hideThreshold once the DOM is loaded and elements are rendered
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...

    // Determine the scroll threshold for hiding/showing the header
    // We'll use the 'about-us-section' as the marker for when products typically end.
    const aboutUsSection = document.querySelector('.about-us-section');
    if (aboutUsSection) {
        // Set threshold to the top of the About Us section, minus a little buffer
        // This means the header will ONLY start hiding/showing once you've scrolled past the products
        // and are approaching the 'About Us' section.
        hideThreshold = aboutUsSection.offsetTop - window.innerHeight * 0.1; // 10% of viewport height buffer
        if (hideThreshold < 0) hideThreshold = 0; // Ensure it's not negative
    } else {
        // Fallback for pages without an 'about-us-section' (e.g., checkout.html)
        // or if the section isn't found. Header will behave as hide on scroll down
        // after scrolling past the header itself.
        hideThreshold = header.offsetHeight + 50; // Header height + a small buffer
    }
    console.log("Header Hide Threshold (calculated):", hideThreshold);
});

window.addEventListener('scroll', () => {
    // Only apply header hide/show logic on the index.html where products are.
    // On other pages (like checkout), header stays visible (or implement separate logic).
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > hideThreshold) {
            // We are past the product section, now apply hide/show based on scroll direction
            if (currentScrollY > lastScrollY) { // Scrolling down
                header.classList.add('header-hidden');
            } else { // Scrolling up
                header.classList.remove('header-hidden');
            }
        } else {
            // We are still within or before the product section, header always visible
            header.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    }
    // For other pages, like checkout, the header will always be visible due to CSS `position: sticky` and no `header-hidden` class being applied.
});


// --- Initial Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.header-categories a, .footer-category-link'); // Select all category links including footer

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent default anchor link behavior IF on the index page
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                event.preventDefault();

                // Get the target category ID from the href
                const categoryId = event.target.getAttribute('href');
                filterProductsByCategory(categoryId);

                // Clear search input if a category is clicked
                document.getElementById('search-input').value = '';

            }
            // For links not on the current page, allow default navigation
        });
    });

    // Initial load: display all products or the specific category if linked directly
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const initialCategory = window.location.hash || '#all-products';
        filterProductsByCategory(initialCategory); // This also sets the active class
    }

    updateCartCount(); // Update cart count on all pages
    // Add 'checkout-page' class to body if it's the checkout.html
    if (window.location.pathname.includes('checkout.html')) {
        document.body.classList.add('checkout-page');
        updateCartDisplay(); // Only update detailed cart on checkout page
        updateCartTotals();  // Only update totals on checkout page
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