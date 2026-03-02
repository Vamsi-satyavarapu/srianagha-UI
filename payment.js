// Payment Page Logic
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutSummary();

    // Handle Form Submission
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleOrderSubmission);
    }
});

function loadCheckoutSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsList = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (cartItems.length === 0) {
        itemsList.innerHTML = '<p>Your cart is empty.</p>';
        window.location.href = 'shop.html'; // Redirect if empty
        return;
    }

    let subtotal = 0;
    let html = '';

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        html += `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/600x400?text=Product'">
                <div class="checkout-item-details">
                    <span class="checkout-item-name">${item.name}</span>
                    <span class="checkout-item-meta">Qty: ${item.quantity}</span>
                </div>
                <span class="checkout-item-price">Rs. ${itemTotal}</span>
            </div>
        `;
    });

    itemsList.innerHTML = html;
    subtotalEl.innerText = 'Rs. ' + subtotal.toFixed(2);
    totalEl.innerText = 'Rs. ' + subtotal.toFixed(2);
}

function handleOrderSubmission(e) {
    e.preventDefault();

    const btn = document.querySelector('.place-order-btn');
    const originalText = btn.innerText;

    // 1. Basic Validation (HTML5 handles required fields)

    // 2. Simulate Processing
    btn.disabled = true;
    btn.innerText = 'Processing...';

    setTimeout(() => {
        // 3. Success Logic
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('modal-order-id').innerText = '#' + orderId;

        // Show Modal
        const modal = document.getElementById('success-modal');
        modal.style.display = 'flex';

        // Clear Cart
        localStorage.removeItem('cart');
        if (window.updateCartCount) window.updateCartCount();

    }, 2000);
}
