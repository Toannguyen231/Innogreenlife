const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/users/login`,
  register: `${API_BASE_URL}/users/register`,
  me: `${API_BASE_URL}/users/me`,
  products: `${API_BASE_URL}/products`,
  productById: (id) => `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
  contact: `${API_BASE_URL}/contact`,
  orders: `${API_BASE_URL}/orders`,
  ordersMe: `${API_BASE_URL}/orders/me`,
  chat: `${API_BASE_URL}/chat`,
  // Admin endpoints
  adminProducts: `${API_BASE_URL}/admin/products`,
  adminOrders: `${API_BASE_URL}/admin/orders`,
  adminUsers: `${API_BASE_URL}/admin/users`,
  adminContacts: `${API_BASE_URL}/admin/contact`, adminAuditLogs: `${API_BASE_URL}/admin/audit-logs`,
  // Bulk actions
  adminBulkUpdateOrders: `${API_BASE_URL}/admin/orders/bulk/status`,
  adminBulkDeleteProducts: `${API_BASE_URL}/admin/products/bulk`,
  adminBulkUpdateUsers: `${API_BASE_URL}/admin/users/bulk/role`,
  // Export
  adminExportProducts: `${API_BASE_URL}/admin/products/export`,
  adminExportOrders: `${API_BASE_URL}/admin/orders/export`,
  adminExportUsers: `${API_BASE_URL}/admin/users/export`,
}

export default API_BASE_URL
