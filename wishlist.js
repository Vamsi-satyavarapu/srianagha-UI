// Wishlist Logic

document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    updateCartCount(); // From navbar helper
});

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    // Optional: Dispatch event to update counts if we add a count badge later
    window.dispatchEvent(new Event('wishlistUpdated'));
}

function addToWishlist(product) {
    let wishlist = getWishlist();
    // Check if exists
    if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push(product);
        saveWishlist(wishlist);
        alert(`${product.name} added to wishlist!`);
    } else {
        alert("Item already in wishlist!");
    }
}

function removeFromWishlist(id) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist(wishlist);
    renderWishlist(); // Re-render to remove from UI
}

function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return; // Not on wishlist page

    const wishlist = getWishlist();
    grid.innerHTML = '';

    if (wishlist.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class='bx bx-heart'></i>
                <p>Your wishlist is empty.</p>
                <a href="shop.html" class="btn-primary" style="padding: 10px 20px; background: var(--primary-color); color: white; border-radius: 6px; text-decoration: none;">Start Shopping</a>
            </div>
        `;
        return;
    }

    wishlist.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Re-using product card structure
        card.innerHTML = `
            <div class="card-image" style="position: relative;">
                <button class="btn-remove-wishlist" onclick="removeFromWishlist('${product.id}')" title="Remove">
                    <i class='bx bxs-trash'></i>
                </button>
                <span class="card-badge">${product.badge || 'Sale'}</span>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x250?text=Product'">
            </div>
            <div class="card-details">
                <span class="card-category">${product.category || 'Sweet'}</span>
                <h3 class="card-title">${product.name}</h3>
                <div class="card-price">
                    ₹${product.price}
                </div>
                
                <div class="card-actions">
                    <button class="btn-card btn-add-cart" onclick="addToCart('${product.id}')">
                        <i class='bx bx-cart-add'></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Add to Cart Logic (Simplified for Wishlist Page)
function addToCart(id) {
    const wishlist = getWishlist();
    const product = wishlist.find(p => p.id === id);

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

    // Check if updateCartCount exists (it's in navbar.js)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        alert("Added to cart!");
    }
}
