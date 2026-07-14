const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api';

export async function fetchUsers() {
  return request('/users');
}

export async function login(userId) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

export async function fetchOrders(userId) {
  const orders = await request('/orders', {
    headers: userHeader(userId)
  });
  return orders.map(normalizeOrder);
}

export async function createOrder(userId, targetStatus, form) {
  const order = await request(`/orders?targetStatus=${targetStatus}`, {
    method: 'POST',
    headers: userHeader(userId),
    body: JSON.stringify(toOrderRequest(form))
  });
  return normalizeOrder(order);
}

export async function updateOrder(orderNumericId, userId, targetStatus, form) {
  const order = await request(`/orders/${orderNumericId}?targetStatus=${targetStatus}`, {
    method: 'PUT',
    headers: userHeader(userId),
    body: JSON.stringify(toOrderRequest(form))
  });
  return normalizeOrder(order);
}

export async function completeOrder(orderNumericId, userId, transactionReference, note) {
  return submitDecision(orderNumericId, userId, 'complete', { transactionReference, note });
}

export async function rejectOrder(orderNumericId, userId, note) {
  return submitDecision(orderNumericId, userId, 'reject', { note });
}

export async function sendBackOrder(orderNumericId, userId, note) {
  return submitDecision(orderNumericId, userId, 'send-back', { note });
}

async function submitDecision(orderNumericId, userId, action, payload) {
  const order = await request(`/orders/${orderNumericId}/${action}`, {
    method: 'POST',
    headers: userHeader(userId),
    body: JSON.stringify(payload)
  });
  return normalizeOrder(order);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.messages?.join(' ') ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

function userHeader(userId) {
  return { 'X-User-Id': userId };
}

function toOrderRequest(form) {
  return {
    title: form.title,
    priority: form.priority.toUpperCase(),
    expiryDate: form.expiryDate,
    notes: form.notes,
    items: form.items.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity)
    }))
  };
}

function normalizeOrder(order) {
  return {
    ...order,
    priority: toTitleCase(order.priority),
    creatorId: order.creatorId ?? order.creator?.id,
    items: order.items ?? [],
    notes: order.notes ?? '',
    transactionReference: order.transactionReference ?? '',
    purchaserNote: order.purchaserNote ?? ''
  };
}

function toTitleCase(value) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
