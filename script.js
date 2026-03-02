// ===============================
// Product Gallery Image Switcher
// ===============================
function changeImage(imageSrc, thumbnailElement) {
    const mainImage = document.getElementById('main-product-image');
    if (!mainImage) return;

    mainImage.style.opacity = '0';

    setTimeout(() => {
        mainImage.src = imageSrc;
        mainImage.style.opacity = '1';

        mainImage.onerror = function () {
            this.onerror = null;
            this.src = 'https://via.placeholder.com/600x400?text=Product+Image';
        };
    }, 200);

    // Active thumbnail highlight
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });

    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
}


// ===============================
// Quantity Selector
// ===============================
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;

    let currentValue = parseInt(quantityInput.value) || 1;
    quantityInput.value = currentValue + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;

    let currentValue = parseInt(quantityInput.value) || 1;

    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}


// ===============================
// Variant Selection
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    const variantGroups = document.querySelectorAll('.variants');

    variantGroups.forEach(group => {
        const buttons = group.querySelectorAll('.variant-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

});


// ===============================
// Add To Cart (LocalStorage)
// ===============================
function addToCart() {

    const btn = document.querySelector('.add-to-cart-btn');
    const quantityInput = document.getElementById('quantity');

    if (!btn || !quantityInput) return;

    const originalText = btn.innerHTML;
    const quantity = parseInt(quantityInput.value) || 1;

    btn.innerHTML = `<i class='bx bx-check'></i> Adding...`;

    const item = {
        id: 'trial-pack-10',
        name: 'Assorted Trial Pack',
        variant: 'Jaggery Box [10 Pcs]',
        price: 499.00,
        image: 'product_main_box.png',
        quantity: quantity
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(i => i.id === item.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    setTimeout(() => {
        btn.innerHTML = originalText;
        window.location.href = 'cart.html';
    }, 500);
}


// ===============================
// Update Cart Count On Load
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = count;
    }

});


// ===============================
// Header Search Toggle
// ===============================
function toggleSearch() {

    const header = document.querySelector('.header');
    const toggleBtn = document.getElementById('search-toggle-btn');

    if (!header || !toggleBtn) return;

    const searchIcon = toggleBtn.querySelector('i');

    header.classList.toggle('search-mode');

    if (header.classList.contains('search-mode')) {
        searchIcon.classList.remove('bx-search');
        searchIcon.classList.add('bx-x');

        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    } else {
        searchIcon.classList.remove('bx-x');
        searchIcon.classList.add('bx-search');
    }
}


// ===============================
// Close Search on ESC
// ===============================
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        const header = document.querySelector('.header');
        if (header && header.classList.contains('search-mode')) {
            toggleSearch();
        }
    }
});