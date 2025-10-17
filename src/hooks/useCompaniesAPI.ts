import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/companies`);
      if (!res.ok) throw new Error('Erro ao buscar empresas');
      return res.json();
    },
  });
}
