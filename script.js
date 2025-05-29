// --- Google Sign-In and User Management ---
let userProfile = null; // Stores Google user profile information

// This function is called by the Google Sign-In button after successful login
function handleCredentialResponse(response) {
    try {
        // Check if jwt_decode is available
        if (typeof jwt_decode === 'undefined') {
            console.error('jwt_decode library not loaded');
            alert('Authentication library not loaded. Please refresh the page.');
            return;
        }

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
    } catch (error) {
        console.error('Error handling credential response:', error);
        alert('Error during sign-in. Please try again.');
    }
}

// Updates the display of user's login status (e.g., show "Hello, User!" or sign-in button)
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

    // Also update place order button state based on login
    updateCartTotals();
}

// Handles user sign-out
function signOut() {
    try {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect(); // Prevent automatic re-login
        }
        userProfile = null; // Clear user profile
        
        // Try to remove from localStorage, handle gracefully if not available
        try {
            localStorage.removeItem('userProfile');
        } catch (e) {
            console.warn('localStorage not available for user profile removal');
        }
        
        updateUserDisplay();
        // Redirect or refresh the page after sign out
        if (window.location.pathname.includes('checkout.html')) {
            window.location.href = 'index.html'; // Go back to homepage if on checkout
        }
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

// Saves user profile to local storage
function saveUserProfile() {
    if (userProfile) {
        try {
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        } catch (e) {
            console.warn('localStorage not available for saving user profile');
        }
    }
}

// Loads user profile from local storage on page load
function loadUserProfile() {
    try {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            userProfile = JSON.parse(storedProfile);
            updateUserDisplay();
        }
    } catch (e) {
        console.warn('localStorage not available or corrupted user profile data');
    }
}

// --- Cart Management ---
// Cart stores items as: { id, name, price_per_unit, quantity, unitName, image, category }
let cart = [];
const DELIVERY_FEE = 50; // Fixed delivery fee

// Initialize cart from localStorage
function initializeCart() {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (e) {
        console.warn('localStorage not available or corrupted cart data');
        cart = [];
    }
}

// Saves cart to local storage and updates UI elements
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.warn('localStorage not available for saving cart');
    }
    
    updateCartCount();
    if (document.body.classList.contains('checkout-page')) {
        updateCartDisplay();
        updateCartTotals();
    }
}

// Updates the number of items displayed in the cart icon
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

// Adds a product to the cart or updates its quantity if already present
function addToCart(product) {
    const existingItem = cart.find(item =>
        item.id === product.id && item.unitName === product.unitName
    );
    if (existingItem) {
        existingItem.quantity += product.quantity;
        // The price_per_unit is already stored, so no need to adjust it here.
        // Total price for the item will be calculated dynamically.
    } else {
        cart.push(product);
    }
    saveCart();
}

// Updates the quantity of a specific item in the cart
function updateCartItemQuantity(productId, unitName, newQuantity) {
    const itemIndex = cart.findIndex(item =>
        item.id === productId && (item.unitName || '') === (unitName || '')
    );

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeCartItem(productId, unitName); // Remove if quantity is 0 or less
        } else {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
        }
    }
}

// Removes an item completely from the cart
function removeCartItem(productId, unitName) {
    cart = cart.filter(item =>
        !(item.id === productId && (item.unitName || '') === (unitName || ''))
    );
    saveCart();
}

// --- Checkout Page Functions ---
// Renders the cart items on the checkout page
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (!cartItemsContainer) return; // Exit if not on checkout page

    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';

    cart.forEach(item => {
        // Ensure price_per_unit and quantity are numbers
        const pricePerUnit = parseFloat(item.price_per_unit) || 0;
        const quantity = parseInt(item.quantity) || 0;

        const totalItemPrice = pricePerUnit * quantity;
        const unitDisplay = item.unitName ? ` (${item.unitName})` : '';

        // FIXED: Create the cart item element properly
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}${unitDisplay}</h4>
            </div>
            <div class="cart-item-controls">
                <button class="decrease-cart-quantity" data-id="${item.id}" data-unit-name="${item.unitName || ''}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-cart-quantity" data-id="${item.id}" data-unit-name="${item.unitName || ''}">+</button>
                <button class="remove-item" data-id="${item.id}" data-unit-name="${item.unitName || ''}"><i class="fas fa-trash"></i></button>
            </div>
            <div class="cart-item-price">Rs. ${totalItemPrice.toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Attach event listeners using delegation or direct attachment
        const increaseBtn = cartItem.querySelector('.increase-cart-quantity');
        const decreaseBtn = cartItem.querySelector('.decrease-cart-quantity');
        const removeBtn = cartItem.querySelector('.remove-item');

        if (increaseBtn) {
            increaseBtn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const unit = e.target.dataset.unitName;
                const currentItem = cart.find(cartItem => cartItem.id === id && (cartItem.unitName || '') === (unit || ''));
                if (currentItem) {
                    updateCartItemQuantity(id, unit, currentItem.quantity + 1);
                }
            });
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const unit = e.target.dataset.unitName;
                const currentItem = cart.find(cartItem => cartItem.id === id && (cartItem.unitName || '') === (unit || ''));
                if (currentItem) {
                    updateCartItemQuantity(id, unit, currentItem.quantity - 1);
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                const id = e.target.dataset.id || e.target.closest('button').dataset.id;
                const unit = e.target.dataset.unitName || e.target.closest('button').dataset.unitName;
                removeCartItem(id, unit);
            });
        }
    });
}

// Updates the subtotal, delivery fee, and total on the checkout page
function updateCartTotals() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const totalElement = document.getElementById('cart-total');
    const placeOrderButton = document.getElementById('place-order-btn');

    if (!subtotalElement) return; // Exit if not on checkout page

    const subtotal = cart.reduce((sum, item) => sum + ( (parseFloat(item.price_per_unit) || 0) * (parseInt(item.quantity) || 0) ), 0);
    const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    subtotalElement.textContent = subtotal.toFixed(2);
    if (deliveryFeeElement) deliveryFeeElement.textContent = deliveryFee.toFixed(2);
    if (totalElement) totalElement.textContent = total.toFixed(2);

    if (placeOrderButton) {
        // Disable button if cart is empty OR user is not logged in
        placeOrderButton.disabled = cart.length === 0 || !userProfile;
        if (cart.length === 0) {
            placeOrderButton.textContent = 'Cart is Empty';
        } else if (!userProfile) {
            placeOrderButton.textContent = 'Sign In to Place Order';
        } else {
            placeOrderButton.textContent = 'Place Order';
        }
    }
}

// --- Category Navigation ---
// Displays all product categories and resets search
function showAllProducts() {
    const navLinks = document.querySelectorAll('.header-categories ul li a');
    const productCategories = document.querySelectorAll('.product-category');
    const allProductsLink = document.querySelector('.header-categories a[href="#all-products"]');

    navLinks.forEach(link => link.classList.remove('active'));
    if (allProductsLink) allProductsLink.classList.add('active');

    productCategories.forEach(category => {
        category.classList.add('active');
    });

    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('hidden');
    });

    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon');
    if (searchInput) {
        searchInput.value = '';
        searchInput.classList.remove('active');
    }
    if (searchIcon) {
        searchIcon.classList.remove('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setupProductCardAnimations();
}

// Sets up click listeners for category navigation links
function setupCategoryNavigation() {
    const navLinks = document.querySelectorAll('.header-categories ul li a');
    const productCategories = document.querySelectorAll('.product-category');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            productCategories.forEach(category => {
                if (targetId === 'all-products' || category.id === targetId) {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });

            // Hide/show product cards within visible categories
            document.querySelectorAll('.product-card').forEach(card => {
                const cardCategory = card.closest('.product-category');
                if (cardCategory && cardCategory.classList.contains('active')) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            if (targetId !== 'all-products') {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset - 20, // Add some padding
                        behavior: 'smooth'
                    });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            setupProductCardAnimations();
        });
    });

    // Event listeners for logo and "Shop Now" button to show all products
    const logoLink = document.querySelector('.logo a');
    const shopNowButton = document.querySelector('.shop-now-btn');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAllProducts();
        });
    }
    if (shopNowButton) {
        shopNowButton.addEventListener('click', function(e) {
            e.preventDefault();
            showAllProducts();
        });
    }
}

// --- Search Functionality ---
function setupSearch() {
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    if (!searchInput || !searchIcon || !searchContainer) {
        console.error('Search elements not found');
        return;
    }

    // Toggle search input visibility
    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from triggering document click
        const isActive = searchInput.classList.toggle('active');
        searchIcon.classList.toggle('active');
        if (isActive) {
            searchInput.focus();
        } else {
            // If search input is closed and empty, show all products
            if (!searchInput.value) {
                showAllProducts();
            }
        }
    });

    // Close search input when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchInput.classList.remove('active');
            searchIcon.classList.remove('active');
            if (!searchInput.value) {
                showAllProducts();
            }
        }
    });

    // Prevent closing when clicking input itself
    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        const productCategories = document.querySelectorAll('.product-category');
        const navLinks = document.querySelectorAll('.header-categories ul li a');

        // Remove active class from category links during search
        navLinks.forEach(link => link.classList.remove('active'));

        // Reset all categories and cards visibility initially for search
        productCategories.forEach(category => {
            category.classList.remove('active');
        });
        productCards.forEach(card => {
            card.classList.add('hidden');
        });

        // Show matching products and their categories
        if (query) {
            let foundMatch = false;
            productCards.forEach(card => {
                const productName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                if (productName.includes(query)) {
                    card.classList.remove('hidden');
                    const category = card.closest('.product-category');
                    if (category) {
                        category.classList.add('active'); // Show category if it contains a matching product
                    }
                    foundMatch = true;
                }
            });
            // If no match, might want to show a message or keep all products hidden
            if (!foundMatch && productCards.length > 0) {
                // Optionally display a "No results found" message
                // For now, it just hides all products
            }
        } else {
            // If search query is empty, show all products
            showAllProducts();
        }

        setupProductCardAnimations(); // Re-apply animations to visible cards
    });
}

// --- Product Quantity and Price Updates on Main Page ---
function setupProductControls() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Use || 0 to default to 0 if parseFloat results in NaN
        const basePrice = parseFloat(card.dataset.productPrice) || 0;
        const basePricePerUnit = parseFloat(card.dataset.productBasePrice) || 0;

        const priceDisplay = card.querySelector('.current-price');
        const quantitySelector = card.querySelector('.product-quantity-selector'); // For dropdowns
        const quantityDisplay = card.querySelector('.product-quantity-display'); // For +/- buttons

        if (!priceDisplay) {
            console.warn('Price display element not found for product card');
            return;
        }

        // Initial price setup
        if (quantitySelector) {
            // For products with dropdown (e.g., oil, daal)
            const multiplier = parseFloat(quantitySelector.value) || 1; // Default to 1 if NaN
            const initialPrice = basePricePerUnit * multiplier;
            priceDisplay.textContent = initialPrice.toFixed(2);
        } else if (quantityDisplay) {
            // For products with +/- buttons (fixed price per item)
            priceDisplay.textContent = basePrice.toFixed(2);
        } else {
             // Fallback for simple fixed price items if no specific controls are found
            priceDisplay.textContent = basePrice.toFixed(2);
        }

        // Add a check to warn if price is NaN after initial setup
        if (isNaN(parseFloat(priceDisplay.textContent))) {
            console.warn(`Initial price for product "${card.dataset.productName || card.querySelector('h3')?.textContent}" is NaN. Check data-product-price or data-product-base-price.`);
        }
    });

    // Event delegation for quantity changes (plus/minus buttons)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('increase-product-quantity')) {
            const quantityDisplay = event.target.closest('.product-card')?.querySelector('.product-quantity-display');
            if (quantityDisplay) {
                let currentQuantity = parseInt(quantityDisplay.textContent) || 0; // Default to 0 if NaN
                quantityDisplay.textContent = currentQuantity + 1;
            }
        } else if (event.target.classList.contains('decrease-product-quantity')) {
            const quantityDisplay = event.target.closest('.product-card')?.querySelector('.product-quantity-display');
            if (quantityDisplay) {
                let currentQuantity = parseInt(quantityDisplay.textContent) || 0; // Default to 0 if NaN
                if (currentQuantity > 1) {
                    quantityDisplay.textContent = currentQuantity - 1;
                }
            }
        }
    });

    // Event delegation for unit selector changes (dropdowns)
    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('product-quantity-selector')) {
            const selectElement = event.target;
            const productCard = selectElement.closest('.product-card');
            if (!productCard) return;

            const basePricePerUnit = parseFloat(productCard.dataset.productBasePrice) || 0; // Default to 0 if NaN
            const selectedMultiplier = parseFloat(selectElement.value) || 1; // Default to 1 if NaN
            const newPrice = basePricePerUnit * selectedMultiplier;
            const priceDisplay = productCard.querySelector('.current-price');
            if (priceDisplay) {
                priceDisplay.textContent = newPrice.toFixed(2);
            }

            if (isNaN(newPrice)) {
                console.warn(`Price calculation for product "${productCard.dataset.productName || productCard.querySelector('h3')?.textContent}" resulted in NaN. Check data-product-base-price or selector values.`);
            }
        }
    });

    // Event delegation for Add to Cart button
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const button = event.target;
            const productCard = button.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName || productCard.querySelector('h3')?.textContent?.split(' (')[0] || 'Unknown Product';
            const productImageEl = productCard.querySelector('img');
            const productImage = productImageEl ? productImageEl.src : '';
            const category = productCard.dataset.category || '';

            let quantity = 1;
            let pricePerUnit; // This will be the price for a single "item" or selected "unit"
            let unitName = '';

            const quantitySelector = productCard.querySelector('.product-quantity-selector');
            const quantityDisplay = productCard.querySelector('.product-quantity-display');

            if (quantitySelector) {
                // For products with a dropdown (e.g., oil, daal)
                quantity = 1; // Always add 1 of the selected unit from dropdown
                // Ensure basePricePerUnit and selectedMultiplier are numbers, defaulting to 0 or 1
                const basePriceForCalc = parseFloat(productCard.dataset.productBasePrice) || 0;
                const selectedMultiplier = parseFloat(quantitySelector.value) || 1;
                pricePerUnit = basePriceForCalc * selectedMultiplier; // Price for the *selected unit* (e.g., price of 1kg oil)
                const selectedOption = quantitySelector.options[quantitySelector.selectedIndex];
                unitName = selectedOption?.dataset.unitName || '';
            } else if (quantityDisplay) {
                // For products with +/- buttons (fixed price per item)
                quantity = parseInt(quantityDisplay.textContent) || 1; // Default to 1 if NaN
                pricePerUnit = parseFloat(productCard.dataset.productPrice) || 0; // Price of one fixed item, default to 0 if NaN
                const h3Element = productCard.querySelector('h3');
                unitName = h3Element ? (h3Element.textContent.match(/\((.*?)\)/)?.[1] || '') : ''; // Try to extract unit from name
            } else {
                // Fallback for simple fixed price items (default to 1 quantity)
                quantity = 1;
                pricePerUnit = parseFloat(productCard.dataset.productPrice) || 0; // Default to 0 if NaN
                const h3Element = productCard.querySelector('h3');
                unitName = h3Element ? (h3Element.textContent.match(/\((.*?)\)/)?.[1] || '') : '';
            }

            if (isNaN(pricePerUnit) || isNaN(quantity)) {
                console.error(`Error adding product to cart: Price or quantity is NaN for product ID: ${productId}, Name: ${productName}. Price: ${pricePerUnit}, Quantity: ${quantity}.`);
                alert('Could not add product to cart due to invalid price/quantity data.');
                return; // Prevent adding invalid item to cart
            }

            const product = {
                id: productId,
                name: productName,
                price_per_unit: pricePerUnit, // Store the price for *one* of the selected unit/item
                quantity: quantity,
                unitName: unitName,
                image: productImage,
                category: category
            };
            addToCart(product);

            // Reset quantity display for +/- buttons
            if (quantityDisplay) {
                quantityDisplay.textContent = '1';
            }

            // Visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--added-to-cart-color, #4CAF50)'; // Use CSS variable or default
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = ''; // Reset to original via CSS
            }, 1000);
        }
    });
}

// --- Product Card Animation Setup ---
// Applies a slide-in animation to visible product cards
function setupProductCardAnimations() {
    const productCards = document.querySelectorAll('.product-card:not(.hidden)');
    productCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index); // Stagger animation
        card.style.animation = 'none'; // Reset animation
        void card.offsetWidth; // Trigger reflow to restart animation
        card.style.animation = 'slideIn 0.5s ease-out forwards';
    });
}

// --- Checkout Form Submission ---
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('delivery-form');
    const placeOrderButton = document.getElementById('place-order-btn');
    if (!checkoutForm || !placeOrderButton) return;

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!userProfile) {
            alert('Please sign in to place an order.');
            return;
        }
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before placing an order.');
            return;
        }

        const cartItemsInput = document.getElementById('form-cart-items');
        const subtotalInput = document.getElementById('form-order-subtotal');
        const deliveryFeeInput = document.getElementById('form-order-delivery-fee');
        const totalInput = document.getElementById('form-order-total');
        const orderDateInput = document.getElementById('form-order-date');

        const subtotal = cart.reduce((sum, item) => sum + ( (parseFloat(item.price_per_unit) || 0) * (parseInt(item.quantity) || 0) ), 0);
        const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
        const total = subtotal + deliveryFee;

        // Populate hidden form fields
        if (cartItemsInput) {
            cartItemsInput.value = JSON.stringify(cart.map(item => ({
                name: item.name,
                unit: item.unitName,
                quantity: item.quantity,
                price_per_unit: (parseFloat(item.price_per_unit) || 0).toFixed(2), // Ensure string representation
                total_item_price: ( (parseFloat(item.price_per_unit) || 0) * (parseInt(item.quantity) || 0) ).toFixed(2)
            })));
        }
        if (subtotalInput) subtotalInput.value = subtotal.toFixed(2);
        if (deliveryFeeInput) deliveryFeeInput.value = deliveryFee.toFixed(2);
        if (totalInput) totalInput.value = total.toFixed(2);
        if (orderDateInput) orderDateInput.value = new Date().toISOString(); // ISO string for precise date/time

        const formData = new FormData(checkoutForm);
        // Using fetch for form submission to Formspree or similar service
        fetch(checkoutForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Order placed successfully! Thank you for shopping with SK Enterprises.');
                cart = []; // Clear cart after successful order
                saveCart(); // Save empty cart to local storage
                window.location.href = 'index.html'; // Redirect to home page
            } else {
                alert('There was an error placing your order. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error submitting form:', error);
            alert('There was an error placing your order. Please try again.');
        });
    });

    // Toggle eSewa QR code visibility based on payment method selection
    const paymentOptions = document.querySelectorAll('input[name="Payment Method"]');
    const esewaQrCode = document.querySelector('.esewa-qr-code'); // Assuming this is an image or container for it
    if (esewaQrCode) {
        paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                esewaQrCode.style.display = option.value === 'eSewa' ? 'block' : 'none';
            });
        });
        // Set initial state
        const initialSelectedPayment = document.querySelector('input[name="Payment Method"]:checked');
        if (initialSelectedPayment) {
            esewaQrCode.style.display = initialSelectedPayment.value === 'eSewa' ? 'block' : 'none';
        }
    }
}

// --- Initialize Page ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart first
    initializeCart();
    
    loadUserProfile(); // Load user profile on page load
    updateCartCount(); // Update cart count in header

    // Check if on checkout page using a class on the body element
    if (document.body.classList.contains('checkout-page')) {
        updateCartDisplay(); // Populate cart items
        updateCartTotals(); // Calculate and display totals
        setupCheckoutForm(); // Setup form submission logic
    } else {
        // Assume main product display page
        setupCategoryNavigation(); // Setup category filters
        setupSearch(); // Setup search functionality
        setupProductControls(); // Setup product quantity and add to cart buttons
        showAllProducts(); // Ensure all products are shown initially on home page
    }

    // Attach sign out listener
    const signOutButton = document.getElementById('sign-out-btn');
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
});