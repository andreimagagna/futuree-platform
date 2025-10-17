import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/profiles`);
      if (!res.ok) throw new Error('Erro ao buscar perfis');
      return res.json();
    },
  });
}
