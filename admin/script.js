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
}

// Application State
let adminAPI = null;
let currentOrders = [];
let currentMenuItems = [];

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const ordersTab = document.getElementById('ordersTab');
const ordersTableTab = document.getElementById('ordersTableTab');
const menuTab = document.getElementById('menuTab');

// Orders Elements
const refreshOrdersBtn = document.getElementById('refreshOrders');
const ordersLoading = document.getElementById('ordersLoading');
const ordersError = document.getElementById('ordersError');
const ordersContainer = document.getElementById('ordersContainer');

// Orders Table Elements
const refreshOrdersTableBtn = document.getElementById('refreshOrdersTable');
const ordersTableLoading = document.getElementById('ordersTableLoading');
const ordersTableError = document.getElementById('ordersTableError');
const ordersTableBody = document.getElementById('ordersTableBody');

// Menu Elements
const showAddMenuFormBtn = document.getElementById('showAddMenuForm');
const addMenuForm = document.getElementById('addMenuForm');
const menuItemForm = document.getElementById('menuItemForm');
const cancelAddMenuBtn = document.getElementById('cancelAddMenu');
const editMenuForm = document.getElementById('editMenuForm');
const menuEditForm = document.getElementById('menuEditForm');
const cancelEditMenuBtn = document.getElementById('cancelEditMenu');
const menuLoading = document.getElementById('menuLoading');
const menuError = document.getElementById('menuError');
const menuContainer = document.getElementById('menuContainer');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
        adminAPI = new FoodikalAdminAPI(savedPassword);
        showDashboard();
        loadOrders();
    }

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    refreshOrdersBtn.addEventListener('click', loadOrders);
    refreshOrdersTableBtn.addEventListener('click', loadOrdersTable);
    showAddMenuFormBtn.addEventListener('click', () => {
        addMenuForm.style.display = 'block';
        editMenuForm.style.display = 'none';
    });

    cancelAddMenuBtn.addEventListener('click', () => {
        addMenuForm.style.display = 'none';
        menuItemForm.reset();
    });

    cancelEditMenuBtn.addEventListener('click', () => {
        editMenuForm.style.display = 'none';
        menuEditForm.reset();
    });

    menuItemForm.addEventListener('submit', handleAddMenuItem);
    menuEditForm.addEventListener('submit', handleEditMenuItem);
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
        loadOrders();
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
    ordersTab.classList.remove('active');
    ordersTableTab.classList.remove('active');
    menuTab.classList.remove('active');

    if (tabName === 'orders') {
        ordersTab.classList.add('active');
    } else if (tabName === 'ordersTable') {
        ordersTableTab.classList.add('active');
        loadOrdersTable();
    } else if (tabName === 'menu') {
        menuTab.classList.add('active');
        loadMenuItems();
    }
}

// Load Orders
async function loadOrders() {
    ordersLoading.style.display = 'block';
    ordersError.textContent = '';
    ordersContainer.innerHTML = '';

    try {
        const data = await adminAPI.getAllOrders();
        currentOrders = data.orders;

        ordersLoading.style.display = 'none';
        renderOrders();
    } catch (error) {
        ordersLoading.style.display = 'none';
        ordersError.textContent = `Error loading orders: ${error.message}`;
        console.error('Error loading orders:', error);
    }
}

// Render Orders
function renderOrders() {
    if (currentOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <h3>No orders yet</h3>
                <p>Orders will appear here once customers start placing them.</p>
            </div>
        `;
        return;
    }

    ordersContainer.innerHTML = currentOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
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
                ${order.customer_email ? `
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${escapeHtml(order.customer_email)}</div>
                </div>
                ` : ''}
                <div class="detail-item">
                    <div class="detail-label">Delivery Address</div>
                    <div class="detail-value">${escapeHtml(order.delivery_address)}</div>
                </div>
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

            <div class="order-confirmations">
                <div class="confirmation-item">
                    <input
                        type="checkbox"
                        id="confirm-creation-${order.id}"
                        ${order.confirmed_after_creation ? 'checked' : ''}
                        onchange="updateOrderConfirmation(${order.id}, 'confirmed_after_creation', this.checked)"
                    >
                    <label for="confirm-creation-${order.id}">Confirmed after creation</label>
                </div>
                <div class="confirmation-item">
                    <input
                        type="checkbox"
                        id="confirm-delivery-${order.id}"
                        ${order.confirmed_before_delivery ? 'checked' : ''}
                        onchange="updateOrderConfirmation(${order.id}, 'confirmed_before_delivery', this.checked)"
                    >
                    <label for="confirm-delivery-${order.id}">Confirmed before delivery</label>
                </div>
            </div>

            <div class="order-actions">
                <button class="btn-danger" onclick="deleteOrder(${order.id})">Delete Order</button>
            </div>

            <div class="order-meta">
                Created: ${new Date(order.created_at).toLocaleString()} |
                Updated: ${new Date(order.updated_at).toLocaleString()}
            </div>
        </div>
    `).join('');
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
        loadOrders();
    }
}

// Delete Order
async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        return;
    }

    try {
        await adminAPI.deleteOrder(orderId);
        currentOrders = currentOrders.filter(o => o.id !== orderId);
        renderOrders();
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

// Render Orders Table
function renderOrdersTable() {
    if (currentOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 60px 20px; color: #666;">
                    <h3 style="margin-bottom: 10px; color: #999;">No orders yet</h3>
                    <p style="color: #aaa;">Orders will appear here once customers start placing them.</p>
                </td>
            </tr>
        `;
        return;
    }

    ordersTableBody.innerHTML = currentOrders.map(order => {
        const visibleItems = order.order_items.slice(0, 2);
        const hiddenItems = order.order_items.slice(2);
        const hasMoreItems = order.order_items.length > 2;

        return `
        <tr>
            <td class="table-order-id">#${order.id}</td>
            <td>${escapeHtml(order.customer_name)}</td>
            <td>${escapeHtml(order.customer_contact)}</td>
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
            <td class="table-total">${order.total_price} RSD</td>
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
        const data = await adminAPI.getMenuList();
        console.log('Menu API response:', data);

        // Try different possible response formats
        if (Array.isArray(data)) {
            currentMenuItems = data;
        } else if (data.menu && Array.isArray(data.menu)) {
            currentMenuItems = data.menu;
        } else if (data.items && Array.isArray(data.items)) {
            currentMenuItems = data.items;
        } else {
            console.error('Unexpected menu data format:', data);
            currentMenuItems = [];
        }

        console.log('Menu items loaded:', currentMenuItems.length);
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

    menuContainer.innerHTML = currentMenuItems.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-category">${escapeHtml(item.category)}</div>
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

    editMenuForm.style.display = 'block';
    addMenuForm.style.display = 'none';

    // Scroll to form
    editMenuForm.scrollIntoView({ behavior: 'smooth' });
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

        // Reset form and hide it
        menuEditForm.reset();
        editMenuForm.style.display = 'none';

        // Reload menu items
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

// Make functions globally accessible
window.updateOrderConfirmation = updateOrderConfirmation;
window.deleteOrder = deleteOrder;
window.updateOrderConfirmationFromTable = updateOrderConfirmationFromTable;
window.deleteOrderFromTable = deleteOrderFromTable;
window.toggleOrderItems = toggleOrderItems;
window.showEditMenuForm = showEditMenuForm;
window.deleteMenuItem = deleteMenuItem;
