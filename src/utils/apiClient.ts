// Utilitário para chamadas REST ao backend
export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': 'sb_publishable_2eqMHpJop2uLMoXDf-Gnng_xBjrdTJe',
    'Prefer': 'return=representation'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const url = `${import.meta.env.VITE_API_URL}/${endpoint}`;
  // Supabase REST espera array no body para inserts
  const bodyToSend = method === 'POST' && body ? JSON.stringify([body]) : null;
  const response = await fetch(url, {
    method,
    headers,
    body: bodyToSend,
  });
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }
  return { status: response.status, data };
}
