export interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  tags: string[];
  status: "active" | "manual";
  updatedAt: string;
}

export interface Message {
  id: string;
  leadId: string;
  text: string;
  fromMe: boolean;
  createdAt: string;
}

export interface AgentStatus {
  active: boolean;
  conversationsCount: number;
  lastActivity: string;
}
