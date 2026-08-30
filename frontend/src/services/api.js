const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { message: `Server returned an invalid response (${response.status})` };
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },

  async getProductById(id) {
    return request(`/products/${id}`);
  },

  // Auth
  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getProfile(token) {
    return request('/auth/profile', {
      token,
    });
  },

  // Orders (Customer)
  async createOrder(orderData, token) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      token,
    });
  },

  async getMyOrders(token) {
    return request('/orders/my-orders', {
      token,
    });
  },

  async updateOrderToPaid(orderId, paymentResult, token) {
    return request(`/orders/${orderId}/pay`, {
      method: 'PUT',
      body: JSON.stringify(paymentResult),
      token,
    });
  },

  // Orders (Admin)
  async getAllOrders(token) {
    return request('/orders', {
      token,
    });
  },

  async updateOrderStatus(orderId, statusData, token) {
    return request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
      token,
    });
  },

  // Razorpay
  async createRazorpayOrder(amount) {
    return request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  async verifyRazorpayPayment(paymentDetails) {
    return request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
    });
  },
};
