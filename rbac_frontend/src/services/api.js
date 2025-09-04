const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

async function request(path, options = {}) {
  const token = localStorage.getItem('rbac_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 204) return null;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message || data?.detail || res.statusText;
    throw new Error(message);
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints */
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),

  /** Users */
  listUsers: () => request('/users'),
  createUser: (payload) => request('/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  assignRolesToUser: (userId, roleIds) =>
    request(`/users/${userId}/roles`, { method: 'PUT', body: JSON.stringify({ role_ids: roleIds }) }),

  /** Roles */
  listRoles: () => request('/roles'),
  createRole: (payload) => request('/roles', { method: 'POST', body: JSON.stringify(payload) }),
  updateRole: (id, payload) => request(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteRole: (id) => request(`/roles/${id}`, { method: 'DELETE' }),
  assignPermissionsToRole: (roleId, permissionIds) =>
    request(`/roles/${roleId}/permissions`, { method: 'PUT', body: JSON.stringify({ permission_ids: permissionIds }) }),

  /** Permissions */
  listPermissions: () => request('/permissions'),
  createPermission: (payload) => request('/permissions', { method: 'POST', body: JSON.stringify(payload) }),
  updatePermission: (id, payload) => request(`/permissions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePermission: (id) => request(`/permissions/${id}`, { method: 'DELETE' }),

  /** Dashboard summaries */
  stats: () => request('/stats'),
};
