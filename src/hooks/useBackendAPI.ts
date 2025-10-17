export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchFromBackend(endpoint, options = {}) {
  const res = await fetch(`${API_URL}/${endpoint}`, options);
  if (!res.ok) throw new Error('Erro na requisição ao backend');
  return res.json();
}
