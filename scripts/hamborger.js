// sidebar-component.js

const sidebarHTML = `


<div class="menu-toggle" id="menuToggle"><i class="fas fa-bars"></i></div>
<aside class="sidebar" id="sidebar">
    <nav class="nav-menu">
        <a href="index.html" class="nav-item" id="link-home"><i class="fas fa-home"></i><span>الرئيسية</span></a>
        <a href="orders.html" class="nav-item" id="link-orders"><i class="fas fa-clipboard-list"></i><span>الطلبات</span></a>
        <a href="cart.html" class="nav-item" id="link-cart">
            <div class="icon-wrapper">
                <i class="fas fa-shopping-cart"></i>
                <span class="badge" id="side-cart-count">0</span>
            </div>
            <span>السلة</span>
        </a>
    </nav>
</aside>
<div class="overlay" id="overlay"></div>
`;

// حقن الكود في الصفحة
document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

// البرمجة (JS)
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
});

// تحديث الـ Badge تلقائياً
function refreshBadge() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('side-cart-count').textContent = total;
}
refreshBadge();

// تحديد القسم النشط (Active) بناءً على اسم الصفحة
const currentPage = window.location.pathname.split("/").pop();
if (currentPage === "index.html" || currentPage === "") document.getElementById('link-home').classList.add('active');
if (currentPage === "orders.html") document.getElementById('link-orders').classList.add('active');
if (currentPage === "cart.html") document.getElementById('link-cart').classList.add('active');