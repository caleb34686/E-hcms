// /src/lib/api.ts
// Point to the internal Next.js API path bundle
const BASE_URL = "/api"; 

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) throw new Error(`e-HCMS Error: ${response.status}`);
  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint: string, data: any) => apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
};
