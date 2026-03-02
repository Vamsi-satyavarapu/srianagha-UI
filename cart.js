document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    loadCart(user.id);
});


/* ================= LOAD CART ================= */

function loadCart(user_id) {

    fetch(`http://localhost:5000/api/cart/${user_id}`)
        .then(res => res.json())
        .then(cartItems => {

            const cartList = document.getElementById('cart-items-list');
            const subtotalEl = document.getElementById('summary-subtotal');
            const totalEl = document.getElementById('summary-total');
            const cartCountEl = document.querySelector('.cart-count');

            cartList.innerHTML = "";

            if (!cartItems || cartItems.length === 0) {

                cartList.innerHTML = `
                    <div class="empty-cart-message">
                        <p>Your cart is currently empty.</p>
                        <a href="index.html" class="btn-secondary">Continue Shopping</a>
                    </div>
                `;

                subtotalEl.innerText = 'Rs. 0.00';
                totalEl.innerText = 'Rs. 0.00';
                if (cartCountEl) cartCountEl.innerText = 0;

                return;
            }

            let subtotal = 0;
            let totalCount = 0;

            cartItems.forEach(item => {

                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                totalCount += item.quantity;

                const row = `
                    <div class="cart-item-row">
                        <div class="col-product">
                            <div class="product-info">
                                <img src="${item.image}" width="80">
                                <div class="product-details">
                                    <h3>${item.name}</h3>
                                    <button onclick="removeItem(${user_id}, ${item.id})">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-price">
                            Rs. ${item.price}
                        </div>

                        <div class="col-quantity">
                            <input type="number" 
                                   value="${item.quantity}" 
                                   min="1"
                                   onchange="updateQuantity(${user_id}, ${item.id}, this.value)">
                        </div>

                        <div class="col-total">
                            Rs. ${itemTotal.toFixed(2)}
                        </div>
                    </div>
                `;

                cartList.innerHTML += row;
            });

            subtotalEl.innerText = 'Rs. ' + subtotal.toFixed(2);
            totalEl.innerText = 'Rs. ' + subtotal.toFixed(2);

            if (cartCountEl) cartCountEl.innerText = totalCount;
        })
        .catch(err => console.log("Cart Load Error:", err));
}


/* ================= UPDATE QUANTITY ================= */

function updateQuantity(user_id, product_id, quantity) {

    fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user_id,
            product_id: product_id,
            quantity: parseInt(quantity)
        })
    })
    .then(res => res.json())
    .then(() => loadCart(user_id))
    .catch(err => console.log("Update Error:", err));
}


/* ================= REMOVE ITEM ================= */

function removeItem(user_id, product_id) {

    fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user_id,
            product_id: product_id
        })
    })
    .then(res => res.json())
    .then(() => loadCart(user_id))
    .catch(err => console.log("Remove Error:", err));
}