// ----------------------------
// SHOP.JS (Static Products Version)
// ----------------------------

// Global products variable comes from data.js
// Ensure data.js is loaded **before** this script

// Initialize Shop
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    if (grid) grid.innerHTML = '<div class="loading-spinner">Loading products...</div>';

    // Setup filters
    setupFilters();

    // Check URL query for category (e.g., ?category=Traditional)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam && categoryParam !== 'all') {
        const mapping = {
            'Traditional': 'cat-traditional',
            'Premium Delights': 'cat-premium',
            'Dry Fruit Specials': 'cat-dryfruits',
            'Chocolate Fusion': 'cat-chocolate',
            'Combo Packs': 'cat-festive'
        };
        const id = mapping[categoryParam];
        if (id) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = true;
                filterProducts(); // Trigger filter
            } else {
                renderProducts(products);
            }
        } else {
            renderProducts(products);
        }
    } else {
        renderProducts(products); // Show all by default
    }

    updateCartCount();
});

// ----------------------------
// FILTER SETUP
// ----------------------------
function setupFilters() {
    const inputs = document.querySelectorAll('.sidebar input[type="checkbox"], .sidebar input[type="range"]');
    inputs.forEach(input => {
        input.addEventListener('change', filterProducts);
        if (input.type === 'range') {
            input.addEventListener('input', updatePriceLabel);
        }
    });

    // Grid view switcher
    const gridBtns = document.querySelectorAll('.btn-view');
    const productsGrid = document.getElementById('products-grid');

    gridBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gridBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            productsGrid.classList.remove('grid-view-2', 'grid-view-3', 'grid-view-4');

            if (btn.id === 'grid-2') productsGrid.classList.add('grid-view-2');
            if (btn.id === 'grid-3') productsGrid.classList.add('grid-view-3');
        });
    });
}

// ----------------------------
// PRICE SLIDER
// ----------------------------
function updatePriceLabel(e) {
    const val = e.target.value;
    const priceValue = document.getElementById('price-value');
    if (priceValue) priceValue.innerText = val;
}

// ----------------------------
// FILTER PRODUCTS
// ----------------------------
function filterProducts() {
    const catTraditional = document.getElementById('cat-traditional').checked;
    const catPremium = document.getElementById('cat-premium').checked;
    const catDryFruits = document.getElementById('cat-dryfruits').checked;
    const catChocolate = document.getElementById('cat-chocolate').checked;
    const catFestive = document.getElementById('cat-festive').checked;

    const priceRange = document.getElementById('price-range').value;
    const sweetenerJaggery = document.getElementById('sweetener-jaggery').checked;
    const sweetenerSugar = document.getElementById('sweetener-sugar').checked;

    const filtered = products.filter(product => {
        // Category filter (OR)
        let categoryMatch = !catTraditional && !catPremium && !catDryFruits && !catChocolate && !catFestive;
        if (!categoryMatch) {
            if (catTraditional && product.category === 'Traditional') categoryMatch = true;
            if (catPremium && product.category === 'Premium Delights') categoryMatch = true;
            if (catDryFruits && product.category === 'Dry Fruit Specials') categoryMatch = true;
            if (catChocolate && product.category === 'Chocolate Fusion') categoryMatch = true;
            if (catFestive && product.category === 'Combo Packs') categoryMatch = true;
        }

        // Price filter
        const priceMatch = product.price <= parseInt(priceRange);

        // Sweetener filter (OR)
        let sweetenerMatch = !sweetenerJaggery && !sweetenerSugar;
        if (!sweetenerMatch) {
            if (sweetenerJaggery && product.sweetener === 'Jaggery') sweetenerMatch = true;
            if (sweetenerSugar && product.sweetener === 'Sugar') sweetenerMatch = true;
        }

        return categoryMatch && priceMatch && sweetenerMatch;
    });

    renderProducts(filtered);

    const headerTitle = document.querySelector('.page-header h1');
    if (headerTitle) {
        headerTitle.innerText = filtered.length === products.length ? 'All Products' : `Filtered Products (${filtered.length})`;
    }
}

// ----------------------------
// RENDER PRODUCTS
// ----------------------------
function renderProducts(productList) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = ''; // Clear previous

    const wishlist = window.getWishlist ? window.getWishlist() : [];

    productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const isInWishlist = wishlist.some(item => item.id === product.id);
        const heartIconClass = isInWishlist ? 'bx bxs-heart' : 'bx bx-heart';
        const heartColor = isInWishlist ? 'color: #E53935;' : '';

        card.innerHTML = `
            <div class="card-image" onclick="goToProduct('${product.id}')" style="position: relative;">
                <button class="btn-wishlist" 
                        onclick="addToWishlistById('${product.id}', event)"
                        style="position: absolute; top: 10px; right: 10px; background: white; border: none; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); z-index: 10;">
                    <i class='${heartIconClass}' style="font-size: 1.2rem; ${heartColor}"></i>
                </button>
                <span class="card-badge">${product.badge}</span>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x250?text=Product'">
            </div>
            <div class="card-details">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title" onclick="goToProduct('${product.id}')">${product.name}</h3>
                <div class="card-rating">
                    ${getStarRating(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="card-price">
                    ₹${product.price} <span class="original">₹${product.originalPrice}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-card btn-add-cart" onclick="addToCart('${product.id}')">
                        <i class='bx bx-cart-add'></i> Add
                    </button>
                    <button class="btn-card btn-buy-now" onclick="buyNow('${product.id}')">
                        Buy Now
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ----------------------------
// WISHLIST HELPER
// ----------------------------
window.addToWishlistById = function (id, event) {
    const product = products.find(p => p.id === id);
    if (product && window.addToWishlist) {
        window.addToWishlist(product, event);
    }
}

// ----------------------------
// STAR RATING
// ----------------------------
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += "<i class='bx bxs-star'></i>";
        else if (i - 0.5 <= rating) stars += "<i class='bx bxs-star-half'></i>";
        else stars += "<i class='bx bx-star'></i>";
    }
    return stars;
}

// ----------------------------
// NAVIGATION
// ----------------------------
function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// ----------------------------
// CART FUNCTIONS
// ----------------------------
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(i => i.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            variant: 'Standard'
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function buyNow(id) {
    addToCart(id);
    window.location.href = 'cart.html';
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) cartCountEl.innerText = count;
}