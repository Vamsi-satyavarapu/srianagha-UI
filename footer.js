// Footer HTML Content
const footerHTML = `
<footer class="footer">
    <div class="container footer-content">
        <div class="footer-col">
            <h3>About ATPU</h3>
            <p>Bringing the authentic taste of Atreyapuram Putharekulu to the world. Made with tradition, served
                with love.</p>
        </div>
        <div class="footer-col">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="shop.html">Shop All</a></li>
                <li><a href="track.html">Track Order</a></li>
                <li><a href="contact.html">Contact Us</a></li>
            </ul>
        </div>
        <div class="footer-col social">
            <h3>Follow Us</h3>
            <div class="social-icons">
                <a href="#"><i class='bx bxl-instagram'></i></a>
                <a href="#"><i class='bx bxl-facebook'></i></a>
                <a href="#"><i class='bx bxl-whatsapp'></i></a>
            </div>
        </div>
    </div>
    <div class="container footer-bottom">
        &copy; 2026 Atreyapuram Putharekulu. All rights reserved.
    </div>
</footer>
`;

// Load Footer
document.addEventListener("DOMContentLoaded", function () {
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }
});
