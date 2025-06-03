document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    const cartCountSpan = document.getElementById('cart-count');
    const categoryTabs = document.querySelectorAll('.main-nav .main-nav li a');
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Define a global products array if not already defined elsewhere
    // This is crucial for retrieving product details like images for the cart
    const productsData = [
        // Grains & Staples
        { id: 'oil', name: 'Cooking Oil', image: 'https://via.placeholder.com/150?text=Cooking+Oil', price_per_unit: 250, units: [{ value: 1, name: '1 Liter', price: 250 }, { value: 2, name: '2 Liter', price: 500 }, { value: 5, name: '5 Liter', price: 1250 }] },
        { id: 'daal', name: 'Daal (Lentils)', image: 'https://via.placeholder.com/150?text=Daal', price_per_unit: 120, units: [{ value: 0.5, name: '500g', price: 120 }, { value: 1, name: '1 Kg', price: 240 }, { value: 2, name: '2 Kg', price: 480 }] },
        { id: 'hulas-atta', name: 'Hulas Atta (Wheat Flour)', image: 'https://via.placeholder.com/150?text=Hulas+Atta', price_per_unit: 180, units: [{ value: 1, name: '1 Kg', price: 180 }, { value: 2, name: '2 Kg', price: 360 }, { value: 5, name: '5 Kg', price: 900 }] },
        { id: 'maida', name: 'Maida (All-Purpose Flour)', image: 'https://via.placeholder.com/150?text=Maida+Flour', price_per_unit: 150, units: [{ value: 0.5, name: '500g', price: 150 }, { value: 1, name: '1 Kg', price: 300 }] },
        { id: 'suhi', name: 'Suhi (Semolina)', image: 'https://via.placeholder.com/150?text=Semolina', price_per_unit: 90, units: [{ value: 0.5, name: '500g', price: 90 }, { value: 1, name: '1 Kg', price: 180 }] },
        { id: 'gheu', name: 'Gheu (Ghee)', image: 'https://via.placeholder.com/150?text=Ghee', price_per_unit: 900, units: [{ value: 0.5, name: '500g', price: 900 }, { value: 1, name: '1 Kg / Liter', price: 1800 }] },
        { id: 'basmati-rice', name: 'Basmati Rice', image: 'https://via.placeholder.com/150?text=Basmati+Rice', price_per_unit: 220, units: [{ value: 1, name: '1 Kg', price: 220 }, { value: 5, name: '5 Kg', price: 1100 }, { value: 10, name: '10 Kg', price: 2200 }] },
        { id: 'poha', name: 'Poha (Flattened Rice)', image: 'https://via.placeholder.com/150?text=Poha', price_per_unit: 80, units: [{ value: 0.5, name: '500g', price: 80 }, { value: 1, name: '1 Kg', price: 160 }] },

        // Snacks & Beverages
        { id: 'lays', name: 'Lays Chips', image: 'https://via.placeholder.com/150?text=Lays+Chips', price_per_unit: 50, units: [{ value: 1, name: '1 Pack', price: 50 }] },
        { id: 'noodles', name: 'Noodles', image: 'https://via.placeholder.com/150?text=Noodles', price_per_unit: 30, units: [{ value: 1, name: '1 Pack', price: 30 }] },
        { id: 'nuts', name: 'Nuts', image: 'https://via.placeholder.com/150?text=Nuts', price_per_unit: 300, units: [{ value: 0.25, name: '250g', price: 300 }, { value: 0.5, name: '500g', price: 600 }, { value: 1, name: '1 Kg', price: 1200 }] },
        { id: 'panipuri', name: 'Panipuri Kit', image: 'https://via.placeholder.com/150?text=Panipuri+Kit', price_per_unit: 150, units: [{ value: 1, name: '1 Kit', price: 150 }] },
        { id: 'horlicks', name: 'Horlicks', image: 'https://via.placeholder.com/150?text=Horlicks', price_per_unit: 500, units: [{ value: 0.5, name: '500g', price: 500 }, { value: 1, name: '1 Kg', price: 1000 }] },
        { id: 'jams', name: 'Jams', image: 'https://via.placeholder.com/150?text=Mixed+Fruit+Jam', price_per_unit: 200, units: [{ value: 0.25, name: '250g', price: 200 }, { value: 0.5, name: '500g', price: 400 }] },
        { id: 'coffee', name: 'Coffee', image: 'https://via.placeholder.com/150?text=Instant+Coffee', price_per_unit: 350, units: [{ value: 0.05, name: '50g', price: 350 }, { value: 0.1, name: '100g', price: 700 }, { value: 0.2, name: '200g', price: 1400 }] },
        { id: 'gulcose', name: 'Gulcose (Glucose Powder)', image: 'https://via.placeholder.com/150?text=Glucose+Powder', price_per_unit: 220, units: [{ value: 0.25, name: '250g', price: 220 }, { value: 0.5, name: '500g', price: 440 }] },
        { id: 'biscuits', name: 'Biscuits (Assorted)', image: 'https://via.placeholder.com/150?text=Biscuits', price_per_unit: 100, units: [{ value: 1, name: '1 Pack', price: 100 }] },
        { id: 'tea-bags', name: 'Tea Bags', image: 'https://via.placeholder.com/150?text=Tea+Bags', price_per_unit: 180, units: [{ value: 1, name: '25 Bags', price: 180 }, { value: 2, name: '50 Bags', price: 360 }] },

        // Household & Personal Care
        { id: 'detergent', name: 'Detergent', image: 'https://via.placeholder.com/150?text=Washing+Powder', price_per_unit: 400, units: [{ value: 1, name: '1 Kg', price: 400 }, { value: 2, name: '2 Kg', price: 800 }, { value: 5, name: '5 Kg', price: 2000 }] },
        { id: 'sampoo', name: 'Sampoo (Shampoo)', image: 'https://via.placeholder.com/150?text=Shampoo', price_per_unit: 280, units: [{ value: 0.2, name: '200ml', price: 280 }, { value: 0.4, name: '400ml', price: 560 }, { value: 0.7, name: '700ml', price: 980 }] },
        { id: 'goodnight', name: 'Goodnight (Mosquito Repellent)', image: 'https://via.placeholder.com/150?text=Goodnight+Liquid', price_per_unit: 160, units: [{ value: 1, name: '1 Unit', price: 160 }] },
        { id: 'agarbati', name: 'Agarbati (Incense Sticks)', image: 'https://via.placeholder.com/150?text=Incense+Sticks', price_per_unit: 80, units: [{ value: 1, name: '1 Pack', price: 80 }] },
        { id: 'dishwash', name: 'Dishwashing Liquid', image: 'https://via.placeholder.com/150?text=Dishwashing+Liquid', price_per_unit: 200, units: [{ value: 0.5, name: '500ml', price: 200 }, { value: 1, name: '1 Liter', price: 400 }] },
        { id: 'toothpaste', name: 'Toothpaste', image: 'https://via.placeholder.com/150?text=Toothpaste', price_per_unit: 150, units: [{ value: 0.1, name: '100g', price: 150 }, { value: 0.2, name: '200g', price: 300 }] },

        // Fresh Produce & Dairy
        { id: 'allu', name: 'Allu (Potatoes)', image: 'https://via.placeholder.com/150?text=Potatoes', price_per_unit: 80, units: [{ value: 1, name: '1 Kg', price: 80 }, { value: 2, name: '2 Kg', price: 160 }, { value: 5, name: '5 Kg', price: 400 }] },
        { id: 'piyaz', name: 'Piyaz (Onions)', image: 'https://via.placeholder.com/150?text=Onions', price_per_unit: 100, units: [{ value: 0.5, name: '500g', price: 100 }, { value: 1, name: '1 Kg', price: 200 }] },
        { id: 'kerau', name: 'Kerau (Green Peas)', image: 'https://via.placeholder.com/150?text=Peas', price_per_unit: 130, units: [{ value: 0.25, name: '250g', price: 130 }, { value: 0.5, name: '500g', price: 260 }] },
        { id: 'dudh', name: 'Dudh (Milk)', image: 'https://via.placeholder.com/150?text=Milk', price_per_unit: 80, units: [{ value: 0.5, name: '500ml', price: 80 }, { value: 1, name: '1 Liter', price: 160 }] },
        { id: 'dahi', name: 'Dahi (Curd/Yogurt)', image: 'https://via.placeholder.com/150?text=Curd', price_per_unit: 120, units: [{ value: 0.5, name: '500g', price: 120 }, { value: 1, name: '1 Kg', price: 240 }] },
        { id: 'paneer', name: 'Paneer (Cottage Cheese)', image: 'https://via.placeholder.com/150?text=Paneer', price_per_unit: 250, units: [{ value: 0.25, name: '250g', price: 250 }, { value: 0.5, name: '500g', price: 500 }] },

        // Spices & Condiments
        { id: 'nun', name: 'Nun (Salt)', image: 'https://via.placeholder.com/150?text=Salt', price_per_unit: 30, units: [{ value: 0.5, name: '500g', price: 30 }, { value: 1, name: '1 Kg', price: 60 }] },
        { id: 'masala', name: 'Masala (Spices)', image: 'https://via.placeholder.com/150?text=Mixed+Spices', price_per_unit: 100, units: [{ value: 0.05, name: '50g', price: 100 }, { value: 0.1, name: '100g', price: 200 }, { value: 0.25, name: '250g', price: 500 }] },
        { id: 'turmeric', name: 'Turmeric Powder', image: 'https://via.placeholder.com/150?text=Turmeric+Powder', price_per_unit: 90, units: [{ value: 0.1, name: '100g', price: 90 }, { value: 0.25, name: '250g', price: 225 }] },
        { id: 'chili', name: 'Chili Powder', image: 'https://via.placeholder.com/150?text=Chili+Powder', price_per_unit: 110, units: [{ value: 0.1, name: '100g', price: 110 }, { value: 0.25, name: '250g', price: 275 }] },

        // Bakery & Desserts
        { id: 'papad', name: 'Papad', image: 'https://via.placeholder.com/150?text=Papad', price_per_unit: 70, units: [{ value: 1, name: '1 Pack', price: 70 }] },
        { id: 'bread', name: 'Bread (Loaf)', image: 'https://via.placeholder.com/150?text=Bread', price_per_unit: 70, units: [{ value: 1, name: '1 Loaf', price: 70 }] },
        { id: 'cake', name: 'Assorted Cakes', image: 'https://via.placeholder.com/150?text=Cake', price_per_unit: 300, units: [{ value: 1, name: '1 Cake', price: 300 }] },

        // Featured Products (ensure their IDs match the data-id in HTML)
        { id: 'feat-oil', name: 'Cooking Oil', image: 'https://via.placeholder.com/150?text=Cooking+Oil', price_per_unit: 250, units: [{ value: 1, name: '1 Liter', price: 250 }, { value: 2, name: '2 Liter', price: 500 }, { value: 5, name: '5 Liter', price: 1250 }] },
        { id: 'feat-noodles', name: 'Wai Wai Noodles', image: 'https://via.placeholder.com/150?text=Wai+Wai', price_per_unit: 30, units: [{ value: 1, name: '1 Pack', price: 30 }, { value: 12, name: '1 Dozen', price: 360 }] }, // Assuming 1 dozen is 12 packs
        { id: 'feat-dettol', name: 'Dettol Soap', image: 'https://via.placeholder.com/150?text=Dettol+Soap', price_per_unit: 200, units: [{ value: 1, name: '2-Pack', price: 200 }, { value: 2, name: '4-Pack', price: 400 }] }, // Assuming 2-pack is base unit
        { id: 'feat-rice', name: 'Basmati Rice', image: 'https://via.placeholder.com/150?text=Basmati+Rice', price_per_unit: 220, units: [{ value: 1, name: '1 Kg', price: 220 }, { value: 5, name: '5 Kg', price: 1100 }, { value: 10, name: '10 Kg', price: 2200 }] },
        { id: 'feat-sugar', name: 'Refined Sugar', image: 'https://via.placeholder.com/150?text=Sugar', price_per_unit: 120, units: [{ value: 1, name: '1 Kg', price: 120 }, { value: 2, name: '2 Kg', price: 240 }] },
        { id: 'feat-milk', name: 'Dudh (Milk)', image: 'https://via.placeholder.com/150?text=Milk', price_per_unit: 80, units: [{ value: 0.5, name: '500ml', price: 80 }, { value: 1, name: '1 Liter', price: 160 }] },
    ];


    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update cart count in header
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    };

    // Initialize cart count on page load
    updateCartCount();

    // Category navigation functionality (Scroll to section)
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor link behavior
            const targetId = e.target.getAttribute('href'); // Get the href (e.g., #grains-staples)
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Scroll to the target section smoothly
                window.scrollTo({
                    top: targetSection.offsetTop - document.querySelector('header').offsetHeight - 10, // Adjust for fixed header height
                    behavior: 'smooth'
                });
            }
            // Clear search input when category is navigated
            searchInput.value = '';
            filterProducts(''); // Show all products when navigating by category
        });
    });

    // Search functionality - refined to filter across all horizontal sections
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        // Select all product cards in all horizontal scroll grids
        const allProductCards = document.querySelectorAll('.product-grid.horizontal-scroll-grid .product-card');

        allProductCards.forEach(card => {
            const productName = card.dataset.name.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'flex'; // Show the card (flex because product-card is flex)
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    }

    // Product quantity/volume/weight adjuster logic
    document.querySelectorAll('.product-unit-selector').forEach(selector => {
        selector.addEventListener('change', (e) => {
            const card = e.target.closest('.product-card');
            const priceSpan = card.querySelector('.product-price');
            const basePrice = parseFloat(e.target.dataset.basePrice);
            const selectedValue = parseFloat(e.target.value);

            const newPrice = basePrice * selectedValue;
            priceSpan.textContent = newPrice.toFixed(0);
        });
    });

    // Add to Cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productId = card.dataset.id; // Use data-id for product ID
            const productName = card.querySelector('h3').textContent;
            const productImage = card.querySelector('img').src; // Get image source

            let quantity = 1;
            let unitName = '';
            let pricePerUnit = parseFloat(card.querySelector('.product-price').textContent); // Default to displayed price

            // Check if it's a simple quantity input or a unit selector
            const quantityInput = card.querySelector('.product-quantity-input');
            const unitSelector = card.querySelector('.product-unit-selector');

            if (quantityInput) {
                quantity = parseInt(quantityInput.value);
                // For simple quantity inputs, the price displayed on the card is the base price
                // We'll use the pricePerUnit from the HTML directly
            } else if (unitSelector) {
                const selectedOption = unitSelector.options[unitSelector.selectedIndex];
                unitName = selectedOption.textContent.trim(); // e.g., "1 Liter", "500g"
                pricePerUnit = parseFloat(card.querySelector('.product-price').textContent); // Price already updated by change event
                quantity = 1; // For unit selectors, quantity is typically 1 'pack' or 'unit' of that size
            }

            // Find the actual product data from our `productsData` array
            const product = productsData.find(p => p.id === productId);

            if (product) {
                // If the product has defined units, ensure we're getting the correct price for the selected unit
                if (product.units && unitName) {
                    const selectedUnit = product.units.find(u => u.name === unitName);
                    if (selectedUnit) {
                        pricePerUnit = selectedUnit.price;
                    }
                } else if (!unitName && product.price_per_unit) {
                    // If no specific unit selected (e.g., simple quantity input), use the base price
                    pricePerUnit = product.price_per_unit;
                }
            }


            // Find existing item in cart, considering unit for products with selectors
            const existingItemIndex = cart.findIndex(item =>
                item.id === productId && (item.unitName || '') === (unitName || '')
            );

            if (existingItemIndex > -1) {
                if (quantityInput) {
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // For products with unit selectors, alert if trying to add exact same unit again
                    alert(`The exact unit of "${productName}" (${unitName}) is already in your cart. You can adjust quantity on the checkout page or select a different unit size.`);
                    return;
                }
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    image: productImage, // Store the image URL
                    price_per_unit: pricePerUnit, // Store the price for the selected unit
                    unitName: unitName, // Store the selected unit name
                    quantity: quantity
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${quantity} ${unitName ? unitName + ' of ' : ''}${productName} added to cart!`);
        });
    });

    // The checkout page specific logic (from your provided checkout.html script)
    // This part should remain in checkout.html's script for modularity,
    // but I'm including it here for completeness if you decide to merge.
    // Ideally, this should be in checkout.html's <script> tag.
    // If you keep it separate, ensure the `productsData` array is also available in checkout.html's script
    // or that the cart items stored in localStorage contain all necessary info (image, price_per_unit, unitName).
});