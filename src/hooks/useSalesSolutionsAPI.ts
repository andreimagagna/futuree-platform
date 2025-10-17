import { useQuery } from '@tanstack/react-query';
import { API_URL } from './useBackendAPI';

export function useSalesSolutions() {
  return useQuery({
    queryKey: ['sales_solutions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/sales_solutions`);
      if (!res.ok) throw new Error('Erro ao buscar sales solutions');
      return res.json();
    },
  });
}
