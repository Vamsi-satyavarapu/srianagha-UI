const navbarHTML = `
<!-- Promotion Bar -->
<div class="promo-bar">
    <div class="marquee-content">
        <span>Free Shipping on Orders Above ₹999 | Use Code: SWEET10 &nbsp;&nbsp;&nbsp;&nbsp; Order on Whatsapp Also
            &nbsp;&nbsp;&nbsp;&nbsp; Authentic Atreyapuram Putharekulu</span>
        
    </div>
</div>

<!-- Header -->
<header class="header">
    <div class="container header-container" id="header-container">
        <div class="logo">
            <a href="index.html" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                <img src="images/logo.png" alt="ATPU Logo" id="header-logo"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                <span class="logo-text"> </span>

                श्री అనఘా
            </a>
        </div>

        <!-- Hamburger Menu Button -->
        <button class="hamburger" id="hamburger-btn" aria-label="Toggle menu">
            <i class='bx bx-menu'></i>
        </button>

        <!-- Standard Nav Menu -->
        <nav class="nav-menu" id="nav-menu">
            <ul>
                <li><a href="index.html" data-page="index.html">Home</a></li>
                <li class="dropdown-parent">
                    <a href="#" data-page="shop.html">Shop <i class='bx bx-chevron-down'></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="shop.html?category=all">All Products</a></li>
                        <li><a href="shop.html?category=Traditional">Traditional Putharekulu</a></li>
                        <li><a href="shop.html?category=Premium Delights">Premium Delights</a></li>
                        <li><a href="shop.html?category=Dry Fruit Specials">Dry Fruit Specials</a></li>
                        <li><a href="shop.html?category=Chocolate Fusion">Chocolate Fusion</a></li>
                        <li><a href="shop.html?category=Combo Packs">Combo Packs</a></li>
                    </ul>
                </li>
                <li><a href="#" data-page="corporate.html">Corporate Gifting</a></li>
                <li><a href="about.html" data-page="about.html">About Us</a></li>
                <li><a href="contact.html" data-page="contact.html">Contact Us</a></li>
            </ul>
        </nav>

        <!-- Inline Search Container (Hidden by default, Visible in Search Mode) -->
        <div class="header-search-container" id="header-search-container">
            <div class="search-input-group">
                <input type="text" placeholder="Search products" id="search-input">
                <i class='bx bx-search'></i>
            </div>
            <div class="header-popular-searches">
                <span class="popular-label">Popular Searches:</span>
                <a href="#">Jaggery</a>
                <a href="#">Dry Fruits</a>
                <a href="#">Jelly</a>
                <a href="#">Family Combos</a>
            </div>
        </div>

        <div class="header-icons">
            <button aria-label="Search" id="search-toggle-btn"><i
                    class='bx bx-search'></i></button>
            <a href="login.html" aria-label="Account" style="color: inherit;"><i class='bx bx-user'></i></a>
            <a href="wishlist.html" aria-label="Wishlist" class="wishlist-btn" style="color: inherit; text-decoration: none; position: relative;">
                <i class='bx bx-heart'></i>
                <span class="wishlist-count" style="position: absolute; top: -5px; right: -8px; background-color: #E53935; color: white; font-size: 0.7rem; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; display: none;">0</span>
            </a>
            <a href="cart.html" aria-label="Cart" class="cart-btn" style="color: inherit; text-decoration: none;">
                <i class='bx bx-shopping-bag'></i>
                <span class="cart-count">0</span>
            </a>
        </div>
    </div>
</header>
`;

document.addEventListener("DOMContentLoaded", function () {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        navbarPlaceholder.innerHTML = navbarHTML;
        setActiveLink();
        updateCartCount();
        updateWishlistCount();
        checkLoginState();

        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const header = document.querySelector('.header');

        if (isHomePage) {
            header.classList.add('transparent');

            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.remove('transparent');
                } else {
                    header.classList.add('transparent');
                }
            });
        } else {
            document.body.style.paddingTop = "120px";
        }

        const searchToggleBtn = document.getElementById('search-toggle-btn');
        if (searchToggleBtn) {
            searchToggleBtn.addEventListener('click', toggleSearch);
        }

        const hamburgerBtn = document.getElementById('hamburger-btn');
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', toggleMenu);
        }
    }
});

function checkLoginState() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const loginLink = document.querySelector('a[href="login.html"]');

    if (userInfo && loginLink) {
        loginLink.innerHTML = `<i class='bx bx-log-out'></i>`;
        loginLink.setAttribute('title', `Logout (${userInfo.name})`);
        loginLink.href = "#";
        loginLink.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    }
}

window.logout = function () {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart'); // Optional: clear cart on logout? Usually better to keep or clear. Let's keep for now.
        alert("Logged out successfully.");
        window.location.href = 'index.html';
    }
}

function setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("data-page") === currentPath) {
            link.classList.add("active");
        }
    });
}

window.toggleSearch = function () {
    const header = document.querySelector('.header');
    const searchIcon = document.querySelector('#search-toggle-btn i');
    const searchInput = document.getElementById('search-input');

    document.body.classList.toggle('search-active');
    header.classList.toggle('search-mode');

    if (header.classList.contains('search-mode')) {
        searchIcon.classList.remove('bx-search');
        searchIcon.classList.add('bx-x');
        setTimeout(() => searchInput?.focus(), 100);
    } else {
        searchIcon.classList.remove('bx-x');
        searchIcon.classList.add('bx-search');
    }
}

window.toggleMenu = function () {
    const navMenu = document.getElementById('nav-menu');
    const hamburgerIcon = document.querySelector('#hamburger-btn i');
    const header = document.querySelector('.header');

    navMenu.classList.toggle('active');
    header.classList.toggle('menu-open');

    if (navMenu.classList.contains('active')) {
        hamburgerIcon.classList.remove('bx-menu');
        hamburgerIcon.classList.add('bx-x');
    } else {
        hamburgerIcon.classList.remove('bx-x');
        hamburgerIcon.classList.add('bx-menu');
    }
}

window.updateCartCount = function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

window.getWishlist = function () {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

window.saveWishlist = function (wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

window.addToWishlist = function (product, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    let wishlist = getWishlist();
    if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push(product);
        saveWishlist(wishlist);
        window.updateWishlistCount(); 

        if (event && event.currentTarget) {
            const icon = event.currentTarget.querySelector('i');
            if (icon) {
                icon.classList.remove('bx-heart');
                icon.classList.add('bxs-heart');
                icon.style.color = '#E53935';
            }
        }
        alert(`${product.name} added to wishlist!`);
    } else {
        alert("Item already in wishlist!");
    }
}

window.updateWishlistCount = function () {
    const wishlist = getWishlist();
    const count = wishlist.length;
    const wishlistCountEl = document.querySelector('.wishlist-count');
    if (wishlistCountEl) {
        wishlistCountEl.innerText = count;
        wishlistCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}
