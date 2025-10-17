import { useQuery } from '@tanstack/react-query';
import { API_URL } from './useBackendAPI';

export function useMarketingSolutions() {
  return useQuery({
    queryKey: ['marketing_solutions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/marketing_solutions`);
      if (!res.ok) throw new Error('Erro ao buscar marketing solutions');
      return res.json();
    },
  });
}
