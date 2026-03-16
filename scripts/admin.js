// إدارة لوحة التحكم
// المتغيرات العامة
let currentSection = 'drinks';
let currentEditId = null;
let drinks = [];
let orders = [];
let stats = {};

// تهيئة الصفحة
function init() {
    setupNavigation();
    setupModal();
    setupForms();
    setupFilters();
    
    // تحميل البيانات الأولية
    loadMockData();
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

    // تحميل البيانات حسب القسم
    switch(section) {
        case 'drinks':
            loadDrinks();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'stats':
            loadStats();
            break;
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

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

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

function closeModal() {
    // إغلاق المودال الرئيسي للمشروبات
    const drinkModal = document.getElementById('drink-modal');
    if (drinkModal) {
        drinkModal.classList.remove('active');
    }
    
    // إغلاق جميع المودالات المخصصة فقط (ماعدا المودال الرئيسي)
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.id !== 'drink-modal') {
            modal.remove();
        }
    });
    
    // إغلاق جميع القوائم المنسدلة
    closeAllDropdowns();
    
    // إعادة تعيين النموذج والمتغيرات
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

// المشروبات - بيانات وهمية
function loadDrinks() {
    drinks = getMockDrinks();
    renderDrinks();
}

// بيانات وهمية للمشروبات
function getMockDrinks() {
    return [
        {
            id: 1,
            name: 'كابتشينو',
            description: 'قهوة إسبريسو مع حليب مبخر ورغوة كثيفة',
            price: 30,
            categoryName: 'ساخن',
            milk: 'نعم',
            temperature: 'ساخن',
            syrup: 'فانيليا',
            toppings: 'قرفة',
            image: 'https://www.alicafearabia.com/storage/news/March2024/a30A4alxeeuvZwjAdPFQ.webp'
        },
        {
            id: 2,
            name: 'لاتيه',
            description: 'إسبريسو مع كمية كبيرة من الحليب المبخر',
            price: 32,
            categoryName: 'ساخن',
            milk: 'نعم',
            temperature: 'ساخن',
            syrup: 'كراميل',
            toppings: 'كريمة',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIUidqA88q0CjnADP5mjgupXLu3t6ubTCntQ&s'
        },
        {
            id: 3,
            name: 'إسبريسو',
            description: 'قهوة مركزة بطعم قوي',
            price: 20,
            categoryName: 'ساخن',
            milk: 'لا',
            temperature: 'ساخن',
            syrup: 'بدون',
            toppings: 'بدون',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwr7SJbaGmFPdC1UUvLMlbVBfXgh06H00eQw&s'
        },
        {
            id: 4,
            name: 'موكا',
            description: 'قهوة مع شوكولاتة وحليب',
            price: 35,
            categoryName: 'ساخن',
            milk: 'نعم',
            temperature: 'ساخن',
            syrup: 'شوكولاتة',
            toppings: 'كريمة',
            image: 'https://www.nescafe.com/il/sites/default/files/2023-05/RecipeHero_MochaFrappe_1066x1066_0.jpg'
        },
        {
            id: 5,
            name: 'أمريكانو',
            description: 'إسبريسو مع ماء ساخن',
            price: 25,
            categoryName: 'ساخن',
            milk: 'اختياري',
            temperature: 'ساخن',
            syrup: 'بدون',
            toppings: 'بدون',
            image: 'https://www.mcdonalds.eg/Cms_Data/Contents/Ar/Media/McCafe/700x345/Americano.png'
        },
        {
            id: 6,
            name: 'شاي أحمر',
            description: 'شاي تقليدي ساخن',
            price: 15,
            categoryName: 'ساخن',
            milk: 'اختياري',
            temperature: 'ساخن',
            syrup: 'بدون',
            toppings: 'نعناع',
            image: 'https://cdn.salla.sa/ZZaYp/wbCoxLwpYsM0XkEGkdHtSEisxrJVPEsVCREwElum.jpg'
        },
        {
            id: 7,
            name: 'هوت شوكليت',
            description: 'مشروب شوكولاتة ساخن بالحليب',
            price: 30,
            categoryName: 'ساخن',
            milk: 'نعم',
            temperature: 'ساخن',
            syrup: 'شوكولاتة',
            toppings: 'مارشميلو',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxQ5j1TPLSjohLI83F_g2V4cgVWQ3rTlPmnw&s'
        }
    ];
}

async function saveDrink() {
    const formData = getFormData();
    
    if (currentEditId) {
        // تعديل مشروب موجود
        const index = drinks.findIndex(d => d.id === currentEditId);
        if (index !== -1) {
            drinks[index] = { ...drinks[index], ...formData };
            showNotification('تم تحديث المشروب بنجاح', 'success');
        }
    } else {
        // إضافة مشروب جديد
        const newDrink = {
            ...formData,
            id: Math.max(...drinks.map(d => d.id)) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        drinks.push(newDrink);
        showNotification('تم إضافة المشروب بنجاح', 'success');
    }
    
    closeModal();
    renderDrinks();
}

function deleteDrink(id) {
    const drink = drinks.find(d => d.id === id);
    if (!drink) return;

    const modalContent = `
        <div class="delete-modal">
            <div class="delete-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>تأكيد الحذف</h3>
            <p>هل أنت متأكد من حذف المشروب "${drink.name}"؟</p>
            <p class="warning-text">هذا الإجراء لا يمكن التراجع عنه</p>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">إلغاء</button>
                <button class="btn-primary delete-btn" onclick="confirmDeleteDrink(${id})">حذف</button>
            </div>
        </div>
    `;

    showModal(modalContent, 'حذف مشروب');
}

function confirmDeleteDrink(id) {
    drinks = drinks.filter(d => d.id !== id);
    showNotification('تم حذف المشروب بنجاح', 'success');
    closeModal();
    renderDrinks();
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
        image: document.getElementById('drink-image').value || ''
    };
}

function loadDrinkToForm(id) {
    const drink = drinks.find(d => d.id === id);
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

    tbody.innerHTML = drinks.map(drink => `
        <tr>
            <td>#${drink.id}</td>
            <td>${drink.name}</td>
            <td>${drink.description}</td>
            <td>${drink.price} ريال</td>
            <td>${drink.categoryName}</td>
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
    `).join('');
}

// الطلبات - بيانات وهمية
function loadOrders() {
    orders = getMockOrders();
    renderOrders();
}

// بيانات وهمية للطلبات
function getMockOrders() {
    return [
        {
            id: 1,
            date: '2026-03-14T10:30:00Z',
            items: [
                { name: 'كابتشينو', quantity: 2, price: 30 },
                { name: 'لاتيه', quantity: 1, price: 32 }
            ],
            total: 92,
            status: 'pending'
        },
        {
            id: 2,
            date: '2026-03-14T11:15:00Z',
            items: [
                { name: 'إسبريسو', quantity: 1, price: 20 },
                { name: 'موكا', quantity: 1, price: 35 }
            ],
            total: 55,
            status: 'preparing'
        },
        {
            id: 3,
            date: '2026-03-14T12:00:00Z',
            items: [
                { name: 'أمريكانو', quantity: 2, price: 25 }
            ],
            total: 50,
            status: 'ready'
        },
        {
            id: 4,
            date: '2026-03-14T09:45:00Z',
            items: [
                { name: 'شاي أحمر', quantity: 1, price: 15 },
                { name: 'هوت شوكليت', quantity: 1, price: 30 }
            ],
            total: 45,
            status: 'completed'
        },
        {
            id: 5,
            date: '2026-03-14T13:30:00Z',
            items: [
                { name: 'كابتشينو', quantity: 3, price: 30 }
            ],
            total: 90,
            status: 'pending'
        }
    ];
}

function filterOrders(status) {
    let filteredOrders = orders;
    
    if (status !== 'all') {
        filteredOrders = orders.filter(order => order.status === status);
    }
    
    renderOrders(filteredOrders);
}

function renderOrders(ordersToRender = orders) {
    const tbody = document.getElementById('orders-tbody');
    
    if (!ordersToRender || ordersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">لا توجد طلبات حالياً</td></tr>';
        return;
    }

    tbody.innerHTML = ordersToRender.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${formatDate(order.date)}</td>
            <td>
                ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
            </td>
            <td>${order.total} ريال</td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${getStatusText(order.status)}
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

function updateOrderStatus(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const modalContent = `
        <div class="status-update-modal">
            <div class="status-header">
                <h3>تحديث حالة الطلب #${order.id}</h3>
            </div>
            
            <div class="current-status">
                <label>الحالة الحالية:</label>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="new-status">
                <label for="new-status-select">الحالة الجديدة:</label>
                <select id="new-status-select" class="status-select">
                    <option value="">اختر الحالة الجديدة</option>
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>قيد التحضير</option>
                    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>جاهز</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                </select>
            </div>
            
            <div class="status-actions">
                <button class="btn-secondary" onclick="closeModal()">إلغاء</button>
                <button class="btn-primary" onclick="confirmStatusUpdate(${id})">تحديث</button>
            </div>
        </div>
    `;

    showModal(modalContent, 'تحديث حالة الطلب');
    
    // التركيز على القائمة المنسدلة
    setTimeout(() => {
        const select = document.getElementById('new-status-select');
        if (select) {
            select.focus();
        }
    }, 100);
}

function confirmStatusUpdate(id) {
    const select = document.getElementById('new-status-select');
    const newStatus = select ? select.value : '';
    
    if (!newStatus) {
        showNotification('الرجاء اختيار حالة جديدة', 'error');
        return;
    }
    
    if (newStatus === orders.find(o => o.id === id).status) {
        showNotification('لم يتم تغيير الحالة', 'info');
        closeModal();
        return;
    }

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        showNotification('تم تحديث حالة الطلب بنجاح', 'success');
        closeModal();
        renderOrders();
    }
}

function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    // إنشاء محتوى المودال
    const modalContent = `
        <div class="order-details-modal">
            <div class="order-header">
                <h3>تفاصيل الطلب #${order.id}</h3>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="order-info">
                <div class="info-row">
                    <label>التاريخ:</label>
                    <span>${formatDate(order.date)}</span>
                </div>
                <div class="info-row">
                    <label>الحالة:</label>
                    <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
                </div>
                <div class="info-row">
                    <label>الإجمالي:</label>
                    <span class="total-price">${order.total} ريال</span>
                </div>
            </div>
            
            <div class="order-items">
                <h4>العناصر:</h4>
                ${order.items.map(item => `
                    <div class="item-row">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">${item.quantity} × ${item.price} ريال</span>
                        <span class="item-total">${item.quantity * item.price} ريال</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    showModal(modalContent, 'تفاصيل الطلب');
}

// الإحصائيات - بيانات وهمية
function loadStats() {
    stats = getMockStats();
    renderStats();
}

// بيانات وهمية للإحصائيات
function getMockStats() {
    return {
        totalOrders: 156,
        pending: 8,
        preparing: 15,
        ready: 12,
        completed: 121
    };
}

function renderStats() {
    document.getElementById('total-orders').textContent = stats.totalOrders || 0;
    document.getElementById('pending-orders').textContent = stats.pending || 0;
    document.getElementById('preparing-orders').textContent = stats.preparing || 0;
    document.getElementById('ready-orders').textContent = stats.ready || 0;
    document.getElementById('completed-orders').textContent = stats.completed || 0;
}

// تحميل جميع البيانات الوهمية
function loadMockData() {
    loadDrinks();
    loadOrders();
    loadStats();
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
    const statusMap = {
        'pending': 'قيد الانتظار',
        'preparing': 'قيد التحضير',
        'ready': 'جاهز',
        'completed': 'مكتمل'
    };
    return statusMap[status] || status;
}

// إدارة القوائم المنسدلة
function showDropdown(id, type) {
    // إغلاق جميع القوائم المفتوحة
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    
    // فتح القائمة المطلوبة
    const dropdown = document.getElementById(`dropdown-${type}-${id}`);
    if (dropdown) {
        dropdown.classList.add('active');
    }
    
    // إغلاق القائمة عند النقر خارجها
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
    // إغلاق أي مودال مخصص مفتوح فقط (ماعدا المودال الرئيسي)
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
    
    // إغلاق المودال عند النقر خارجه
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideDown 0.3s ease;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;

    document.body.appendChild(notification);

    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// إضافة أنميشن للإشعارات
const style = document.createElement('style');
style.textContent = `
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
