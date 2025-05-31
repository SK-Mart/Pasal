const products = [
  // Grains & Pulses
  { id: 1, name: "Jeera Masino Rice", price: 1599, category: "Grains & Pulses", image: "" },
  { id: 2, name: "Rato Dal", price: 200, category: "Grains & Pulses", image: "mansordal.jpg" },
  { id: 3, name: "Hulas Atta", price: 600, category: "Grains & Pulses", image: "hulas.jpg" },
  { id: 4, name: "Maida", price: 150, category: "Grains & Pulses", image: "maida.jfif" },
  { id: 5, name: "Kerau (Peas)", price: 120, category: "Grains & Pulses", image: "kerauG.jfif" },
  { id: 6, name: "Sooji", price: 180, category: "Grains & Pulses", image: "suji.jfif" },
  { id: 7, name: "Doonmalai Rice", price: 2200, category: "Grains & Pulses", image: "doodhmalai.jfif" },
  { id: 8, name: "Moong Dal", price: 250, category: "Grains & Pulses", image: "moong.jfif" },
  { id: 9, name: "Rajma", price: 300, category: "Grains & Pulses", image: "masoor." },
  { id: 10, name: "Masoor Dal", price: 220, category: "Grains & Pulses", image: "" },
 
  { id: 12, name: "Pohora Rice", price: 1400, category: "Grains & Pulses", image: "" },
 
  { id: 14, name: "Corn Flour", price: 200, category: "Grains & Pulses", image: "" },
 
  { id: 16, name: "Buckwheat Flour", price: 450, category: "Grains & Pulses", image: "" },
 

  // Pantry
  { id: 19, name: "Sunflower Oil", price: 1170, category: "Pantry", image: "sunflower.jpg" },
  { id: 20, name: "Nuts (Mixed)", price: 800, category: "Pantry", image: "" },
  { id: 21, name: "Jams (Mixed Fruit)", price: 350, category: "Pantry", image: "jam.avif" },
  { id: 22, name: "Mustang Coffee", price: 600, category: "Pantry", image: "coffee.jfif" },
  { id: 23, name: "Ghee (Yak)", price: 1200, category: "Pantry", image: "ghee.jfif" },
  { id: 24, name: "Masala (Momo)", price: 200, category: "Pantry", image: "momo" },
  { id: 25, name: "Honey (Dabur)", price: 700, category: "Pantry", image: "" },
  { id: 26, name: "Chyura ", price: 150, category: "Pantry", image: "" },
  { id: 27, name: "Tamarind Paste", price: 180, category: "Pantry", image: "" },
  { id: 28, name: "Soybean Oil", price: 1100, category: "Pantry", image: "" },
  { id: 29, name: "Pickle (Mango)", price: 250, category: "Pantry", image: "" },
  { id: 30, name: "Sugar (White)", price: 90, category: "Pantry", image: "sugar.jpg" },
  
  { id: 32, name: "Turmeric Powder", price: 100, category: "Pantry", image: "" },
 
  { id: 34, name: "Achar (Mixed)", price: 300, category: "Pantry", image: "" },
  { id: 35, name: "Chili Powder", price: 80, category: "Pantry", image: "" },
  { id: 36, name: "Mustard Oil", price: 900, category: "Pantry", image: "" },
  { id: 37, name: "Soy Sauce", price: 150, category: "Pantry", image: "" },
  { id: 38, name: "Vinegar", price: 100, category: "Pantry", image: "" },

  // Snacks
  { id: 39, name: "Wai Wai Noodles", price: 50, category: "Snacks", image: "waiwai.jfif" },
  { id: 40, name: "Lays Chips", price: 50, category: "Snacks", image: "lays.jpg" },
  { id: 41, name: "Panipuri", price: 100, category: "Snacks", image: "panipuri.png" },
  { id: 42, name: "Papad", price: 60, category: "Snacks", image: "papad.jpg" },
  { id: 43, name: "Kurkure", price: 40, category: "Snacks", image: "" },
  
 
  { id: 46, name: "Oreo Biscuits", price: 70, category: "Snacks", image: "" },
  { id: 47, name: "Chips (Current)", price: 30, category: "Snacks", image: "" },
  { id: 48, name: "Musli", price: 45, category: "Snacks", image: "musli.jpg" },
  { id: 49, name: "Aloo Bhujia", price: 60, category: "Snacks", image: "" },
 
  { id: 51, name: "Bhuja ", price: 90, category: "Snacks", image: "" },
 

  // Beverages & Health Drinks
  { id: 55, name: "Horlicks", price: 450, category: "Beverages & Health Drinks", image: "horlicks.jfif" },
  
  { id: 57, name: "Chhurpi (Hard Cheese)", price: 500, category: "Beverages & Health Drinks", image: "" },
 
  { id: 59, name: "Sarbada Tea ", price: 400, category: "Beverages & Health Drinks", image: "" },
  { id: 60, name: "Frooti", price: 50, category: "Beverages & Health Drinks", image: "" },
  { id: 61, name: "Real Juice (Mixed)", price: 150, category: "Beverages & Health Drinks", image: "Mixed juics.jpg" },
  { id: 62, name: "Coca-Cola", price: 80, category: "Beverages & Health Drinks", image: "" },

 
  { id: 66, name: "Sprite", price: 80, category: "Beverages & Health Drinks", image: "" },
  { id: 67, name: "Tonic Water", price: 120, category: "Beverages & Health Drinks", image: "" },
 
  { id: 69, name: "Tang (Orange)", price: 250, category: "Beverages & Health Drinks", image: "" },
  { id: 70, name: "Red Bull", price: 200, category: "Beverages & Health Drinks", image: "" },
 
  { id: 73, name: "Dabur Glucose-D", price: 350, category: "Beverages & Health Drinks", image: "glucose.jpg" },
 
  { id: 79, name: "Nescafé Instant Coffee", price: 350, category: "Beverages & Health Drinks", image: "coffee.jpfif" },
 
  { id: 83, name: "Complan", price: 400, category: "Beverages & Health Drinks", image: "" },
 
  // Household & Personal Care
  { id: 84, name: "Surf Excel Detergent", price: 400, category: "Household & Personal Care", image: "" },
  { id: 85, name: "Sunsilk Shampoo", price: 350, category: "Household & Personal Care", image: "" },
  { id: 86, name: "Iodized Salt", price: 30, category: "Household & Personal Care", image: "" },
  { id: 87, name: "Goodnight Coil", price: 150, category: "Household & Personal Care", image: "" },
  { id: 88, name: "Agarbati (Sandalwood)", price: 100, category: "Household & Personal Care", image: "" },
  { id: 89, name: "Durex Soap", price: 80, category: "Household & Personal Care", image: "" },
  { id: 90, name: "Colgate Toothpaste", price: 120, category: "Household & Personal Care", image: "" },
  { id: 91, name: "Harpic Toilet Cleaner", price: 200, category: "Household & Personal Care", image: "" },
  { id: 92, name: "Lizol Floor Cleaner", price: 250, category: "Household & Personal Care", image: "" },
  { id: 93, name: "Nivea Cream", price: 300, category: "Household & Personal Care", image: "" },
  { id: 94, name: "Dettol Antiseptic", price: 150, category: "Household & Personal Care", image: "" },
  { id: 95, name: "Odonil Air Freshener", price: 120, category: "Household & Personal Care", image: "" },
  { id: 96, name: "Pepsodent Toothpaste", price: 100, category: "Household & Personal Care", image: "" },
  { id: 97, name: "Vim Dishwash Gel", price: 180, category: "Household & Personal Care", image: "" },
  { id: 98, name: "Fair & Lovely Cream", price: 200, category: "Household & Personal Care", image: "" },
  { id: 99, name: "Saniplast Bandages", price: 50, category: "Household & Personal Care", image: "" },
  { id: 100, name: "Hand Sanitizer", price: 150, category: "Household & Personal Care", image: "" },
  { id: 101, name: "Face Mask (Pack)", price: 100, category: "Household & Personal Care", image: "" },
  { id: 102, name: "Pril Dishwash Liquid", price: 200, category: "Household & Personal Care", image: "" },
  { id: 103, name: "Dove Soap", price: 100, category: "Household & Personal Care", image: "" },
  { id: 104, name: "Cycle Incense", price: 80, category: "Household & Personal Care", image: "" },
  { id: 105, name: "Patanjali Toothpaste", price: 120, category: "Household & Personal Care", image: "" },
  { id: 106, name: "Comfort Fabric Softener", price: 250, category: "Household & Personal Care", image: "" },
  { id: 107, name: "Godrej Hair Dye", price: 150, category: "Household & Personal Care", image: "" },
  { id: 108, name: "Mosquito Repellent Spray", price: 200, category: "Household & Personal Care", image: "" },
  { id: 109, name: "Ponds Face Cream", price: 180, category: "Household & Personal Care", image: "" },
  { id: 110, name: "Ariel Detergent", price: 450, category: "Household & Personal Care", image: "" },
  { id: 111, name: "Garbage Bags (Medium)", price: 100, category: "Household & Personal Care", image: "" },
  { id: 112, name: "Lux Soap", price: 90, category: "Household & Personal Care", image: "" },
  { id: 113, name: "Domex Toilet Cleaner", price: 220, category: "Household & Personal Care", image: "" },
  { id: 114, name: "Shikhar Soap", price: 70, category: "Household & Personal Care", image: "" },
  { id: 115, name: "Tide Detergent", price: 400, category: "Household & Personal Care", image: "" },
  { id: 116, name: "Room Freshener (Jasmine)", price: 130, category: "Household & Personal Care", image: "" },
  { id: 191, name: "Lifebuoy Soap", price: 80, category: "Household & Personal Care", image: "" },
  { id: 192, name: "Phenyl Cleaner", price: 150, category: "Household & Personal Care", image: "" },
  { id: 193, name: "Patanjali Shampoo", price: 200, category: "Household & Personal Care", image: "" },
  { id: 194, name: "Hit Insect Spray", price: 250, category: "Household & Personal Care", image: "" },
  { id: 195, name: "Santoor Soap", price: 90, category: "Household & Personal Care", image: "" },

  // Seafood
  { id: 117, name: "Fresh Prawn", price: 700, category: "Seafood", image: "" },
  { id: 118, name: "Rohu Fish", price: 500, category: "Seafood", image: "" },
  { id: 119, name: "Dried Fish", price: 600, category: "Seafood", image: "" },
  { id: 120, name: "Mackerel", price: 450, category: "Seafood", image: "" },
  { id: 121, name: "Squid", price: 800, category: "Seafood", image: "" },
  { id: 122, name: "Crab", price: 900, category: "Seafood", image: "" },
  { id: 123, name: "Tilapia", price: 400, category: "Seafood", image: "" },
  { id: 124, name: "Pomfret", price: 600, category: "Seafood", image: "" },
  { id: 125, name: "Clams", price: 500, category: "Seafood", image: "" },
  { id: 126, name: "Smoked Fish", price: 700, category: "Seafood", image: "" },
  { id: 127, name: "Hilsa Fish", price: 800, category: "Seafood", image: "" },
  { id: 128, name: "Mussels", price: 600, category: "Seafood", image: "" },
  { id: 129, name: "Catfish", price: 450, category: "Seafood", image: "" },
  { id: 130, name: "Anchovies", price: 400, category: "Seafood", image: "" },
  { id: 131, name: "Fish Fillet", price: 650, category: "Seafood", image: "" },
  { id: 132, name: "Shrimp (Small)", price: 550, category: "Seafood", image: "" },
  { id: 133, name: "Sardines", price: 400, category: "Seafood", image: "" },
  { id: 134, name: "Trout", price: 600, category: "Seafood", image: "" },
  { id: 135, name: "Lobster", price: 1200, category: "Seafood", image: "" },
  { id: 136, name: "Bombay Duck (Dried)", price: 500, category: "Seafood", image: "" },
  { id: 137, name: "Perch", price: 450, category: "Seafood", image: "" },
  { id: 138, name: "Cuttlefish", price: 700, category: "Seafood", image: "" },

  // Vegetables
  { id: 139, name: "Potato", price: 60, category: "Vegetables", image: "" },
  { id: 140, name: "Onion", price: 80, category: "Vegetables", image: "" },
  { id: 141, name: "Cauliflower", price: 100, category: "Vegetables", image: "" },
  { id: 142, name: "Spinach", price: 50, category: "Vegetables", image: "" },
  { id: 143, name: "Tomato", price: 70, category: "Vegetables", image: "" },
  { id: 144, name: "Bitter Gourd", price: 90, category: "Vegetables", image: "" },
  { id: 145, name: "Cucumber", price: 60, category: "Vegetables", image: "" },
  { id: 146, name: "Carrot", price: 80, category: "Vegetables", image: "" },
  { id: 147, name: "Eggplant", price: 70, category: "Vegetables", image: "" },
  { id: 148, name: "Okra", price: 100, category: "Vegetables", image: "" },
  { id: 149, name: "Green Beans", price: 90, category: "Vegetables", image: "" },
  { id: 150, name: "Radish", price: 50, category: "Vegetables", image: "" },
  { id: 151, name: "Cabbage", price: 80, category: "Vegetables", image: "" },
  { id: 152, name: "Broccoli", price: 150, category: "Vegetables", image: "" },
  { id: 153, name: "Pumpkin", price: 120, category: "Vegetables", image: "" },
  { id: 154, name: "Mushroom", price: 200, category: "Vegetables", image: "" },
  { id: 155, name: "Green Peas", price: 120, category: "Vegetables", image: "" },
  { id: 156, name: "Capsicum", price: 100, category: "Vegetables", image: "" },
  { id: 157, name: "Zucchini", price: 150, category: "Vegetables", image: "" },
  { id: 158, name: "Lettuce", price: 80, category: "Vegetables", image: "" },
  { id: 159, name: "Garlic", price: 100, category: "Vegetables", image: "" },
  { id: 160, name: "Ginger", price: 90, category: "Vegetables", image: "" },
  { id: 161, name: "Coriander Leaves", price: 30, category: "Vegetables", image: "" },
  { id: 162, name: "Mint Leaves", price: 40, category: "Vegetables", image: "" },
  { id: 163, name: "Spring Onion", price: 60, category: "Vegetables", image: "" },
  { id: 164, name: "Asparagus", price: 200, category: "Vegetables", image: "" },
  { id: 165, name: "Sweet Potato", price: 100, category: "Vegetables", image: "" },
  { id: 166, name: "Beetroot", price: 80, category: "Vegetables", image: "" },
  { id: 167, name: "Turnip", price: 70, category: "Vegetables", image: "" },
  { id: 168, name: "Fenugreek Leaves", price: 50, category: "Vegetables", image: "" },
  { id: 169, name: "Drumstick", price: 90, category: "Vegetables", image: "" },
  { id: 170, name: "Colocasia", price: 100, category: "Vegetables", image: "" },
  { id: 171, name: "Rayo Sag", price: 50, category: "Vegetables", image: "" },
  { id: 172, name: "Leeks", price: 80, category: "Vegetables", image: "" },
  { id: 173, name: "Artichokes", price: 200, category: "Vegetables", image: "" },
  { id: 174, name: "Chayote", price: 70, category: "Vegetables", image: "" },
  { id: 175, name: "Bamboo Shoots", price: 120, category: "Vegetables", image: "" },
  { id: 176, name: "Kale", price: 150, category: "Vegetables", image: "" },
  { id: 177, name: "Parsnip", price: 100, category: "Vegetables", image: "" },
  { id: 178, name: "Celery", price: 90, category: "Vegetables", image: "" },
  { id: 179, name: "Swiss Chard", price: 80, category: "Vegetables", image: "" },
  { id: 180, name: "Taro Root", price: 100, category: "Vegetables", image: "" },
  { id: 181, name: "Brussels Sprouts", price: 180, category: "Vegetables", image: "" },
  { id: 182, name: "Fennel", price: 120, category: "Vegetables", image: "" },
  { id: 183, name: "Chamsur Sag", price: 50, category: "Vegetables", image: "" },
  { id: 184, name: "Kohlrabi", price: 80, category: "Vegetables", image: "" },
  { id: 185, name: "Endive", price: 100, category: "Vegetables", image: "" }
];

let cart = [];

const weightOptions = {
  "Grains & Pulses": ["500g", "1kg", "2kg"],
  "Pantry": ["500g", "1kg", "2kg"],
  "Snacks": ["100g", "250g", "500g"],
  "Beverages & Health Drinks": ["100g", "250g", "500g"],
  "Household & Personal Care": [
    { productIds: [84, 85, 91, 92, 94, 97, 102, 106, 108, 110, 113, 115, 192, 193, 194], options: ["100ml", "500ml", "1L"] },
    { productIds: [86, 87, 88, 89, 90, 93, 95, 96, 98, 99, 100, 101, 103, 104, 105, 107, 109, 111, 112, 114, 116, 191, 195], options: ["100g", "250g", "500g"] }
  ],
  "Seafood": ["250g", "500g", "1kg"],
  "Vegetables": ["250g", "500g", "1kg"]
};

function getWeightOptions(category, productId) {
  if (category === "Household & Personal Care") {
    const liquidProducts = weightOptions[category][0].productIds;
    if (liquidProducts.includes(productId)) {
      return weightOptions[category][0].options;
    } else {
      return weightOptions[category][1].options;
    }
  }
  return weightOptions[category];
}

function calculatePrice(basePrice, weight) {
  const weightValue = parseFloat(weight);
  const unit = weight.replace(/[0-9.]/g, '');
  let multiplier = 1;

  if (unit === 'kg') {
    if (weightValue === 1) multiplier = 2;
    if (weightValue === 2) multiplier = 4;
    if (weightValue === 0.5) multiplier = 1;
    if (weightValue === 0.25) multiplier = 0.5;
  } else if (unit === 'g') {
    if (weightValue === 100) multiplier = 0.2;
    if (weightValue === 250) multiplier = 0.5;
    if (weightValue === 500) multiplier = 1;
  } else if (unit === 'ml') {
    if (weightValue === 100) multiplier = 0.2;
    if (weightValue === 500) multiplier = 1;
    if (weightValue === 1000) multiplier = 2;
  } else if (unit === 'L') {
    if (weightValue === 1) multiplier = 2;
  }

  return basePrice * multiplier;
}

function renderProducts(category = "All", searchQuery = "") {
  const categories = [
    "Grains & Pulses",
    "Pantry",
    "Snacks",
    "Beverages & Health Drinks",
    "Household & Personal Care",
    "Seafood",
    "Vegetables"
  ];

  categories.forEach(cat => {
    const sectionId = cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Section with ID ${sectionId} not found`);
      return;
    }
    const productGrid = section.querySelector(".product-grid");
    productGrid.innerHTML = "";

    let filteredProducts = products.filter(p => p.category === cat);
    console.log(`Rendering ${filteredProducts.length} products for category: ${cat}`);

    if (category !== "All" && category !== cat) {
      filteredProducts = [];
    }
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    filteredProducts.forEach((product, index) => {
      const weightOpts = getWeightOptions(product.category, product.id);
      const quantityOptions = Array.from({length: 10}, (_, i) => i + 1).map(i => `<option value="${i}">${i}</option>`).join('');
      const weightSelectOptions = weightOpts.map(w => `<option value="${w}">${w}</option>`).join('');

      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.style.transitionDelay = `${index * 0.05}s`;
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Rs. ${product.price}</p>
        <select id="quantity-${product.id}" class="quantity-select">
          ${quantityOptions}
        </select>
        <select id="weight-${product.id}" class="weight-select">
          ${weightSelectOptions}
        </select>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productGrid.appendChild(productCard);
      console.log(`Added adjusters for ${product.name}: Quantity 1-10, Weight ${weightOpts.join(', ')}`);
    });

    section.style.display = filteredProducts.length > 0 ? "block" : "none";

    const cards = productGrid.querySelectorAll(".product-card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    cards.forEach(card => {
      observer.observe(card);
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = -(y / rect.height) * 20;
        const tiltY = (x / rect.width) * 20;
        card.style.setProperty('--tiltX', `${tiltX}deg`);
        card.style.setProperty('--tiltY', `${tiltY}deg`);
        card.classList.add("tilt");
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty('--tiltX', '0deg');
        card.style.setProperty('--tiltY', '0deg');
        card.classList.remove("tilt");
      });
      card.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();
        const x = touch.clientX - rect.left - rect.width / 2;
        const y = touch.clientY - rect.top - rect.height / 2;
        const tiltX = -(y / rect.height) * 20;
        const tiltY = (x / rect.width) * 20;
        card.style.setProperty('--tiltX', `${tiltX}deg`);
        card.style.setProperty('--tiltY', `${tiltY}deg`);
        card.classList.add("tilt");
      });
      card.addEventListener("touchend", () => {
        card.style.setProperty('--tiltX', '0deg');
        card.style.setProperty('--tiltY', '0deg');
        card.classList.remove("tilt");
      });
    });
  });

  const sections = document.querySelectorAll('#app-promo, .about-contact-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(section => sectionObserver.observe(section));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
  const weight = document.getElementById(`weight-${productId}`).value;
  const adjustedPrice = calculatePrice(product.price, weight);

  const cartItem = cart.find(item => item.id === productId && item.weight === weight);

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity, weight, adjustedPrice });
  }

  renderCart();
  console.log(`Added to cart: ${product.name}, Quantity: ${quantity}, Weight: ${weight}, Price: Rs. ${adjustedPrice}`);
}

function updateQuantity(productId, weight, delta) {
  const cartItem = cart.find(item => item.id === productId && item.weight === weight);
  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + delta);
    renderCart();
  }
}

function removeFromCart(productId, weight) {
  cart = cart.filter(item => !(item.id === productId && item.weight === weight));
  renderCart();
}

function renderCart() {
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  cartDropdown.classList.toggle("hidden", cart.length === 0);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  let total = 0;
  cart.forEach(item => {
    total += item.adjustedPrice * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <span>${item.name} (${item.weight}, x${item.quantity})</span>
      <div>
        <span>Rs. ${item.adjustedPrice * item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, '${item.weight}', 1)">+</button>
        <button onclick="updateQuantity(${item.id}, '${item.weight}', -1)">-</button>
        <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.weight}')">Remove</button>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  cartTotal.textContent = total;
}

function toggleSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.classList.toggle("hidden");
  if (!searchInput.classList.contains("hidden")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    renderProducts(document.getElementById("category").value);
  }
}

function toggleCart() {
  const cartDropdown = document.getElementById("cart-dropdown");
  cartDropdown.classList.toggle("hidden");
}

function searchProducts() {
  const searchQuery = document.getElementById("search-input").value;
  const selectedCategory = document.getElementById("category").value;
  renderProducts(selectedCategory, searchQuery);
}

function resetView() {
  document.getElementById("category").value = "All";
  document.getElementById("search-input").value = "";
  renderProducts("All");
}

document.getElementById("category").addEventListener("change", (e) => {
  renderProducts(e.target.value);
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
});

// Initial render
renderProducts("All");