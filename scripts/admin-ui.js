
let currentSection = 0;
let currentEditId = null;
let drinks = [];
let orders = [];
let stats = {};

function init() {
    setupNavigation();
    setupModal();
    setupForms();
    setupFilters();
    loadAllData();
}

// إعداد التنقل
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // تحديث الروابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // تحديث الأقسام
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    currentSection = section;
    // ✅ البيانات محملة مسبقاً — فقط أعد الرسم عند التبديل
    switch(section) {
        case 'drinks': renderDrinks(); break;
        case 'orders': renderOrders(); break;
        case 'stats':  renderStats();  break;
    }
}

// إعداد النافذة المنبثقة
function setupModal() {
    const modal = document.getElementById('drink-modal');
    const addBtn = document.getElementById('add-drink-btn');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');

    if (addBtn) {
        addBtn.addEventListener('click', () => openModal());
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal());
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal());
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// فتح المودال
function openModal(drinkId = null) {
    const modal = document.getElementById('drink-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('drink-form');

    if (!modal || !modalTitle || !form) {
        console.error('Modal elements not found');
        return;
    }

    if (drinkId) {
        modalTitle.textContent = 'تعديل مشروب';
        currentEditId = drinkId;
        loadDrinkToForm(drinkId);
    } else {
        modalTitle.textContent = 'إضافة مشروب جديد';
        currentEditId = null;
        form.reset();
    }

    modal.classList.add('active');
}

// إغلاق المودال
function closeModal() {
    const drinkModal = document.getElementById('drink-modal');
    if (drinkModal) {
        drinkModal.classList.remove('active');
    }
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.id !== 'drink-modal') {
            modal.remove();
        }
    });
    
    closeAllDropdowns();
    
    const form = document.getElementById('drink-form');
    if (form) {
        form.reset();
    }
    currentEditId = null;
}

// إعداد النماذج
function setupForms() {
    const drinkForm = document.getElementById('drink-form');
    
    if (drinkForm) {
        drinkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveDrink();
        });
    }
}

// إعداد الفلاتر
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const status = btn.dataset.status;
            filterOrders(status);
        });
    });
}

// المشروبات
function loadDrinks() {
    loadDrinksFromAPI();
}

function saveDrink() {
    const formData = getFormData();
    
    if (currentEditId) {
        saveDrinkToAPI(formData, true, currentEditId, function(success, result) {
            if (success) {
                showNotification('تم تعديل المشروب بنجاح', 'success');
                closeModal();
                loadDrinks();
            } else {
                console.error('Error saving drink:', result);
                showNotification('فشل حفظ المشروب', 'error');
            }
        });
    } else {
        saveDrinkToAPI(formData, false, null, function(success, result) {
            if (success) {
                showNotification('تم إضافة المشروب بنجاح', 'success');
                closeModal();
                loadDrinks();
            } else {
                console.error('Error saving drink:', result);
                showNotification('فشل حفظ المشروب', 'error');
            }
        });
    }
}

function getFormData() {
    return {
        name: document.getElementById('drink-name').value,
        description: document.getElementById('drink-description').value,
        price: parseFloat(document.getElementById('drink-price').value),
        categoryName: document.getElementById('drink-category').value,
        milk: document.getElementById('drink-milk').value,
        temperature: document.getElementById('drink-temperature').value,
        syrup: document.getElementById('drink-syrup').value || 'بدون',
        toppings: document.getElementById('drink-toppings').value || 'بدون',
        image: document.getElementById('drink-image').value
    };
}

function loadDrinkToForm(drinkId) {
    const drink = drinks.find(d => d.id === drinkId);
    if (!drink) return;

    document.getElementById('drink-name').value = drink.name;
    document.getElementById('drink-description').value = drink.description;
    document.getElementById('drink-price').value = drink.price;
    document.getElementById('drink-category').value = drink.categoryName;
    document.getElementById('drink-milk').value = drink.milk;
    document.getElementById('drink-temperature').value = drink.temperature;
    document.getElementById('drink-syrup').value = drink.syrup === 'بدون' ? '' : drink.syrup;
    document.getElementById('drink-toppings').value = drink.toppings === 'بدون' ? '' : drink.toppings;
    document.getElementById('drink-image').value = drink.image;
}

function renderDrinks() {
    const tbody = document.getElementById('drinks-tbody');
    
    if (!drinks || drinks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center;">لا توجد مشروبات حالياً</td></tr>';
        return;
    }

    tbody.innerHTML = drinks.map(drink => {
        const categoryName = drink.categoryName === 'سخن' ? 'ساخن' : drink.categoryName;
        
        return `
        <tr>
            <td>#${drink.id}</td>
            <td>${drink.name}</td>
            <td>${drink.description}</td>
            <td>${drink.price} ريال</td>
            <td>${categoryName}</td>
            <td>${drink.milk}</td>
            <td>${drink.temperature}</td>
            <td>${drink.syrup || 'بدون'}</td>
            <td>${drink.toppings || 'بدون'}</td>
            <td>
                ${drink.image ? 
                    `<img src="${drink.image}" alt="${drink.name}" class="drink-image" onerror="this.src='https://via.placeholder.com/50x50/cccccc/000000?text=No Image'">` : 
                    'لا توجد صورة'
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn more-options" onclick="showDropdown(${drink.id}, 'drink')" title="الخيارات">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu" id="dropdown-drink-${drink.id}">
                        <button class="dropdown-item" onclick="openModal(${drink.id})">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="dropdown-item delete" onclick="deleteDrink(${drink.id})">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

function deleteDrink(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المشروب؟')) return;

    deleteDrinkFromAPI(id, function(success, result) {
        if (success) {
            showNotification('تم حذف المشروب بنجاح', 'success');
            loadDrinks();
        } else {
            console.error('Error deleting drink:', result);
            showNotification('فشل حذف المشروب', 'error');
        }
    });
}

// الطلبات
function loadOrders() {
    loadOrdersFromAPI();
}

function filterOrders(status) {
    let filteredOrders = orders;
    
    if (status !== 'all') {
        // ✅ فلترة حسب الـ status مع تعامل الـ custom orders
        filteredOrders = orders.filter(order => {
            // لو الـ order custom و status فاضي، اعتبره "preparing"
            const orderStatus = order.status || (order.type === 'custom' ? 'preparing' : order.status);
            return orderStatus === status;
        });
    }
    
    renderOrders(filteredOrders);
}

function renderOrders(ordersToRender = orders) {
    const tbody = document.getElementById('orders-tbody');
    
    // Ensure ordersToRender is an array
    if (!ordersToRender || !Array.isArray(ordersToRender) || ordersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">لا توجد طلبات حالياً</td></tr>';
        return;
    }

    tbody.innerHTML = ordersToRender.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${formatDate(order.orderTime ? new Date(Date.now() - order.orderTime * 60000) : new Date())}</td>
            <td>
                ${order.items && order.items.length > 0 ? 
                    order.items.map(item => `${item.name} (${item.quantity})`).join(', ') : 
                    'لا توجد عناصر'
                }
            </td>
            <td>${order.totalPrice || order.total || 0} ريال</td>
            <td>
                <span class="status-badge status-${order.status || 'preparing'}">
                    ${getStatusText(order.status || 'preparing')}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn more-options" onclick="showDropdown(${order.id}, 'order')" title="الخيارات">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu" id="dropdown-order-${order.id}">
                        <button class="dropdown-item" onclick="viewOrder(${order.id})">
                            <i class="fas fa-eye"></i> عرض التفاصيل
                        </button>
                        <button class="dropdown-item" onclick="updateOrderStatus(${order.id})">
                            <i class="fas fa-sync"></i> تحديث الحالة
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const modalContent = `
        <div class="order-details-modal">
            <div class="order-header">
                <h3>تفاصيل الطلب #${order.id}</h3>
                <span class="status-badge status-${order.status || 'preparing'}">
                    ${getStatusText(order.status || 'preparing')}
                </span>
            </div>
            <div class="order-info">
                <div class="info-row">
                    <span>التاريخ:</span>
                    <span>${formatDate(order.orderTime ? new Date(Date.now() - order.orderTime * 60000) : new Date())}</span>
                </div>
                <div class="info-row">
                    <span>الحالة:</span>
                    <span>${getStatusText(order.status || 'preparing')}</span>
                </div>
                <div class="info-row">
                    <span>العميل:</span>
                    <span>${order.CustomerName || 'غير محدد'}</span>
                </div>
                <div class="info-row">
                    <span>الهاتف:</span>
                    <span>${order.CustomerPhone || 'غير محدد'}</span>
                </div>
                <div class="info-row total-price">
                    <span>الإجمالي:</span>
                    <span>${order.totalPrice || order.total || 0} ريال</span>
                </div>
            </div>
            <div class="order-items">
                <h4>العناصر:</h4>
                ${order.items && order.items.length > 0 ? 
                    order.items.map(item => `
                        <div class="item-row">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">×${item.quantity}</span>
                            <span class="item-total">${item.quantity * item.price} ريال</span>
                        </div>
                    `).join('') : 
                    '<p>لا توجد عناصر</p>'
                }
            </div>
        </div>
    `;

    showModal(modalContent, 'تفاصيل الطلب');
}

function updateOrderStatus(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const modalContent = `
        <div class="status-update-modal">
            <div class="status-header">
                <h3>تحديث حالة الطلب #${order.id}</h3>
            </div>
            <div class="current-status">
                <span>الحالة الحالية:</span>
                <span class="status-badge status-${order.status || 'preparing'}">
                    ${getStatusText(order.status || 'preparing')}
                </span>
            </div>
            <div class="new-status">
                <label for="status-select">الحالة الجديدة:</label>
                <select id="status-select" class="status-select">
                    <option value="preparing" ${(order.status || 'preparing') === 'preparing' ? 'selected' : ''}>قيد التحضير</option>
                    <option value="ready" ${(order.status || 'preparing') === 'ready' ? 'selected' : ''}>جاهز</option>
                    <option value="completed" ${(order.status || 'preparing') === 'completed' ? 'selected' : ''}>مكتمل</option>
                    <option value="cencel" ${(order.status || 'preparing') === 'cencel' ? 'selected' : ''}>ملغي</option>
                </select>
            </div>
            <div class="order-type">
                <label for="type-select">نوع الطلب:</label>
                <select id="type-select" class="type-select">
                    <option value="custom" ${(order.type || 'custom') === 'custom' ? 'selected' : ''}>طلب مخصص</option>
                    <option value="normal" ${(order.type || 'custom') === 'normal' ? 'selected' : ''}>طلب من المنيو</option>
                </select>
            </div>
            <div class="status-actions">
                <button class="btn-secondary" onclick="closeModal()">إلغاء</button>
                <button class="btn-primary" onclick="saveOrderStatus(${id})">تحديث</button>
            </div>
        </div>
    `;

    showModal(modalContent, 'تحديث الحالة');
}

function saveOrderStatus(id) {
    const newStatus = document.getElementById('status-select').value;
    const newType = document.getElementById('type-select').value;
    
    updateOrderStatusAPI(id, newStatus, newType, function(success, result) {
        if (success) {
            showNotification('تم تحديث حالة الطلب بنجاح', 'success');
            closeModal();
            loadOrders();
        } else {
            console.error('Error updating order status:', result);
            showNotification('فشل تحديث حالة الطلب', 'error');
        }
    });
}

// الإحصائيات
function loadStats() {
    loadStatsFromAPI();
}

function renderStats() {
    document.getElementById('total-orders').textContent = stats.totalOrders || 0;
    document.getElementById('preparing-orders').textContent = stats.preparing || 0;
    document.getElementById('ready-orders').textContent = stats.ready || 0;
    document.getElementById('completed-orders').textContent = stats.completed || 0;
    document.getElementById('cancelled-orders').textContent = stats.cencel || 0; // ✅ استخدام cencel للملغيات
}

// وظائف مساعدة
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusText(status) {
    switch(status) {
        case 'preparing': return 'قيد التحضير';
        case 'ready': return 'جاهز';
        case 'completed': return 'مكتمل';
        case 'cencel': return 'ملغي';
        default: return 'قيد الانتظار';
    }
}

// إدارة القوائم المنسدلة
function showDropdown(id, type) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    
    const dropdown = document.getElementById(`dropdown-${type}-${id}`);
    if (dropdown) {
        dropdown.classList.add('active');
    }
    
    setTimeout(() => {
        document.addEventListener('click', () => closeAllDropdowns(), { once: true });
    }, 100);
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
}

// المودال العام
function showModal(content, title = '') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.id !== 'drink-modal') {
            modal.remove();
        }
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'custom-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// أنميشن الإشعارات
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: #4CAF50;
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    }
    
    .edit-indicator {
        background: #ff9800;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 10px;
        font-weight: 500;
    }
    
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', init);