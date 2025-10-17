import { useQuery } from '@tanstack/react-query';
import { API_URL } from './useBackendAPI';

export function useBusinessSolutions() {
  return useQuery({
    queryKey: ['business_solutions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/business_solutions`);
      if (!res.ok) throw new Error('Erro ao buscar business solutions');
      return res.json();
    },
  });
}
