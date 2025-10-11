import { Lead } from '@/types/Agent';
import { mockLeads } from '@/utils/agentMockData';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchLeads(): Promise<Lead[]> {
  // Se tiver API configurada, usa a API real
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/leads`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return await response.json();
    } catch (error) {
      console.error('API Error, falling back to mock data:', error);
      return mockLeads;
    }
  }
  
  // Caso contrário, usa dados mockados
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockLeads), 300);
  });
}

export async function updateLeadStatus(leadId: string, status: 'active' | 'manual'): Promise<void> {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update lead status');
    } catch (error) {
      console.error('API Error:', error);
    }
  }
  
  // Mock: apenas simula sucesso
  return Promise.resolve();
}
