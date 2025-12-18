// js/api.js
const API_BASE = "http://localhost:8080/api";

// helper to call backend
async function apiRequest(endpoint, method = "GET", body = null) {
  const url = `${API_BASE}${endpoint}`;
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);

  // check for no-content
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    // try parse error message
    if (contentType.includes("application/json")) {
      const errJson = await res.json().catch(() => null);
      throw new Error((errJson && errJson.message) || JSON.stringify(errJson) || res.statusText);
    } else {
      const txt = await res.text().catch(() => res.statusText);
      throw new Error(txt || res.statusText);
    }
  }

  if (contentType.includes("application/json")) {
    return res.json();
  } else {
    // plain text (e.g., delete responses)
    return res.text();
  }
}
