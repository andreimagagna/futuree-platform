# 🤖 INTEGRAÇÃO COHERE AI - DOCUMENTAÇÃO

## Visão Geral

A plataforma Futuree AI Solutions agora possui integração completa com **Cohere AI** para fornecer insights inteligentes, análise de dados e assistência por chat no CRM.

---

## 📋 Funcionalidades

### 1. **Chat Inteligente (AIChat)**
- Conversa contextual com dados do CRM
- Análise de leads em tempo real
- Sugestões de próximas ações
- Respostas baseadas em todo o pipeline

**Localização:** `src/components/AIChat.tsx`

**Como usar:**
```tsx
import { AIChat } from '@/components/AIChat';

// No seu componente
<AIChat 
  onClose={() => setShowAIChat(false)} 
  initialContext="leads" 
/>
```

**Contextos disponíveis:**
- `leads` - Análise de leads (padrão)
- `funnels` - Análise de funis
- `insights` - Insights gerais

---

### 2. **Card de Insights Automáticos (AIInsightsCard)**
- Análise automática do pipeline
- Tendências identificadas
- Previsões de vendas
- Recomendações estratégicas

**Localização:** `src/components/AIInsightsCard.tsx`

**Como usar:**
```tsx
import { AIInsightsCard } from '@/components/AIInsightsCard';

// No Dashboard
<AIInsightsCard />
```

**Atualização:** Automática quando há mudanças nos leads/atividades

---

### 3. **Serviço de IA (cohereAI.ts)**

**Localização:** `src/services/cohereAI.ts`

#### Funções Disponíveis:

##### `chatWithAI(message, context, chatHistory)`
Chat conversacional com contexto do CRM.

```typescript
import { chatWithAI } from '@/services/cohereAI';

const response = await chatWithAI(
  "Quais leads devo priorizar hoje?",
  { leads, funnels, activities },
  chatHistory
);
```

**Parâmetros:**
- `message`: Pergunta do usuário
- `context`: Dados do CRM (leads, funnels, etc)
- `chatHistory`: Histórico da conversa (opcional)

**Retorno:** `string` - Resposta da IA

---

##### `analyzeLeadWithAI(lead)`
Análise individual de um lead.

```typescript
import { analyzeLeadWithAI } from '@/services/cohereAI';

const analysis = await analyzeLeadWithAI(lead);

// Retorna:
{
  score: 85,
  insights: ["Lead altamente qualificado", "Budget confirmado"],
  nextActions: ["Agendar reunião", "Enviar proposta"],
  risks: ["Concorrente forte no mercado"],
  opportunities: ["Expansão para outras áreas"]
}
```

**Retorno:** `LeadAnalysis`

---

##### `generateSalesInsights(data)`
Gera insights estratégicos do pipeline.

```typescript
import { generateSalesInsights } from '@/services/cohereAI';

const insights = await generateSalesInsights({
  leads,
  funnels,
  activities,
  period: 'últimos 30 dias'
});

// Retorna:
{
  summary: "Pipeline saudável com crescimento de 15%",
  trends: ["Aumento de leads qualificados", "..."],
  predictions: ["Fechar 3 deals este mês", "..."],
  recommendations: ["Focar em leads enterprise", "..."]
}
```

**Retorno:** `SalesInsight`

---

##### `suggestNextAction(lead, recentActivities)`
Sugere próximas ações para um lead.

```typescript
import { suggestNextAction } from '@/services/cohereAI';

const actions = await suggestNextAction(lead, activities);

// Retorna:
[
  "Fazer follow-up por email",
  "Agendar call de qualificação",
  "Enviar proposta personalizada"
]
```

**Retorno:** `string[]` (array de ações)

---

##### `analyzeText(text, type)`
Analisa texto (notas, emails, propostas).

```typescript
import { analyzeText } from '@/services/cohereAI';

const analysis = await analyzeText(
  "Cliente muito interessado, mencionou budget aprovado...",
  'note'
);

// Retorna:
{
  sentiment: "positive",
  keyPoints: ["Cliente interessado", "Budget aprovado"],
  actionItems: ["Enviar proposta", "Agendar reunião"]
}
```

**Tipos suportados:** `'note' | 'email' | 'proposal'`

**Retorno:** 
```typescript
{
  sentiment: 'positive' | 'neutral' | 'negative';
  keyPoints: string[];
  actionItems: string[];
}
```

---

## 🔧 Configuração

### Variável de Ambiente

**Arquivo:** `.env`

```env
VITE_API_COHERE="sua_api_key_aqui"
```

**Nota:** A chave API já está configurada no projeto.

---

## 🎯 Casos de Uso

### 1. **Análise de Lead Individual**

No componente `LeadDetailView`:

```tsx
import { analyzeLeadWithAI } from '@/services/cohereAI';
import { useState } from 'react';

function LeadDetailView() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeLeadWithAI(lead);
      setAnalysis(result);
    } catch (error) {
      console.error('Erro ao analisar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleAnalyze}>
        Analisar com IA
      </Button>
      
      {analysis && (
        <div>
          <p>Score: {analysis.score}/100</p>
          <h3>Insights:</h3>
          <ul>
            {analysis.insights.map(i => <li>{i}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

### 2. **Chat Assistente no CRM**

Já integrado em `src/components/crm/CRMView.tsx`:

```tsx
// Botão "Assistente IA" no cabeçalho
<Button onClick={() => setShowAIChat(true)}>
  <Bot className="h-4 w-4" /> Assistente IA
</Button>

// Chat lateral
{showAIChat && (
  <div className="fixed right-6 top-20 z-50">
    <AIChat 
      onClose={() => setShowAIChat(false)} 
      initialContext="leads" 
    />
  </div>
)}
```

---

### 3. **Insights Automáticos no Dashboard**

Adicione o card de insights:

```tsx
import { AIInsightsCard } from '@/components/AIInsightsCard';

function Dashboard() {
  return (
    <div className="grid gap-4">
      {/* Outros cards */}
      <AIInsightsCard />
    </div>
  );
}
```

---

### 4. **Sugestões de Ação em Tempo Real**

No Kanban ou lista de leads:

```tsx
import { suggestNextAction } from '@/services/cohereAI';

const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  if (selectedLead) {
    suggestNextAction(selectedLead, activities).then(setSuggestions);
  }
}, [selectedLead]);

// Exibir sugestões
{suggestions.map(action => (
  <Badge key={action}>{action}</Badge>
))}
```

---

## 📊 Contexto Fornecido à IA

A IA tem acesso a:

- **Leads**: Nome, empresa, email, telefone, score, status, estágio, fonte, valor, tags, notas
- **Funis**: Quantidade, estágios, conversão entre etapas
- **Atividades**: Histórico de interações, chamadas, emails, reuniões
- **Métricas**: Total de leads, taxa de conversão, valor do pipeline
- **Usuário**: Email e preferências

---

## ⚡ Performance

### Otimizações Implementadas:

1. **Cache de Respostas**: React Query cacheia resultados
2. **Contexto Limitado**: Envia apenas dados relevantes
3. **Histórico Truncado**: Máximo de últimas 10 mensagens no chat
4. **Atividades Limitadas**: Apenas últimas 50 atividades

### Tempo de Resposta Esperado:
- Chat: 2-5 segundos
- Análise de Lead: 3-6 segundos
- Insights Gerais: 5-8 segundos

---

## 🚨 Tratamento de Erros

Todos os métodos possuem try/catch:

```typescript
try {
  const response = await chatWithAI(message, context);
  // Sucesso
} catch (error) {
  console.error('[CohereAI] Erro:', error);
  // Fallback ou mensagem de erro
}
```

**Erros comuns:**
- `API key inválida`: Verificar `.env`
- `Timeout`: Contexto muito grande
- `Rate limit`: Muitas requisições simultâneas

---

## 🔐 Segurança

- ✅ API Key armazenada em variável de ambiente
- ✅ RLS (Row-Level Security) no Supabase
- ✅ Dados filtrados por `owner_id`
- ✅ Nenhum dado sensível enviado à IA (senhas, tokens)

---

## 🎨 Componentes UI

### AIChat
- Layout: Card flutuante fixo
- Estilo: Gradiente roxo/rosa no avatar
- Interação: Input + Send button, ações rápidas
- Responsivo: Max-width 2xl, height 600px

### AIInsightsCard
- Layout: Card padrão do shadcn/ui
- Seções: Tendências, Previsões, Recomendações
- Ícones: TrendingUp, Target, Lightbulb
- Auto-refresh: Quando leads/atividades mudam

---

## 📝 Exemplos de Perguntas ao Chat

### Análise Geral:
- "Como está meu pipeline de vendas?"
- "Quais são minhas métricas principais?"
- "Qual a taxa de conversão atual?"

### Leads Específicos:
- "Quais leads devo priorizar hoje?"
- "Mostre leads com maior probabilidade de fechar"
- "Analise o lead da empresa X"

### Ações Recomendadas:
- "O que devo fazer para aumentar conversão?"
- "Que ações posso tomar esta semana?"
- "Como melhorar meu processo de vendas?"

### Previsões:
- "Qual a previsão de vendas para este mês?"
- "Quantos deals vou fechar?"
- "Qual o valor esperado do pipeline?"

---

## 🚀 Próximas Melhorias

### Planejadas:
- [ ] Análise de sentimento em tempo real
- [ ] Score automático de leads com ML
- [ ] Recomendações de preço/desconto
- [ ] Alertas proativos (lead frio, follow-up atrasado)
- [ ] Integração com WhatsApp/Email para sugestões
- [ ] Relatórios em PDF gerados pela IA
- [ ] Treinamento com dados históricos da empresa

---

## 📚 Referências

- **Cohere AI**: https://docs.cohere.com/
- **Modelo Usado**: `command-r-plus` (mais preciso)
- **Temperatura**: 0.3-0.7 (balanceado)
- **Max Tokens**: Não limitado (resposta completa)

---

## 🆘 Troubleshooting

### "Cannot find module 'cohere-ai'"
```bash
npm install cohere-ai
```

### "API key inválida"
Verificar `.env`:
```env
VITE_API_COHERE="sua_chave_aqui"
```

### "Chat não responde"
1. Verificar console do navegador
2. Testar API key no Cohere Dashboard
3. Verificar se há leads/dados no CRM

### "Insights não carregam"
1. Aguardar até ter pelo menos 1 lead
2. Verificar se `useSupabaseLeads` retorna dados
3. Checar logs de erro no console

---

## 💡 Dicas de Uso

1. **Contexto Específico**: Mencione nomes de empresas/leads para análises direcionadas
2. **Perguntas Claras**: Seja específico no que precisa
3. **Histórico**: O chat mantém contexto, você pode fazer follow-ups
4. **Dados Atualizados**: A IA sempre usa dados em tempo real do Supabase

---

## ✅ Checklist de Integração

- [x] Cohere SDK instalado
- [x] API Key configurada no `.env`
- [x] Serviço `cohereAI.ts` criado
- [x] Componente `AIChat` criado
- [x] Componente `AIInsightsCard` criado
- [x] Integração no CRM (`CRMView.tsx`)
- [x] Documentação completa
- [ ] Testes de integração
- [ ] Deploy em produção

---

**Desenvolvido por:** Futuree AI Solutions  
**Data:** Janeiro 2025  
**Versão:** 1.0.0
