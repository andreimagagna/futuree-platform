import { Message } from '@/types/Agent';
import { mockMessages } from '@/utils/agentMockData';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchMessages(leadId: string): Promise<Message[]> {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/messages/${leadId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('API Error, falling back to mock data:', error);
      return mockMessages[leadId] || [];
    }
  }
  
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMessages[leadId] || []), 200);
  });
}

export async function sendMessage(leadId: string, text: string): Promise<Message> {
  const newMessage: Message = {
    id: `m${Date.now()}`,
    leadId,
    text,
    fromMe: true,
    createdAt: new Date().toISOString(),
  };

  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, text }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    } catch (error) {
      console.error('API Error, using mock:', error);
      return newMessage;
    }
  }
  
  // Mock: retorna a mensagem criada localmente
  return new Promise((resolve) => {
    setTimeout(() => resolve(newMessage), 100);
  });
}

export async function transferLead(leadId: string): Promise<void> {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to transfer lead');
    } catch (error) {
      console.error('API Error:', error);
    }
  }
  
  // Mock: apenas simula transferência
  console.log(`Lead ${leadId} transferido para atendimento humano`);
  return Promise.resolve();
}
