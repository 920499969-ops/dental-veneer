const API_BASE = '/api';

export async function submitBooking(data) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || '预约失败');
  return json;
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || '登录失败');
  return json;
}

export async function getAdminMe() {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function getStats() {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getBookings(params = {}) {
  const token = localStorage.getItem('admin_token');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/bookings?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function getBooking(id) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
}

export async function updateBooking(id, data) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return res.json();
}

export async function deleteBooking(id) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete booking');
  return res.json();
}
