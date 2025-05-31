// --- Google Sign-In and User Management ---
let userProfile = null;

function handleCredentialResponse(response) {
    try {
        if (typeof jwt_decode === 'undefined') {
            console.error('jwt_decode library not loaded');
            alert('Authentication library not loaded. Please refresh the page.');
            return;
        }

        const responsePayload = jwt_decode(response.credential);
        userProfile = {
            id: responsePayload.sub,
            name: responsePayload.name,
            email: responsePayload.email,
            picture: responsePayload.picture
        };

        updateUserDisplay();
        saveUserProfile();
    } catch (error) {
        console.error('Error handling credential response:', error);
        alert('Error during sign-in. Please try again.');
    }
}

function updateUserDisplay() {
    const signInButton = document.querySelector('.g_id_signin');
    const signOutButton = document.getElementById('sign-out-btn');
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayNameCheckout = document.getElementById('user-display-name-checkout');

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
    updateCartTotals();
}

function signOut() {
    try {
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
        userProfile = null;
        try {
            localStorage.removeItem('userProfile');
        } catch (e) {
            console.warn('localStorage not available for user profile removal');
        }
        updateUserDisplay();
        if (window.location.pathname.includes('checkout.html')) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

function saveUserProfile() {
    if (userProfile) {
        try {
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        } catch (e) {
            console.warn('localStorage not available for saving user profile');
        }
    }
}

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
let cart = [];
const DELIVERY_FEE = 50;

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

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.classList.remove('bounce-animation');
        void cartCountElement.offsetWidth;
        cartCountElement.classList.add('bounce-animation');
    }
}

function addToCart(product) {
    const existingItem = cart.find(item =>
        item.id === product.id && item.unitName === product.unitName
    );
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    saveCart();
}

function updateCartItemQuantity(productId, unitName, newQuantity) {
    const itemIndex = cart.findIndex(item =>
        item.id === productId && (item.unitName || '') === (unitName || '')
    );
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeCartItem(productId, unitName);
        } else {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
        }
    }
}

function removeCartItem(productId, unitName) {
    cart = cart.filter(item =>
        !(item.id === productId && (item.unitName || '') === (unitName || ''))
    );
    saveCart();
}

// --- Checkout Page Functions ---
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';

    cart.forEach(item => {
        const pricePerUnit = parseFloat(item.price_per_unit) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const totalItemPrice = pricePerUnit * quantity;
        const unitDisplay = item.unitName ? ` (${item.unitName})` : '';

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}${unitDisplay}</h4>
            </div>
            <div class="cart-item-controls">
                <button type="button" class="decrease-cart-quantity" data-id="${item.id}" data-unit-name="${item.unitName || ''}">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="increase-cart-quantity" data-id="${item.id}" data-unit-name="${item.unitName || ''}">+</button>
                <button type="button" class="remove-item" data-id="${item.id}" data-unit-name="${item.unitName || ''}"><i class="fas fa-trash"></i></button>
            </div>
            <div class="cart-item-price">Rs. ${totalItemPrice.toFixed(2)}</div>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Add event listeners to the newly created buttons
        cartItem.querySelector('.increase-cart-quantity').addEventListener('click', () => {
            updateCartItemQuantity(item.id, item.unitName, item.quantity + 1);
        });
        cartItem.querySelector('.decrease-cart-quantity').addEventListener('click', () => {
            updateCartItemQuantity(item.id, item.unitName, item.quantity - 1);
        });
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            removeCartItem(item.id, item.unitName);
        });
    });
}

function updateCartTotals() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const totalElement = document.getElementById('cart-total');
    const placeOrderButton = document.getElementById('place-order-btn');

    if (!subtotalElement) return;

    const subtotal = cart.reduce((sum, item) => sum + ((parseFloat(item.price_per_unit) || 0) * (parseInt(item.quantity) || 0)), 0);
    const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    subtotalElement.textContent = subtotal.toFixed(2);
    if (deliveryFeeElement) deliveryFeeElement.textContent = deliveryFee.toFixed(2);
    if (totalElement) totalElement.textContent = total.toFixed(2);

    if (placeOrderButton) {
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

// --- Product Display and Controls ---
function setupProductControls() {
    // Initialize all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        // Initialize price display
        const priceDisplay = card.querySelector('.current-price');
        const quantitySelector = card.querySelector('.product-quantity-selector');
        
        if (quantitySelector) {
            // For products with quantity selectors
            const basePrice = parseFloat(card.dataset.productBasePrice) || 0;
            const selectedValue = parseFloat(quantitySelector.value) || 1;
            priceDisplay.textContent = (basePrice * selectedValue).toFixed(2);
            
            // Add change event for quantity selector
            quantitySelector.addEventListener('change', function() {
                const newValue = parseFloat(this.value) || 1;
                priceDisplay.textContent = (basePrice * newValue).toFixed(2);
            });
        } else {
            // For simple products
            const basePrice = parseFloat(card.dataset.productPrice) || 0;
            priceDisplay.textContent = basePrice.toFixed(2);
        }

        // Add to cart button
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productId = card.dataset.productId;
                const productName = card.dataset.productName || card.querySelector('h3')?.textContent?.split(' (')[0] || 'Unknown';
                const productImage = card.querySelector('img')?.src || '';
                const category = card.dataset.category || '';
                
                let quantity = 1;
                let pricePerUnit;
                let unitName = '';

                if (quantitySelector) {
                    // For products with quantity selectors
                    const basePrice = parseFloat(card.dataset.productBasePrice) || 0;
                    const selectedValue = parseFloat(quantitySelector.value) || 1;
                    pricePerUnit = basePrice * selectedValue;
                    const selectedOption = quantitySelector.options[quantitySelector.selectedIndex];
                    unitName = selectedOption?.dataset.unitName || '';
                } else {
                    // For simple products
                    pricePerUnit = parseFloat(card.dataset.productPrice) || 0;
                    const h3Element = card.querySelector('h3');
                    unitName = h3Element ? (h3Element.textContent.match(/\((.*?)\)/)?.[1] || '') : '';
                    
                    // Check if there's a quantity display
                    const quantityDisplay = card.querySelector('.product-quantity-display');
                    if (quantityDisplay) {
                        quantity = parseInt(quantityDisplay.textContent) || 1;
                    }
                }

                // Add to cart
                addToCart({
                    id: productId,
                    name: productName,
                    price_per_unit: pricePerUnit,
                    quantity: quantity,
                    unitName: unitName,
                    image: productImage,
                    category: category
                });

                // Show feedback
                const originalText = addToCartBtn.textContent;
                addToCartBtn.textContent = 'Added!';
                addToCartBtn.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    addToCartBtn.textContent = originalText;
                    addToCartBtn.style.backgroundColor = '';
                }, 1000);
            });
        }

        // Quantity controls for products with +- buttons
        const quantityDisplay = card.querySelector('.product-quantity-display');
        if (quantityDisplay) {
            const increaseBtn = card.querySelector('.increase-product-quantity');
            const decreaseBtn = card.querySelector('.decrease-product-quantity');
            
            if (increaseBtn) {
                increaseBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    let current = parseInt(quantityDisplay.textContent) || 1;
                    quantityDisplay.textContent = current + 1;
                });
            }
            
            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    let current = parseInt(quantityDisplay.textContent) || 1;
                    if (current > 1) {
                        quantityDisplay.textContent = current - 1;
                    }
                });
            }
        }
    });
}

// --- Category Navigation ---
function setupCategoryNavigation() {
    const navLinks = document.querySelectorAll('.header-categories ul li a');
    const productCategories = document.querySelectorAll('.product-category');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show/hide categories
            productCategories.forEach(category => {
                if (targetId === 'all-products' || category.id === targetId) {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });

            // Scroll to category if not "all products"
            if (targetId !== 'all-products') {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerOffset - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Logo and shop now button
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAllProducts();
        });
    }
}

function showAllProducts() {
    const navLinks = document.querySelectorAll('.header-categories ul li a');
    const productCategories = document.querySelectorAll('.product-category');
    const allProductsLink = document.querySelector('.header-categories a[href="#all-products"]');

    // Update active state
    navLinks.forEach(link => link.classList.remove('active'));
    if (allProductsLink) allProductsLink.classList.add('active');

    // Show all categories
    productCategories.forEach(category => {
        category.classList.add('active');
    });

    // Reset search
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-icon');
    if (searchInput) {
        searchInput.value = '';
        searchInput.classList.remove('active');
    }
    if (searchIcon) {
        searchIcon.classList.remove('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Search Functionality ---
function setupSearch() {
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    if (!searchInput || !searchIcon || !searchContainer) return;

    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = searchInput.classList.toggle('active');
        searchIcon.classList.toggle('active');
        if (isActive) {
            searchInput.focus();
        } else if (!searchInput.value) {
            showAllProducts();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchInput.classList.remove('active');
            searchIcon.classList.remove('active');
            if (!searchInput.value) {
                showAllProducts();
            }
        }
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        const productCategories = document.querySelectorAll('.product-category');
        const navLinks = document.querySelectorAll('.header-categories ul li a');

        if (query) {
            // Hide all first
            productCategories.forEach(category => category.classList.remove('active'));
            productCards.forEach(card => card.classList.add('hidden'));
            navLinks.forEach(link => link.classList.remove('active'));

            // Show matching products
            let foundMatch = false;
            productCards.forEach(card => {
                const productName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                if (productName.includes(query)) {
                    card.classList.remove('hidden');
                    const category = card.closest('.product-category');
                    if (category) {
                        category.classList.add('active');
                        foundMatch = true;
                    }
                }
            });
        } else {
            showAllProducts();
        }
    });
}

// --- Checkout Form ---
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('delivery-form');
    if (!checkoutForm) return;

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

        // Set form values
        document.getElementById('form-cart-items').value = JSON.stringify(cart);
        
        const subtotal = cart.reduce((sum, item) => sum + ((parseFloat(item.price_per_unit) || 0) * (parseInt(item.quantity) || 0)), 0);
        const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
        const total = subtotal + deliveryFee;
        
        document.getElementById('form-order-subtotal').value = subtotal.toFixed(2);
        document.getElementById('form-order-delivery-fee').value = deliveryFee.toFixed(2);
        document.getElementById('form-order-total').value = total.toFixed(2);
        document.getElementById('form-order-date').value = new Date().toISOString();

        // Submit form
        fetch(checkoutForm.action, {
            method: 'POST',
            body: new FormData(checkoutForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Order placed successfully!');
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            } else {
                alert('Error placing order. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error placing order. Please try again.');
        });
    });
}

// --- Initialize Page ---
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    loadUserProfile();
    updateCartCount();

    if (document.body.classList.contains('checkout-page')) {
        updateCartDisplay();
        updateCartTotals();
        setupCheckoutForm();
    } else {
        setupCategoryNavigation();
        setupSearch();
        setupProductControls();
        showAllProducts();
    }

    const signOutButton = document.getElementById('sign-out-btn');
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    }
});