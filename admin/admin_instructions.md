# Foodikal NY Backend - Admin Panel Integration Guide

## Base URL

**Production**: `https://foodikal-ny-backend.x-gs-x.workers.dev`

## Authentication

All admin endpoints require password authentication using the Bearer token scheme.

**Header Format**:
```
Authorization: Bearer YOUR_ADMIN_PASSWORD
```

**Important**: The password is sent as plain text in the Authorization header over HTTPS. Store it securely in your frontend application (e.g., in memory or secure storage).

---

## Admin Order Management Endpoints

### 1. List All Orders

Get a list of all orders, sorted by newest first.

**Endpoint**: `GET /api/admin/order_list`

**Authentication**: Required

**Request Example**:
```javascript
const adminPassword = 'your_admin_password'; // Store securely

fetch('https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/order_list', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "orders": [
    {
      "id": 3,
      "customer_name": "Мария Сидорова",
      "customer_contact": "+7111222333",
      "customer_email": "",
      "delivery_address": "Санкт-Петербург, Невский проспект, 1",
      "comments": "",
      "order_items": [
        {
          "item_id": 1,
          "name": "Брускетта с помидорами",
          "quantity": 1,
          "price": 1850
        },
        {
          "item_id": 4,
          "name": "Канапе с лососем",
          "quantity": 2,
          "price": 14725
        }
      ],
      "total_price": 31300,
      "confirmed_after_creation": 0,
      "confirmed_before_delivery": 0,
      "created_at": "2025-11-07 12:54:55",
      "updated_at": "2025-11-07 12:54:55"
    },
    {
      "id": 2,
      "customer_name": "Петр Петров",
      "customer_contact": "+7987654321",
      "customer_email": "petr@test.com",
      "delivery_address": "Москва, ул. Пушкина, 10",
      "comments": "Позвонить за 30 минут",
      "order_items": [
        {
          "item_id": 2,
          "name": "Мини-пицца",
          "quantity": 3,
          "price": 280
        }
      ],
      "total_price": 840,
      "confirmed_after_creation": 0,
      "confirmed_before_delivery": 0,
      "created_at": "2025-11-07 12:53:55",
      "updated_at": "2025-11-07 12:53:55"
    }
  ]
}
```

**Order Fields Explained**:
- `id` - Unique order ID
- `customer_name` - Customer full name
- `customer_contact` - Phone number
- `customer_email` - Email (optional, can be empty string)
- `delivery_address` - Full delivery address
- `comments` - Order notes (optional, can be empty string)
- `order_items` - Array of ordered items with details
- `total_price` - Total order price in RSD (calculated server-side)
- `confirmed_after_creation` - Boolean (0/1): Order confirmed by manager
- `confirmed_before_delivery` - Boolean (0/1): Order confirmed before delivery
- `created_at` - Order creation timestamp
- `updated_at` - Last update timestamp

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 2. Update Order Confirmations

Update order confirmation flags (after creation or before delivery).

**Endpoint**: `PATCH /api/admin/orders/:id`

**Authentication**: Required

**URL Parameters**:
- `id` - Order ID (integer)

**Request Body**:
```json
{
  "confirmed_after_creation": true,
  "confirmed_before_delivery": false
}
```

**Note**: You can update one or both fields. Only include fields you want to update.

**Request Example**:
```javascript
const adminPassword = 'your_admin_password';
const orderId = 3;

const confirmationData = {
  confirmed_after_creation: true,
  confirmed_before_delivery: false
};

fetch(`https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/orders/${orderId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${adminPassword}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(confirmationData)
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Order updated successfully",
  "order": {
    "id": 3,
    "customer_name": "Мария Сидорова",
    "customer_contact": "+7111222333",
    "customer_email": "",
    "delivery_address": "Санкт-Петербург, Невский проспект, 1",
    "comments": "",
    "order_items": [...],
    "total_price": 31300,
    "confirmed_after_creation": 1,
    "confirmed_before_delivery": 0,
    "created_at": "2025-11-07 12:54:55",
    "updated_at": "2025-11-07 13:45:23"
  }
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

404 Not Found:
```json
{
  "success": false,
  "error": "Order not found"
}
```

400 Bad Request:
```json
{
  "success": false,
  "error": "No valid fields to update"
}
```

---

### 3. Delete Order

Delete an order from the database. Use with caution!

**Endpoint**: `DELETE /api/admin/orders/:id`

**Authentication**: Required

**URL Parameters**:
- `id` - Order ID (integer)

**Request Example**:
```javascript
const adminPassword = 'your_admin_password';
const orderId = 5;

fetch(`https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/orders/${orderId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

404 Not Found:
```json
{
  "success": false,
  "error": "Order not found"
}
```

---

## Admin Menu Management Endpoints

### 4. Add Menu Item

Create a new menu item.

**Endpoint**: `POST /api/admin/menu_add`

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Новая закуска",
  "category": "Закуски",
  "description": "Описание блюда",
  "price": 500,
  "image": "image.jpg"
}
```

**Field Requirements**:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | ✅ Yes | string | Item name (2-100 chars) |
| `category` | ✅ Yes | string | Category (Cyrillic) |
| `description` | ❌ No | string | Item description |
| `price` | ✅ Yes | integer | Price in RSD (positive) |
| `image` | ❌ No | string | Image filename/URL |

**Valid Categories**:
- Брускетты
- Горячее
- Закуски
- Канапе
- Салат
- Тарталетки

**Request Example**:
```javascript
const adminPassword = 'your_admin_password';

const menuItem = {
  name: "Тарталетка с икрой",
  category: "Тарталетки",
  description: "Хрустящая тарталетка с красной икрой",
  price: 850,
  image: "tartlet_caviar.jpg"
};

fetch('https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/menu_add', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminPassword}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(menuItem)
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response** (200 OK):
```json
{
  "success": true,
  "menu_item_id": 9,
  "message": "Menu item created successfully"
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

400 Bad Request (Validation Error):
```json
{
  "success": false,
  "error": "Invalid menu item data",
  "details": {
    "price": ["Must be a positive integer"]
  }
}
```

---

### 5. Update Menu Item

Update an existing menu item. You can update one or more fields.

**Endpoint**: `PUT /api/admin/menu_update/:id`

**Authentication**: Required

**URL Parameters**:
- `id` - Menu item ID (integer)

**Request Body** (partial update supported):
```json
{
  "name": "Обновленное название",
  "price": 600
}
```

**Note**: Only include fields you want to update. All fields are optional.

**Request Example**:
```javascript
const adminPassword = 'your_admin_password';
const itemId = 9;

const updates = {
  price: 900,
  description: "Новое описание"
};

fetch(`https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/menu_update/${itemId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminPassword}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updates)
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Menu item updated successfully"
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

404 Not Found:
```json
{
  "success": false,
  "error": "Menu item not found"
}
```

400 Bad Request:
```json
{
  "success": false,
  "error": "No valid fields to update"
}
```

---

### 6. Delete Menu Item

Delete a menu item from the database.

**Endpoint**: `DELETE /api/admin/menu_delete/:id`

**Authentication**: Required

**URL Parameters**:
- `id` - Menu item ID (integer)

**Request Example**:
```javascript
const adminPassword = 'your_admin_password';
const itemId = 9;

fetch(`https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/menu_delete/${itemId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

404 Not Found:
```json
{
  "success": false,
  "error": "Menu item not found"
}
```

---

## Complete Admin Panel Example

Here's a complete JavaScript class for managing admin operations:

```javascript
class FoodikalAdminAPI {
  constructor(password) {
    this.baseURL = 'https://foodikal-ny-backend.x-gs-x.workers.dev';
    this.password = password;
  }

  // Helper method to make authenticated requests
  async _request(endpoint, options = {}) {
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.password}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      ...defaultOptions
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
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
}

// Usage Example
const admin = new FoodikalAdminAPI('your_admin_password');

// Get all orders
admin.getAllOrders()
  .then(data => {
    console.log(`Total orders: ${data.count}`);
    data.orders.forEach(order => {
      console.log(`Order #${order.id}: ${order.customer_name} - ${order.total_price} RSD`);
    });
  })
  .catch(error => console.error('Error:', error));

// Confirm order after creation
admin.updateOrderConfirmation(3, {
  confirmed_after_creation: true
})
  .then(data => console.log('Order confirmed:', data))
  .catch(error => console.error('Error:', error));

// Add new menu item
admin.addMenuItem({
  name: "Канапе с сыром",
  category: "Канапе",
  description: "Канапе с мягким сыром",
  price: 450,
  image: "canape_cheese.jpg"
})
  .then(data => console.log('Menu item created:', data.menu_item_id))
  .catch(error => console.error('Error:', error));

// Update menu item price
admin.updateMenuItem(9, { price: 500 })
  .then(data => console.log('Price updated:', data))
  .catch(error => console.error('Error:', error));

// Delete order
admin.deleteOrder(5)
  .then(data => console.log('Order deleted:', data))
  .catch(error => console.error('Error:', error));
```

---

## React/Vue Example Component

### React Example:

```jsx
import React, { useState, useEffect } from 'react';

function AdminOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const adminPassword = 'your_admin_password'; // Better: use environment variable

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/order_list',
        {
          headers: {
            'Authorization': `Bearer ${adminPassword}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      const response = await fetch(
        `https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/orders/${orderId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${adminPassword}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            confirmed_after_creation: true
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh orders list
        fetchOrders();
        alert('Order confirmed!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to confirm order');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-orders-panel">
      <h2>Orders ({orders.length})</h2>

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h3>Order #{order.id}</h3>
          <p><strong>Customer:</strong> {order.customer_name}</p>
          <p><strong>Contact:</strong> {order.customer_contact}</p>
          <p><strong>Address:</strong> {order.delivery_address}</p>
          <p><strong>Total:</strong> {order.total_price} RSD</p>

          <div className="order-items">
            <strong>Items:</strong>
            <ul>
              {order.order_items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x{item.quantity} - {item.price * item.quantity} RSD
                </li>
              ))}
            </ul>
          </div>

          <div className="order-status">
            <label>
              <input
                type="checkbox"
                checked={order.confirmed_after_creation === 1}
                onChange={() => confirmOrder(order.id)}
              />
              Confirmed
            </label>
          </div>

          <p className="order-date">
            Created: {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AdminOrdersPanel;
```

---

## Security Best Practices

1. **Store Password Securely**:
   ```javascript
   // ❌ Don't hardcode in source code
   const password = 'mypassword123';

   // ✅ Use environment variables
   const password = process.env.REACT_APP_ADMIN_PASSWORD;
   ```

2. **Handle Authentication Errors**:
   ```javascript
   if (response.status === 401) {
     // Redirect to login page
     window.location.href = '/admin/login';
   }
   ```

3. **Implement Session Timeout**:
   ```javascript
   // Clear password after inactivity
   let sessionTimeout;
   const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

   function resetSessionTimeout() {
     clearTimeout(sessionTimeout);
     sessionTimeout = setTimeout(() => {
       // Clear stored password
       sessionStorage.removeItem('adminPassword');
       window.location.href = '/admin/login';
     }, SESSION_DURATION);
   }
   ```

4. **Use HTTPS Only**: The API is served over HTTPS. Never send passwords over HTTP.

5. **Don't Log Passwords**:
   ```javascript
   // ❌ Never do this
   console.log('Password:', password);

   // ✅ Log without sensitive data
   console.log('Making authenticated request...');
   ```

---

## Testing Admin Endpoints

Use browser DevTools or curl to test:

```bash
# Get all orders
curl -H "Authorization: Bearer your_password" \
  https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/order_list

# Update order confirmation
curl -X PATCH \
  -H "Authorization: Bearer your_password" \
  -H "Content-Type: application/json" \
  -d '{"confirmed_after_creation": true}' \
  https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/orders/3

# Add menu item
curl -X POST \
  -H "Authorization: Bearer your_password" \
  -H "Content-Type: application/json" \
  -d '{"name":"Новое блюдо","category":"Закуски","price":500}' \
  https://foodikal-ny-backend.x-gs-x.workers.dev/api/admin/menu_add
```

---

## Troubleshooting

**401 Unauthorized Error**:
- Check that password is correct
- Verify Authorization header format: `Bearer password`
- Ensure ADMIN_PASSWORD_HASH is set in Cloudflare

**404 Not Found**:
- Verify the order/menu item ID exists
- Check the endpoint URL is correct

**CORS Errors**:
- Admin endpoints use the same CORS configuration as public endpoints
- Ensure your frontend domain is `https://ny2026.foodikal.rs`
- For local development, you may need to proxy requests

**Empty Order List**:
- This is normal if no orders have been created
- Create a test order via the public endpoint first

---

## Support

For issues or questions:
1. Check Cloudflare Workers logs: `wrangler tail`
2. Test endpoints with curl first
3. Verify authentication credentials
4. Check browser console for detailed error messages
