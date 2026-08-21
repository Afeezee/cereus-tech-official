// Client-side API helpers. All calls hit our own /api/* Vercel functions.
// `authedFetch` attaches a Clerk session token so admin routes can authorize.

const BASE = '/api';

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();
  if (!res.ok) {
    const message = (data && data.error) || res.statusText || 'Request failed';
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// ─── public reads ────────────────────────────────────────────────
export const api = {
  products: {
    list: (params = {}) =>
      request(`/products${qs(params)}`),
    get: (slugOrId) => request(`/products/${encodeURIComponent(slugOrId)}`),
  },
  insights: {
    list: (params = {}) => request(`/insights${qs(params)}`),
    get: (slugOrId) => request(`/insights/${encodeURIComponent(slugOrId)}`),
  },
  testimonials: {
    list: (params = {}) => request(`/testimonials${qs(params)}`),
  },
  careers: {
    list: (params = {}) => request(`/careers${qs(params)}`),
  },
  siteContent: {
    get: () => request(`/site-content`),
  },
  // ─── public writes (form submissions) ─────
  // All five forms POST to the same endpoint with a `kind` query param;
  // the server consolidated to a single handler to stay under Vercel Hobby's
  // 12-function limit.
  submissions: {
    contact:    (payload) => request(`/submissions?kind=contact`,    { method: 'POST', body: payload }),
    newsletter: (payload) => request(`/submissions?kind=newsletter`, { method: 'POST', body: payload }),
    career:     (payload) => request(`/submissions?kind=career`,     { method: 'POST', body: payload }),
    student:    (payload) => request(`/submissions?kind=student`,    { method: 'POST', body: payload }),
    instructor: (payload) => request(`/submissions?kind=instructor`, { method: 'POST', body: payload }),
  },
};

// ─── admin writes (require a Clerk token) ────────────────────────
export const admin = {
  products: {
    create: (payload, token) => request(`/products`, { method: 'POST', body: payload, token }),
    update: (id, payload, token) =>
      request(`/products/${id}`, { method: 'PATCH', body: payload, token }),
    remove: (id, token) => request(`/products/${id}`, { method: 'DELETE', token }),
  },
  insights: {
    create: (payload, token) => request(`/insights`, { method: 'POST', body: payload, token }),
    update: (id, payload, token) =>
      request(`/insights/${id}`, { method: 'PATCH', body: payload, token }),
    remove: (id, token) => request(`/insights/${id}`, { method: 'DELETE', token }),
  },
  testimonials: {
    listAll: (token) => request(`/testimonials?includeUnapproved=1`, { token }),
    create: (payload, token) =>
      request(`/testimonials`, { method: 'POST', body: payload, token }),
    update: (id, payload, token) =>
      request(`/testimonials/${id}`, { method: 'PATCH', body: payload, token }),
    remove: (id, token) => request(`/testimonials/${id}`, { method: 'DELETE', token }),
  },
  careers: {
    listAll: (token) => request(`/careers?includeInactive=1`, { token }),
    create: (payload, token) =>
      request(`/careers`, { method: 'POST', body: payload, token }),
    update: (id, payload, token) =>
      request(`/careers/${id}`, { method: 'PATCH', body: payload, token }),
    remove: (id, token) => request(`/careers/${id}`, { method: 'DELETE', token }),
  },
  siteContent: {
    update: (payload, token) =>
      request(`/site-content`, { method: 'PUT', body: payload, token }),
  },
  submissions: {
    list: (kind, token) => request(`/submissions?kind=${encodeURIComponent(kind)}`, { token }),
    remove: (kind, id, token) =>
      request(`/submissions?kind=${encodeURIComponent(kind)}&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        token,
      }),
  },
};

function qs(params) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  const search = new URLSearchParams(entries);
  return `?${search.toString()}`;
}
