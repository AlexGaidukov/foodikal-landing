// Admin API Class
class FoodikalAdminAPI {
    constructor(password) {
        this.baseURL = 'https://foodikal-ny-cors-wrapper.x-gs-x.workers.dev';
        this.password = password;
    }

    async _request(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.password}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: defaultOptions.headers
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Order Management
    async getAllOrders() {
        return await this._request('/api/admin/order_list', {
            method: 'GET'
        });
    }

    async updateOrderConfirmation(orderId, confirmations) {
        return await this._request(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            body: JSON.stringify(confirmations)
        });
    }

    async deleteOrder(orderId) {
        return await this._request(`/api/admin/orders/${orderId}`, {
            method: 'DELETE'
        });
    }

    // Menu Management
    async addMenuItem(itemData) {
        return await this._request('/api/admin/menu_add', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    }

    async updateMenuItem(itemId, updates) {
        return await this._request(`/api/admin/menu_update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteMenuItem(itemId) {
        return await this._request(`/api/admin/menu_delete/${itemId}`, {
            method: 'DELETE'
        });
    }

    // Get menu list (public endpoint, no auth needed)
    async getMenuList() {
        const response = await fetch(`${this.baseURL}/api/menu`);
        const data = await response.json();
        return data;
    }

    // Promo Code Management
    async getAllPromoCodes() {
        return await this._request('/api/admin/promo_codes', {
            method: 'GET'
        });
    }

    async createPromoCode(code) {
        return await this._request('/api/admin/promo_codes', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
    }

    async deletePromoCode(code) {
        return await this._request(`/api/admin/promo_codes/${code}`, {
            method: 'DELETE'
        });
    }

    // Banner Management
    async getAllBanners() {
        return await this._request('/api/admin/banners', {
            method: 'GET'
        });
    }

    async createBanner(bannerData) {
        return await this._request('/api/admin/banners', {
            method: 'POST',
            body: JSON.stringify(bannerData)
        });
    }

    async updateBanner(bannerId, updates) {
        return await this._request(`/api/admin/banners/${bannerId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteBanner(bannerId) {
        return await this._request(`/api/admin/banners/${bannerId}`, {
            method: 'DELETE'
        });
    }

    // Weekly Workbook
    async downloadWeeklyWorkbook() {
        const response = await fetch(`${this.baseURL}/api/admin/generate_weekly_workbook`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.password}`
            }
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({ error: 'Download failed' }));
            throw new Error(data.error || 'Failed to download workbook');
        }

        return response.blob();
    }
}

// Application State
let adminAPI = null;
let currentOrders = [];
let currentMenuItems = [];
let currentPromoCodes = [];
let currentBanners = [];
let selectedCategory = 'all';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const ordersTableTab = document.getElementById('ordersTableTab');
const menuTab = document.getElementById('menuTab');

// Orders Table Elements
const refreshOrdersTableBtn = document.getElementById('refreshOrdersTable');
const downloadWeeklyXlsxBtn = document.getElementById('downloadWeeklyXlsx');
const ordersTableLoading = document.getElementById('ordersTableLoading');
const ordersTableError = document.getElementById('ordersTableError');
const ordersTableBody = document.getElementById('ordersTableBody');

// Menu Elements
const showAddMenuFormBtn = document.getElementById('showAddMenuForm');
const addMenuForm = document.getElementById('addMenuForm');
const menuItemForm = document.getElementById('menuItemForm');
const cancelAddMenuBtn = document.getElementById('cancelAddMenu');
const editMenuModal = document.getElementById('editMenuModal');
const menuEditForm = document.getElementById('menuEditForm');
const menuLoading = document.getElementById('menuLoading');
const menuError = document.getElementById('menuError');
const menuContainer = document.getElementById('menuContainer');

// Promo Code Elements
const promoCodesTab = document.getElementById('promoCodesTab');
const promoCodeForm = document.getElementById('promoCodeForm');
const promoCodeInput = document.getElementById('promoCodeInput');
const promoCodeError = document.getElementById('promoCodeError');
const promoCodesLoading = document.getElementById('promoCodesLoading');
const promoCodesError = document.getElementById('promoCodesError');
const promoCodesContainer = document.getElementById('promoCodesContainer');
const promoCodesCount = document.getElementById('promoCodesCount');

// Banner Elements
const bannersTab = document.getElementById('bannersTab');
const showAddBannerFormBtn = document.getElementById('showAddBannerForm');
const bannersLoading = document.getElementById('bannersLoading');
const bannersError = document.getElementById('bannersError');
const bannersContainer = document.getElementById('bannersContainer');
const bannerModal = document.getElementById('bannerModal');
const bannerModalTitle = document.getElementById('bannerModalTitle');
const bannerForm = document.getElementById('bannerForm');
const editBannerId = document.getElementById('editBannerId');
const bannerName = document.getElementById('bannerName');
const bannerItemLink = document.getElementById('bannerItemLink');
const bannerImageUrl = document.getElementById('bannerImageUrl');
const bannerDisplayOrder = document.getElementById('bannerDisplayOrder');
const bannerImagePreview = document.getElementById('bannerImagePreview');
const bannerImagePreviewGroup = document.getElementById('bannerImagePreviewGroup');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
        adminAPI = new FoodikalAdminAPI(savedPassword);
        showDashboard();
        loadOrdersTable();
    }

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    refreshOrdersTableBtn.addEventListener('click', loadOrdersTable);
    downloadWeeklyXlsxBtn.addEventListener('click', handleDownloadWeeklyXlsx);
    showAddMenuFormBtn.addEventListener('click', () => {
        addMenuForm.style.display = 'block';
    });

    cancelAddMenuBtn.addEventListener('click', () => {
        addMenuForm.style.display = 'none';
        menuItemForm.reset();
    });

    menuItemForm.addEventListener('submit', handleAddMenuItem);
    menuEditForm.addEventListener('submit', handleEditMenuItem);

    // Promo code form
    promoCodeForm.addEventListener('submit', handleCreatePromoCode);

    // Banner form and buttons
    showAddBannerFormBtn.addEventListener('click', openCreateBannerModal);
    bannerForm.addEventListener('submit', handleBannerFormSubmit);
    bannerImageUrl.addEventListener('blur', previewBannerImage);

    // Category filter buttons
    const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');
    categoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update selected category
            selectedCategory = btn.dataset.category;

            // Update active button state
            categoryFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Re-render menu items
            renderMenuItems();
        });
    });
});

// Login Handler
async function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    loginError.textContent = '';

    try {
        // Test authentication by trying to fetch orders
        adminAPI = new FoodikalAdminAPI(password);
        const response = await fetch('https://foodikal-ny-cors-wrapper.x-gs-x.workers.dev/api/admin/order_list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${password}`
            }
        });

        const data = await response.json();
        console.log('Login response:', response.status, data);

        if (!response.ok || !data.success) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        // If successful, save password and show dashboard
        sessionStorage.setItem('adminPassword', password);
        showDashboard();
        loadOrdersTable();
    } catch (error) {
        console.error('Login error:', error);
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            loginError.textContent = 'CORS Error: Cannot connect to backend. The backend must allow requests from foodikal.rs';
        } else {
            loginError.textContent = `Login failed: ${error.message}`;
        }
    }
}

// Logout Handler
function handleLogout() {
    sessionStorage.removeItem('adminPassword');
    adminAPI = null;
    currentOrders = [];
    currentMenuItems = [];

    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
    loginForm.reset();
    loginError.textContent = '';
}

// Show Dashboard
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
}

// Switch Tab
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    ordersTableTab.classList.remove('active');
    menuTab.classList.remove('active');
    promoCodesTab.classList.remove('active');
    bannersTab.classList.remove('active');

    if (tabName === 'ordersTable') {
        ordersTableTab.classList.add('active');
        loadOrdersTable();
    } else if (tabName === 'menu') {
        menuTab.classList.add('active');
        loadMenuItems();
    } else if (tabName === 'promoCodes') {
        promoCodesTab.classList.add('active');
        loadPromoCodes();
    } else if (tabName === 'banners') {
        bannersTab.classList.add('active');
        loadBanners();
    }
}

// Update Order Confirmation
async function updateOrderConfirmation(orderId, field, value) {
    try {
        const updates = {};
        updates[field] = value;

        await adminAPI.updateOrderConfirmation(orderId, updates);

        // Update local state
        const order = currentOrders.find(o => o.id === orderId);
        if (order) {
            order[field] = value ? 1 : 0;
        }
    } catch (error) {
        alert(`Error updating order: ${error.message}`);
        // Reload orders to reset checkboxes
        loadOrdersTable();
    }
}

// Delete Order (kept for backward compatibility, but not used)
async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        return;
    }

    try {
        await adminAPI.deleteOrder(orderId);
        currentOrders = currentOrders.filter(o => o.id !== orderId);
        renderOrdersTable();
    } catch (error) {
        alert(`Error deleting order: ${error.message}`);
    }
}

// Load Orders Table
async function loadOrdersTable() {
    ordersTableLoading.style.display = 'block';
    ordersTableError.textContent = '';
    ordersTableBody.innerHTML = '';

    try {
        const data = await adminAPI.getAllOrders();
        currentOrders = data.orders;

        ordersTableLoading.style.display = 'none';
        renderOrdersTable();
    } catch (error) {
        ordersTableLoading.style.display = 'none';
        ordersTableError.textContent = `Error loading orders: ${error.message}`;
        console.error('Error loading orders table:', error);
    }
}

// Download Weekly XLSX Workbook
async function handleDownloadWeeklyXlsx() {
    const originalText = downloadWeeklyXlsxBtn.textContent;
    downloadWeeklyXlsxBtn.disabled = true;
    downloadWeeklyXlsxBtn.textContent = 'Generating...';

    try {
        const blob = await adminAPI.downloadWeeklyWorkbook();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Заказы_фуршет_нг.xlsx';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message briefly
        downloadWeeklyXlsxBtn.textContent = '✓ Downloaded';
        setTimeout(() => {
            downloadWeeklyXlsxBtn.textContent = originalText;
            downloadWeeklyXlsxBtn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Error downloading workbook:', error);
        alert(`Failed to download workbook: ${error.message}`);
        downloadWeeklyXlsxBtn.textContent = originalText;
        downloadWeeklyXlsxBtn.disabled = false;
    }
}

// Render Orders Table
function renderOrdersTable() {
    const totalSumElement = document.getElementById('ordersTotalSum');

    if (currentOrders.length === 0) {
        totalSumElement.textContent = '';
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 60px 20px; color: #666;">
                    <h3 style="margin-bottom: 10px; color: #999;">No orders yet</h3>
                    <p style="color: #aaa;">Orders will appear here once customers start placing them.</p>
                </td>
            </tr>
        `;
        return;
    }

    // Calculate total sum of all orders
    const totalSum = currentOrders.reduce((sum, order) => sum + order.total_price, 0);
    totalSumElement.textContent = `Total: ${totalSum.toLocaleString()} RSD (${currentOrders.length} orders)`;

    ordersTableBody.innerHTML = currentOrders.map(order => {
        const visibleItems = order.order_items.slice(0, 2);
        const hiddenItems = order.order_items.slice(2);
        const hasMoreItems = order.order_items.length > 2;

        // Format delivery date
        const deliveryDate = order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : '-';

        // Check if order has promo code
        const hasPromo = order.promo_code && order.discount_amount > 0;

        return `
        <tr>
            <td class="table-order-id">
                <span class="table-clickable" onclick="openOrderModal(${order.id})">#${order.id}</span>
                ${hasPromo ? `<span class="promo-badge">🎟 ${escapeHtml(order.promo_code)}</span>` : ''}
            </td>
            <td><span class="table-clickable" onclick="openOrderModal(${order.id})">${escapeHtml(order.customer_name)}</span></td>
            <td>${escapeHtml(order.customer_contact)}</td>
            <td class="table-date">${deliveryDate}</td>
            <td>
                <div class="table-items-list" id="items-list-${order.id}">
                    ${visibleItems.map(item => `
                        <div class="table-item">
                            <strong>${escapeHtml(item.name)}</strong><br>
                            Qty: ${item.quantity} × ${item.price} RSD
                        </div>
                    `).join('')}
                    ${hiddenItems.map(item => `
                        <div class="table-item table-item-hidden" data-order-id="${order.id}">
                            <strong>${escapeHtml(item.name)}</strong><br>
                            Qty: ${item.quantity} × ${item.price} RSD
                        </div>
                    `).join('')}
                    ${hasMoreItems ? `
                        <button class="table-expand-btn" onclick="toggleOrderItems(${order.id})">
                            Show all ${order.order_items.length} items
                        </button>
                    ` : ''}
                </div>
            </td>
            <td class="table-total">
                ${hasPromo ? `
                    <div class="price-breakdown">
                        <div style="text-decoration: line-through; color: #999; font-size: 12px;">
                            ${order.original_price} RSD
                        </div>
                        <div class="discount" style="font-size: 11px;">
                            -${order.discount_amount} RSD (5%)
                        </div>
                    </div>
                ` : ''}
                <strong>${order.total_price} RSD</strong>
            </td>
            <td class="table-status">
                <input
                    type="checkbox"
                    class="table-checkbox"
                    ${order.confirmed_after_creation ? 'checked' : ''}
                    onchange="updateOrderConfirmationFromTable(${order.id}, 'confirmed_after_creation', this.checked)"
                >
            </td>
            <td class="table-status">
                <input
                    type="checkbox"
                    class="table-checkbox"
                    ${order.confirmed_before_delivery ? 'checked' : ''}
                    onchange="updateOrderConfirmationFromTable(${order.id}, 'confirmed_before_delivery', this.checked)"
                >
            </td>
        </tr>
        `;
    }).join('');
}

// Toggle Order Items Visibility
function toggleOrderItems(orderId) {
    // Select by data-order-id attribute, not by class (since class changes on toggle)
    const collapsibleItems = document.querySelectorAll(`[data-order-id="${orderId}"]`);
    const button = document.querySelector(`#items-list-${orderId} .table-expand-btn`);
    const order = currentOrders.find(o => o.id === orderId);

    if (!order || collapsibleItems.length === 0) return;

    // Check if items are currently hidden (have the class)
    const isCurrentlyHidden = collapsibleItems[0].classList.contains('table-item-hidden');

    collapsibleItems.forEach(item => {
        if (isCurrentlyHidden) {
            // Show items
            item.classList.remove('table-item-hidden');
        } else {
            // Hide items
            item.classList.add('table-item-hidden');
        }
    });

    if (button) {
        if (isCurrentlyHidden) {
            // We just showed items, so button should say "Show less"
            button.textContent = 'Show less';
        } else {
            // We just hid items, so button should say "Show all"
            button.textContent = `Show all ${order.order_items.length} items`;
        }
    }
}

// Update Order Confirmation from Table
async function updateOrderConfirmationFromTable(orderId, field, value) {
    try {
        const updates = {};
        updates[field] = value;

        await adminAPI.updateOrderConfirmation(orderId, updates);

        // Update local state
        const order = currentOrders.find(o => o.id === orderId);
        if (order) {
            order[field] = value ? 1 : 0;
        }
    } catch (error) {
        alert(`Error updating order: ${error.message}`);
        // Reload orders to reset checkboxes
        loadOrdersTable();
    }
}

// Delete Order from Table
async function deleteOrderFromTable(orderId) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        return;
    }

    try {
        await adminAPI.deleteOrder(orderId);
        currentOrders = currentOrders.filter(o => o.id !== orderId);
        renderOrdersTable();
    } catch (error) {
        alert(`Error deleting order: ${error.message}`);
    }
}

// Load Menu Items
async function loadMenuItems() {
    menuLoading.style.display = 'block';
    menuError.textContent = '';
    menuContainer.innerHTML = '';

    try {
        const response = await adminAPI.getMenuList();
        console.log('Menu API response:', response);

        // Try different possible response formats
        if (Array.isArray(response)) {
            currentMenuItems = response;
        } else if (response.data) {
            // Handle {success: true, data: {...}} format
            const data = response.data;
            if (Array.isArray(data)) {
                currentMenuItems = data;
            } else if (data.menu && Array.isArray(data.menu)) {
                currentMenuItems = data.menu;
            } else if (data.items && Array.isArray(data.items)) {
                currentMenuItems = data.items;
            } else {
                // data might be an object with category keys
                console.log('Data object structure:', Object.keys(data));
                // Try to extract all items from all categories
                currentMenuItems = [];
                for (const key in data) {
                    if (Array.isArray(data[key])) {
                        currentMenuItems = currentMenuItems.concat(data[key]);
                    }
                }
            }
        } else if (response.menu && Array.isArray(response.menu)) {
            currentMenuItems = response.menu;
        } else if (response.items && Array.isArray(response.items)) {
            currentMenuItems = response.items;
        } else {
            console.error('Unexpected menu data format:', response);
            currentMenuItems = [];
        }

        console.log('Menu items loaded:', currentMenuItems.length);
        console.log('Sample item:', currentMenuItems[0]);
        menuLoading.style.display = 'none';
        renderMenuItems();
    } catch (error) {
        menuLoading.style.display = 'none';
        menuError.textContent = `Error loading menu items: ${error.message}`;
        console.error('Error loading menu items:', error);
    }
}

// Render Menu Items
function renderMenuItems() {
    if (currentMenuItems.length === 0) {
        menuContainer.innerHTML = `
            <div class="empty-state">
                <h3>No menu items</h3>
                <p>Add your first menu item using the button above.</p>
            </div>
        `;
        return;
    }

    // Filter items by selected category
    const filteredItems = selectedCategory === 'all'
        ? currentMenuItems
        : currentMenuItems.filter(item => item.category === selectedCategory);

    if (filteredItems.length === 0) {
        menuContainer.innerHTML = `
            <div class="empty-state">
                <h3>No items in this category</h3>
                <p>Try selecting a different category.</p>
            </div>
        `;
        return;
    }

    // Group items by category
    const groupedItems = {};
    filteredItems.forEach(item => {
        if (!groupedItems[item.category]) {
            groupedItems[item.category] = [];
        }
        groupedItems[item.category].push(item);
    });

    // Render items grouped by category
    menuContainer.innerHTML = Object.keys(groupedItems).map(category => `
        <div class="menu-category-section">
            <h3 class="menu-category-title">
                ${escapeHtml(category)}
                <span class="menu-category-count">(${groupedItems[category].length} items)</span>
            </h3>
            <div class="menu-category-items">
                ${groupedItems[category].map(item => `
                    <div class="menu-item-card">
                        <div class="menu-item-header">
                            <div class="menu-item-name">${escapeHtml(item.name)}</div>
                            <div class="menu-item-price">${item.price} RSD</div>
                        </div>
                        ${item.description ? `
                            <div class="menu-item-description">${escapeHtml(item.description)}</div>
                        ` : ''}
                        ${item.image ? `
                            <div class="menu-item-image">Image: ${escapeHtml(item.image)}</div>
                        ` : ''}
                        <div class="menu-item-actions">
                            <button class="btn-edit" onclick="showEditMenuForm(${item.id})">Edit</button>
                            <button class="btn-danger" onclick="deleteMenuItem(${item.id})">Delete</button>
                        </div>
                        <div class="menu-item-id">ID: ${item.id}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Handle Add Menu Item
async function handleAddMenuItem(e) {
    e.preventDefault();

    const itemData = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value || undefined,
        price: parseInt(document.getElementById('itemPrice').value),
        image: document.getElementById('itemImage').value || undefined
    };

    try {
        const data = await adminAPI.addMenuItem(itemData);
        alert(`Menu item created successfully! ID: ${data.menu_item_id}`);

        // Reset form and hide it
        menuItemForm.reset();
        addMenuForm.style.display = 'none';

        // Reload menu items
        loadMenuItems();
    } catch (error) {
        alert(`Error adding menu item: ${error.message}`);
    }
}

// Show Edit Menu Form
function showEditMenuForm(itemId) {
    const item = currentMenuItems.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemCategory').value = item.category;
    document.getElementById('editItemDescription').value = item.description || '';
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemImage').value = item.image || '';

    editMenuModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Edit Menu Modal
function closeEditMenuModal() {
    editMenuModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    menuEditForm.reset();
}

// Handle Edit Menu Item
async function handleEditMenuItem(e) {
    e.preventDefault();

    const itemId = parseInt(document.getElementById('editItemId').value);
    const updates = {
        name: document.getElementById('editItemName').value,
        category: document.getElementById('editItemCategory').value,
        description: document.getElementById('editItemDescription').value || undefined,
        price: parseInt(document.getElementById('editItemPrice').value),
        image: document.getElementById('editItemImage').value || undefined
    };

    try {
        await adminAPI.updateMenuItem(itemId, updates);
        alert('Menu item updated successfully!');

        // Close modal and reload menu items
        closeEditMenuModal();
        loadMenuItems();
    } catch (error) {
        alert(`Error updating menu item: ${error.message}`);
    }
}

// Delete Menu Item
async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
        return;
    }

    try {
        await adminAPI.deleteMenuItem(itemId);
        currentMenuItems = currentMenuItems.filter(i => i.id !== itemId);
        renderMenuItems();
    } catch (error) {
        alert(`Error deleting menu item: ${error.message}`);
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open Order Details Modal
function openOrderModal(orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    const modalBody = document.getElementById('orderDetailsBody');

    // Check if order has promo code
    const hasPromo = order.promo_code && order.discount_amount > 0;

    // Render order details using the same format as card view
    modalBody.innerHTML = `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">
                    Order #${order.id}
                    ${hasPromo ? `<span class="promo-badge">🎟 ${escapeHtml(order.promo_code)}</span>` : ''}
                </div>
                <div class="order-total">${order.total_price} RSD</div>
            </div>

            <div class="order-details">
                <div class="detail-item">
                    <div class="detail-label">Customer Name</div>
                    <div class="detail-value">${escapeHtml(order.customer_name)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contact</div>
                    <div class="detail-value">${escapeHtml(order.customer_contact)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Delivery Address</div>
                    <div class="detail-value">${escapeHtml(order.delivery_address)}</div>
                </div>
                ${order.delivery_date ? `
                <div class="detail-item">
                    <div class="detail-label">Delivery Date</div>
                    <div class="detail-value">${new Date(order.delivery_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}</div>
                </div>
                ` : ''}
                ${order.comments ? `
                <div class="detail-item">
                    <div class="detail-label">Comments</div>
                    <div class="detail-value">${escapeHtml(order.comments)}</div>
                </div>
                ` : ''}
            </div>

            <div class="order-items">
                <h4>Order Items (${order.order_items.length})</h4>
                <div class="order-items-list">
                    ${order.order_items.map(item => `
                        <div class="order-item">
                            <div>
                                <span class="item-name">${escapeHtml(item.name)}</span>
                                <span class="item-quantity">x${item.quantity}</span>
                            </div>
                            <div class="item-price">${item.price * item.quantity} RSD</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${hasPromo ? `
            <div class="order-pricing">
                <div class="detail-item">
                    <div class="detail-label">Original Price</div>
                    <div class="detail-value">${order.original_price} RSD</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Discount (5%)</div>
                    <div class="detail-value discount">-${order.discount_amount} RSD</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label"><strong>Final Total</strong></div>
                    <div class="detail-value"><strong>${order.total_price} RSD</strong></div>
                </div>
            </div>
            ` : ''}

            <div class="order-confirmations">
                <div class="confirmation-item">
                    <input
                        type="checkbox"
                        id="modal-confirm-creation-${order.id}"
                        ${order.confirmed_after_creation ? 'checked' : ''}
                        onchange="updateOrderConfirmationFromModal(${order.id}, 'confirmed_after_creation', this.checked)"
                    >
                    <label for="modal-confirm-creation-${order.id}">Confirmed after creation</label>
                </div>
                <div class="confirmation-item">
                    <input
                        type="checkbox"
                        id="modal-confirm-delivery-${order.id}"
                        ${order.confirmed_before_delivery ? 'checked' : ''}
                        onchange="updateOrderConfirmationFromModal(${order.id}, 'confirmed_before_delivery', this.checked)"
                    >
                    <label for="modal-confirm-delivery-${order.id}">Confirmed before delivery</label>
                </div>
            </div>

            <div class="order-actions">
                <button class="btn-danger" onclick="deleteOrderFromModal(${order.id})">Delete Order</button>
            </div>

            <div class="order-meta">
                Created: ${new Date(order.created_at).toLocaleString()} |
                Updated: ${new Date(order.updated_at).toLocaleString()}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Order Details Modal
function closeOrderModal() {
    const modal = document.getElementById('orderDetailsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update Order Confirmation from Modal
async function updateOrderConfirmationFromModal(orderId, field, value) {
    try {
        const updates = {};
        updates[field] = value;

        await adminAPI.updateOrderConfirmation(orderId, updates);

        // Update local state
        const order = currentOrders.find(o => o.id === orderId);
        if (order) {
            order[field] = value ? 1 : 0;
        }

        // Re-render table view
        renderOrdersTable();
    } catch (error) {
        alert(`Error updating order: ${error.message}`);
        // Reload orders to reset checkboxes
        loadOrdersTable();
    }
}

// Delete Order from Modal
async function deleteOrderFromModal(orderId) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        return;
    }

    try {
        await adminAPI.deleteOrder(orderId);
        currentOrders = currentOrders.filter(o => o.id !== orderId);

        // Close modal and refresh table view
        closeOrderModal();
        renderOrdersTable();
    } catch (error) {
        alert(`Error deleting order: ${error.message}`);
    }
}

// Promo Code Management Functions

// Load Promo Codes
async function loadPromoCodes() {
    promoCodesLoading.style.display = 'block';
    promoCodesError.textContent = '';
    promoCodesContainer.innerHTML = '';

    try {
        const data = await adminAPI.getAllPromoCodes();
        currentPromoCodes = data.promo_codes || [];

        promoCodesLoading.style.display = 'none';
        renderPromoCodes();
    } catch (error) {
        promoCodesLoading.style.display = 'none';
        promoCodesError.textContent = `Error loading promo codes: ${error.message}`;
        console.error('Error loading promo codes:', error);
    }
}

// Render Promo Codes
function renderPromoCodes() {
    promoCodesCount.textContent = currentPromoCodes.length;

    if (currentPromoCodes.length === 0) {
        promoCodesContainer.innerHTML = `
            <div class="promo-empty-state">
                <h4>No promo codes yet</h4>
                <p>Create your first promo code using the form above</p>
            </div>
        `;
        return;
    }

    promoCodesContainer.innerHTML = currentPromoCodes.map(promo => `
        <div class="promo-code-card">
            <div class="promo-code-info">
                <div class="promo-code-value">${escapeHtml(promo.code)}</div>
                <div class="promo-code-date">Created: ${new Date(promo.created_at).toLocaleString()}</div>
            </div>
            <div class="promo-code-actions">
                <button class="btn-danger" onclick="deletePromoCodeHandler('${escapeHtml(promo.code)}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Validate Promo Code
function validatePromoCode(code) {
    if (!code || code.length < 3 || code.length > 20) {
        return 'Code must be 3-20 characters long';
    }
    if (!/^[A-Za-z0-9\u0400-\u04FF]+$/.test(code)) {
        return 'Code must be alphanumeric only (Latin A-Z, Cyrillic А-Я, 0-9)';
    }
    return null;
}

// Handle Create Promo Code
async function handleCreatePromoCode(e) {
    e.preventDefault();

    const code = promoCodeInput.value.trim().toUpperCase();
    promoCodeError.textContent = '';

    // Validate
    const validationError = validatePromoCode(code);
    if (validationError) {
        promoCodeError.textContent = validationError;
        return;
    }

    try {
        await adminAPI.createPromoCode(code);

        // Reset form
        promoCodeForm.reset();

        // Reload promo codes
        loadPromoCodes();

        alert(`Promo code "${code}" created successfully!`);
    } catch (error) {
        promoCodeError.textContent = error.message || 'Failed to create promo code';
        console.error('Error creating promo code:', error);
    }
}

// Delete Promo Code Handler
async function deletePromoCodeHandler(code) {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await adminAPI.deletePromoCode(code);

        // Remove from local state
        currentPromoCodes = currentPromoCodes.filter(p => p.code !== code);

        // Re-render
        renderPromoCodes();

        alert(`Promo code "${code}" deleted successfully!`);
    } catch (error) {
        alert(`Error deleting promo code: ${error.message}`);
        console.error('Error deleting promo code:', error);
    }
}

// ============================
// Banner Management Functions
// ============================

// Load Banners
async function loadBanners() {
    bannersLoading.style.display = 'block';
    bannersError.textContent = '';
    bannersContainer.innerHTML = '';

    try {
        const response = await adminAPI.getAllBanners();
        currentBanners = response.banners || [];

        if (currentBanners.length === 0) {
            bannersContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No banners yet. Click "Add New Banner" to create one.</p>';
            return;
        }

        // Sort by display_order
        currentBanners.sort((a, b) => a.display_order - b.display_order);

        bannersContainer.innerHTML = currentBanners.map(banner => `
            <div class="banner-item" data-banner-id="${banner.id}">
                <div class="banner-preview">
                    <img src="${escapeHtml(banner.image_url)}" alt="${escapeHtml(banner.name)}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage Error%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="banner-info">
                    <div class="banner-name">${escapeHtml(banner.name)}</div>
                    <div class="banner-meta">
                        <div class="banner-link">
                            <strong>Link:</strong>
                            <a href="${escapeHtml(banner.item_link)}" target="_blank" rel="noopener">${escapeHtml(banner.item_link)}</a>
                        </div>
                        <div class="banner-order">
                            <strong>Display Order:</strong> ${banner.display_order}
                        </div>
                        <div class="banner-date">
                            <strong>Created:</strong> ${new Date(banner.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div class="banner-actions">
                    <button class="btn-primary" onclick="editBanner(${banner.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteBanner(${banner.id})">Delete</button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        bannersError.textContent = `Error loading banners: ${error.message}`;
        console.error('Error loading banners:', error);
    } finally {
        bannersLoading.style.display = 'none';
    }
}

// Open Create Banner Modal
function openCreateBannerModal() {
    editBannerId.value = '';
    bannerModalTitle.textContent = 'Add New Banner';
    bannerForm.reset();
    bannerDisplayOrder.value = currentBanners.length + 1;
    clearBannerErrors();
    bannerImagePreviewGroup.style.display = 'none';
    bannerModal.style.display = 'flex';
}

// Edit Banner
async function editBanner(bannerId) {
    const banner = currentBanners.find(b => b.id === bannerId);

    if (!banner) {
        alert('Banner not found');
        return;
    }

    editBannerId.value = banner.id;
    bannerModalTitle.textContent = 'Edit Banner';
    bannerName.value = banner.name;
    bannerItemLink.value = banner.item_link;
    bannerImageUrl.value = banner.image_url;
    bannerDisplayOrder.value = banner.display_order;

    // Show preview
    bannerImagePreview.src = banner.image_url;
    bannerImagePreviewGroup.style.display = 'block';

    clearBannerErrors();
    bannerModal.style.display = 'flex';
}

// Close Banner Modal
function closeBannerModal() {
    bannerModal.style.display = 'none';
    bannerForm.reset();
    editBannerId.value = '';
    clearBannerErrors();
    bannerImagePreviewGroup.style.display = 'none';
}

// Clear Banner Form Errors
function clearBannerErrors() {
    document.getElementById('bannerNameError').textContent = '';
    document.getElementById('bannerItemLinkError').textContent = '';
    document.getElementById('bannerImageUrlError').textContent = '';
    document.getElementById('bannerDisplayOrderError').textContent = '';
}

// Display Banner Validation Errors
function displayBannerErrors(details) {
    clearBannerErrors();
    if (details.name) {
        document.getElementById('bannerNameError').textContent = details.name;
    }
    if (details.item_link) {
        document.getElementById('bannerItemLinkError').textContent = details.item_link;
    }
    if (details.image_url) {
        document.getElementById('bannerImageUrlError').textContent = details.image_url;
    }
    if (details.display_order) {
        document.getElementById('bannerDisplayOrderError').textContent = details.display_order;
    }
}

// Handle Banner Form Submit
async function handleBannerFormSubmit(e) {
    e.preventDefault();
    clearBannerErrors();

    const bannerData = {
        name: bannerName.value.trim(),
        item_link: bannerItemLink.value.trim(),
        image_url: bannerImageUrl.value.trim(),
        display_order: parseInt(bannerDisplayOrder.value)
    };

    try {
        const bannerId = editBannerId.value;

        if (bannerId) {
            // Update existing banner
            await adminAPI.updateBanner(parseInt(bannerId), bannerData);
            alert('Banner updated successfully!');
        } else {
            // Create new banner
            await adminAPI.createBanner(bannerData);
            alert('Banner created successfully!');
        }

        closeBannerModal();
        loadBanners();

    } catch (error) {
        console.error('Error saving banner:', error);

        // Try to parse error details
        if (error.message.includes('Invalid banner data')) {
            displayBannerErrors({
                name: 'Please check all fields for valid data',
                item_link: 'URL must start with http:// or https://',
                image_url: 'URL must start with http:// or https://',
                display_order: 'Must be a non-negative integer (0, 1, 2, ...)'
            });
        } else {
            alert(`Error saving banner: ${error.message}`);
        }
    }
}

// Delete Banner
async function deleteBanner(bannerId) {
    const banner = currentBanners.find(b => b.id === bannerId);

    if (!banner) {
        alert('Banner not found');
        return;
    }

    if (!confirm(`Are you sure you want to delete the banner "${banner.name}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await adminAPI.deleteBanner(bannerId);
        alert('Banner deleted successfully!');
        loadBanners();
    } catch (error) {
        alert(`Error deleting banner: ${error.message}`);
        console.error('Error deleting banner:', error);
    }
}

// Preview Banner Image
function previewBannerImage() {
    const imageUrl = bannerImageUrl.value.trim();

    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
        bannerImagePreview.src = imageUrl;
        bannerImagePreviewGroup.style.display = 'block';
    } else {
        bannerImagePreviewGroup.style.display = 'none';
    }
}

// Make functions globally accessible
window.updateOrderConfirmation = updateOrderConfirmation;
window.deleteOrder = deleteOrder;
window.updateOrderConfirmationFromTable = updateOrderConfirmationFromTable;
window.deleteOrderFromTable = deleteOrderFromTable;
window.toggleOrderItems = toggleOrderItems;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.updateOrderConfirmationFromModal = updateOrderConfirmationFromModal;
window.deleteOrderFromModal = deleteOrderFromModal;
window.showEditMenuForm = showEditMenuForm;
window.closeEditMenuModal = closeEditMenuModal;
window.deleteMenuItem = deleteMenuItem;
window.deletePromoCodeHandler = deletePromoCodeHandler;
window.editBanner = editBanner;
window.deleteBanner = deleteBanner;
window.closeBannerModal = closeBannerModal;
