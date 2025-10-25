/**
 * ============================================================================
 * PÁGINA DE IA - ASSISTENTE INTELIGENTE
 * ============================================================================
 * Página dedicada ao chat com IA integrado ao CRM
 * ============================================================================
 */

import { AIChat } from '@/components/AIChat';

export default function AI() {
  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-var(--topbar-height))]">
      <AIChat initialContext="insights" />
    </div>
  );
}
