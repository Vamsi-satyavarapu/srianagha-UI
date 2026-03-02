// Global product variable
let currentProduct = {};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        // Redirect to shop if no ID (or show error)
        window.location.href = 'shop.html';
        return;
    }

    try {
      // Find product from local array
      const product = products.find(p => p.id === productId);

if (!product) {
    throw new Error('Product not found');
}

currentProduct = product;

        // 3. Populate UI Elements
        document.title = `${product.name} | ATPU`;

        // Text Content
        document.getElementById('breadcrumb-product-name').textContent = product.name;
        document.getElementById('product-title').textContent = product.name;

        const badgeEl = document.getElementById('product-badge');
        // Check if badge exists or mock it
        if (product.badge) {
            badgeEl.textContent = product.badge;
            badgeEl.style.display = 'inline-block';
        } else {
            badgeEl.style.display = 'none';
        }

        document.getElementById('product-description').textContent = product.description || 'Authentic Atreyapuram Putharekulu. Handcrafted with love.';
        document.getElementById('product-category').textContent = product.category;

        // Price
        document.getElementById('product-price').textContent = `₹${product.price}`;

        // Mocking Original Price
        const originalPrice = product.originalPrice || (product.price + 50);
        document.getElementById('product-original-price').textContent = `₹${originalPrice}`;

        const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
        document.getElementById('product-discount').textContent = `Save ${discount}%`;

        // Mocking Reviews/Rating
        const reviewCount = product.reviews || 12;
        const ratingValue = product.rating || 4.5;

        document.getElementById('product-reviews').textContent = `(${reviewCount} Reviews)`;
        document.getElementById('product-rating-stars').innerHTML = getStarRating(ratingValue);

        // Images
        const mainImg = document.getElementById('main-product-image');
        mainImg.src = product.image;
        document.getElementById('thumb-1').src = product.image;

        // Wishlist State
        updateWishlistIcon(productId);

    } catch (error) {
        console.error('Error loading product:', error);
        document.querySelector('.product-container').innerHTML = `<h2>Product not found or Error loading</h2><p>${error.message}</p><a href="shop.html">Back to Shop</a>`;
    }
});

// Reuse star rating logic or import if modular
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += "<i class='bx bxs-star'></i>";
        } else if (i - 0.5 <= rating) {
            stars += "<i class='bx bxs-star-half'></i>";
        } else {
            stars += "<i class='bx bx-star'></i>";
        }
    }
    return stars;
}

// Quantity Logic
const quantityInput = document.getElementById('quantity');

function increaseQuantity() {
    if (!quantityInput) return;
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function decreaseQuantity() {
    if (!quantityInput) return;
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Add to Cart Logic (Stays on Page)
function addToCartCurrent() {
    const product = getProductFromURL();
    if (!product) return;

    const quantity = parseInt(document.getElementById('quantity').value);
    addItemToCart(product, quantity);

    // Visual Feedback
    const btn = document.querySelector('.add-to-cart-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class='bx bx-check'></i> Added!`;
    btn.style.backgroundColor = '#4CAF50'; // Green

    // Update Navbar Cart Count
    if (window.updateCartCount) window.updateCartCount();

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = ''; // Reset
    }, 2000);
}

// Buy Now Logic (Redirects to Cart)
function buyNowCurrent() {
    const product = getProductFromURL();
    if (!product) return;

    const quantity = parseInt(document.getElementById('quantity').value);
    addItemToCart(product, quantity);

    // Update Navbar Cart Count
    if (window.updateCartCount) window.updateCartCount();

    // Redirect
    window.location.href = 'cart.html';
}

// Helper: Get Product from URL (now uses global variable)
function getProductFromURL() {
    return currentProduct;
}

// Helper: Add Item to LocalStorage Cart
function addItemToCart(product, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item exists
    const existingIndex = cart.findIndex(i => i.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            variant: 'Standard'
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Wishlist Logic
function addToWishlistCurrent(event) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id === productId);

    if (product && window.addToWishlist) {
        window.addToWishlist(product, event);
        updateWishlistIcon(productId);
    }
}

function updateWishlistIcon(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some(item => item.id === productId);
    const icon = document.getElementById('wishlist-icon');

    if (isInWishlist) {
        icon.className = 'bx bxs-heart';
        icon.style.color = '#E53935';
    } else {
        icon.className = 'bx bx-heart';
        icon.style.color = '#333';
    }
}
