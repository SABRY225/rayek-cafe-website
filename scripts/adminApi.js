const drinksApiUrl = 'https://server.coffee.intelakah.com/api/drinks';
const ordersApiUrl = 'https://server.coffee.intelakah.com/api/orders/all';
const statsApiUrl  = 'https://server.coffee.intelakah.com/api/stats';

function makeRequest(method, url, body, callback) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            if (callback) callback(true, xhr.response);
        } else {
            console.error(`[${method} ${url}] Error:`, xhr.status);
            if (callback) callback(false, new Error(`HTTP ${xhr.status}`));
        }
    };
    xhr.onerror = function () {
        console.error(`[${method} ${url}] Network error`);
        if (callback) callback(false, new Error('Network error'));
    };
    if (body !== null && body !== undefined) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));
    } else {
        xhr.send();
    }
}

function loadDrinksFromAPI() {
    makeRequest('GET', drinksApiUrl, null, function (success, result) {
        if (success) {
            drinks = Array.isArray(result) ? result : [];
            console.log('Drinks loaded:', drinks.length);
        } else {
            drinks = [];
            showNotification('فشل تحميل المشروبات', 'error');
        }
        renderDrinks();
    });
}

function loadOrdersFromAPI() {
    makeRequest('GET', ordersApiUrl, null, function (success, result) {
        if (success) {
            orders = Array.isArray(result) ? result : (result.orders || []);
            console.log('Orders loaded:', orders.length);
        } else {
            orders = [];
            showNotification('فشل تحميل الطلبات', 'error');
        }
        renderOrders();
    });
}

function loadStatsFromAPI() {
    makeRequest('GET', statsApiUrl, null, function (success, result) {
        if (success) {
            const cleanStats = Object.fromEntries(
                Object.entries(result).filter(([key]) => key !== "")
            );
            stats = cleanStats;
            console.log('Stats loaded:', stats);
        } else {
            stats = {};
            showNotification('فشل تحميل الإحصائيات', 'error');
        }
        renderStats();
    });
}

// ✅ تحميل كل البيانات دفعة واحدة عند تحميل الصفحة
function loadAllData() {
    loadDrinksFromAPI();
    loadOrdersFromAPI();
    loadStatsFromAPI();
}

function saveDrinkToAPI(drinkData, isEdit, drinkId, callback) {
    const url    = isEdit ? `${drinksApiUrl}/${drinkId}` : drinksApiUrl;
    const method = isEdit ? 'PUT' : 'POST';
    makeRequest(method, url, drinkData, callback);
}

function deleteDrinkFromAPI(drinkId, callback) {
    makeRequest('DELETE', `${drinksApiUrl}/${drinkId}`, null, callback);
}

function updateOrderStatusAPI(orderId, newStatus, callback) {
    const url = `https://server.coffee.intelakah.com/api/orders/${orderId}/status`;
    makeRequest('PUT', url, { status: newStatus }, callback);
}