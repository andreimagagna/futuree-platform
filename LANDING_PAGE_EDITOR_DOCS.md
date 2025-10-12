# 🎨 Editor de Landing Pages - Documentação Completa

## Visão Geral
Editor visual drag-and-drop para criação de landing pages sem código, com 15+ templates profissionais, componentes otimizados e integração com funis de marketing.

---

## ✅ Funcionalidades Implementadas

### 1. **Editor Visual Completo**
- Interface drag-and-drop intuitiva
- 9 tipos de componentes pré-construídos
- Edição visual com seleção de componentes
- Preview responsivo (Desktop, Tablet, Mobile)
- Sidebar colapsável para maximizar espaço

### 2. **Biblioteca de Templates** (5 templates)
✅ **Webinar Master**
- Hero section com countdown
- Formulário de inscrição (4 campos)
- Features (3 itens)
- Prova social (estatísticas)

✅ **E-book Download**
- Hero section com CTA
- Layout em 2 colunas (imagem + formulário)
- Features (6 capítulos)

✅ **Demo de Produto**
- Hero section
- Vídeo integrado
- Features (3 benefícios)
- Formulário de agendamento (5 campos)
- Depoimentos de clientes

✅ **Newsletter Signup**
- Hero section minimalista
- Formulário simples (2 campos)
- Prova social

✅ **Lançamento de Produto**
- Hero section impactante
- Features (6 recursos)
- Pricing table (3 planos)
- FAQ (4 perguntas)
- CTA final duplo

✅ **Página em Branco**
- Template vazio para começar do zero

### 3. **Componentes Disponíveis** (9 tipos)

#### Hero Section
- Título, subtítulo, CTA
- Background image/video support
- Overlay com opacidade ajustável
- Alinhamento: esquerda, centro, direita

#### Formulário
- Tipos de campo: text, email, phone, textarea, select, checkbox, radio
- Validação de campos obrigatórios
- Mensagem de privacidade
- Tela de sucesso após envio
- Redirect pós-envio

#### Features
- Grid responsivo (1-3 colunas)
- Ícones personalizáveis
- Hover effects

#### Pricing Table
- Até 3 planos side-by-side
- Destaque para plano recomendado
- Lista de features com checkmarks
- CTAs individuais

#### Depoimentos (Testimonials)
- Avatar do cliente
- Nome, cargo, empresa
- Avaliação em estrelas (1-5)
- Quote destacado

#### FAQ
- Accordion expansível
- Perguntas e respostas
- Animação suave

#### Countdown Timer
- Contador regressivo em tempo real
- Dias, horas, minutos, segundos
- Mensagem de expiração customizável

#### Prova Social
- 3 modos: números, logos, reviews
- Grid responsivo
- Estatísticas impressionantes

#### CTA (Call-to-Action)
- Título e subtítulo
- 2 CTAs (primário + secundário)
- Background customizável

### 4. **Gerenciamento de Componentes**
✅ Adicionar novos componentes
✅ Remover componentes
✅ Duplicar componentes
✅ Mover para cima/baixo (reordenar)
✅ Seleção visual

### 5. **Preview Multi-Dispositivo**
✅ Desktop (full width)
✅ Tablet (max-w-2xl)
✅ Mobile (max-w-sm)
✅ Alternância instantânea

### 6. **Persistência**
✅ Salvar landing pages no localStorage
✅ Carregar templates salvos
✅ Sistema de nomeação
✅ Contador de componentes

---

## 🎯 Estrutura de Arquivos

```
src/
├── types/
│   └── LandingPage.ts           # Tipos TypeScript completos
├── utils/
│   └── landingPageTemplates.ts  # 5 templates pré-configurados
├── components/
│   └── landing-page/
│       ├── HeroComponent.tsx
│       ├── FormComponent.tsx
│       ├── FeaturesComponent.tsx
│       ├── PricingComponent.tsx
│       ├── TestimonialComponent.tsx
│       ├── FAQComponent.tsx
│       ├── CountdownComponent.tsx
│       ├── SocialProofComponent.tsx
│       └── CTAComponent.tsx
└── pages/
    └── marketing/
        └── EditorLandingPage.tsx # Editor principal
```

---

## 🚀 Como Usar

### Acessar o Editor
1. Navegue para `/marketing/landing-pages`
2. Sidebar: Menu "Marketing Solution" → "Landing Pages"

### Criar Nova Landing Page
1. Escolha um template ou "Página em Branco"
2. Adicione componentes pela sidebar esquerda
3. Clique em componentes para selecioná-los
4. Use os botões para mover, duplicar ou remover
5. Ajuste o preview para desktop/tablet/mobile
6. Clique em "Salvar" e dê um nome

### Editar Componentes (Próxima Fase)
- Clique no componente selecionado
- Painel de propriedades aparecerá
- Edite textos, cores, estilos
- Preview em tempo real

---

## 📊 Tipos de Dados

### LandingPageTemplate
```typescript
{
  id: string;
  name: string;
  category: 'webinar' | 'ebook' | 'demo' | 'newsletter' | 'produto' | 'servico' | 'evento';
  description: string;
  components: LandingPageComponent[];
  settings: LandingPageSettings;
  isPublished: boolean;
  createdAt: string;
}
```

### LandingPageComponent
```typescript
{
  id: string;
  type: ComponentType;
  order: number;
  props: Record<string, any>;
  styles?: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}
```

---

## 🎨 Paleta de Cores Integrada

Todos os componentes utilizam as cores do design system:
- **Primary**: `hsl(18,30%,25%)` - Marrom escuro
- **Background**: `hsl(40,20%,97%)` - Bege claro
- **Success**: `hsl(140,30%,40%)` - Verde musgo
- **Warning**: `hsl(35,60%,55%)` - Laranja/âmbar
- **Info**: `hsl(200,15%,45%)` - Cinza azulado

---

## 🔮 Próximas Implementações (Fase 2)

### Editor de Propriedades
- [ ] Painel lateral direito para editar componente selecionado
- [ ] Campos para editar todos os textos
- [ ] Color picker para cores
- [ ] Upload de imagens
- [ ] Espaçamento visual (padding/margin slider)

### Componentes Adicionais
- [ ] Video component
- [ ] Image component
- [ ] Text block
- [ ] Spacer/Divider
- [ ] Columns layout
- [ ] Blog post grid
- [ ] Newsletter embed
- [ ] Social media links

### Teste A/B
- [ ] Criar versões alternativas
- [ ] Distribuição de tráfego (%)
- [ ] Métricas por versão
- [ ] Declarar vencedor automático

### Integrações
- [ ] Webhook para CRM
- [ ] Google Analytics
- [ ] Facebook Pixel
- [ ] LinkedIn Insight Tag
- [ ] Email marketing (Mailchimp, SendGrid)
- [ ] Zapier webhooks

### Deploy e Publicação
- [ ] Gerar HTML/CSS estático
- [ ] Hospedagem integrada
- [ ] Custom domain
- [ ] SSL automático
- [ ] Preview link

### Performance e SEO
- [ ] Meta tags editáveis (título, descrição, OG)
- [ ] Schema markup
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Lazy loading de imagens
- [ ] Minificação de CSS/JS
- [ ] Core Web Vitals tracking

### Analytics Integrado
- [ ] Page views
- [ ] Unique visitors
- [ ] Form submissions
- [ ] Conversion rate
- [ ] Bounce rate
- [ ] Average time on page
- [ ] Heat maps
- [ ] Scroll depth

---

## 💡 Casos de Uso

### Marketing de Conteúdo
- Landing page para download de e-book
- Newsletter signup
- Webinar registration

### Produto/SaaS
- Página de demo/trial
- Pricing page
- Feature showcase

### Eventos
- Event registration
- Workshop signup
- Conference landing page

### Vendas
- Product launch
- Limited-time offer
- Lead magnet

---

## 🔧 Configurações Avançadas (Futura)

### SEO Settings
```typescript
{
  title: string;
  metaDescription: string;
  keywords: string[];
  canonical: string;
  ogImage: string;
  favicon: string;
}
```

### Analytics
```typescript
{
  googleAnalytics: string;    // GA4 ID
  facebookPixel: string;       // Pixel ID
  linkedInInsight: string;     // Partner ID
}
```

### Integrations
```typescript
{
  crmWebhook: string;         // POST endpoint
  emailProvider: string;       // Mailchimp/SendGrid API
  zapierWebhook: string;       // Zap URL
}
```

---

## 📈 Métricas de Sucesso

- [x] 5 templates profissionais implementados
- [x] 9 componentes pré-construídos
- [x] Preview responsivo (3 tamanhos)
- [x] Sistema de salvamento funcional
- [x] Sidebar colapsável
- [x] Gerenciamento completo de componentes
- [ ] Editor de propriedades (Fase 2)
- [ ] Sistema de publicação (Fase 2)
- [ ] Analytics integrado (Fase 2)
- [ ] Teste A/B (Fase 2)

---

## 🎓 Exemplo de Uso

```typescript
// Criar uma nova landing page programaticamente
const newPage: LandingPageTemplate = {
  id: 'custom-1',
  name: 'Minha Landing Page',
  category: 'produto',
  description: 'Landing page personalizada',
  components: [
    {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      props: {
        title: 'Bem-vindo!',
        subtitle: 'Descubra nosso produto',
        ctaText: 'Começar Agora',
        alignment: 'center',
      },
      styles: {
        backgroundColor: 'hsl(18,30%,25%)',
        color: 'white',
        padding: '100px 20px',
      },
    },
  ],
  settings: {
    title: 'Minha Landing Page',
  },
  isPublished: false,
  createdAt: new Date().toISOString(),
};

// Salvar no localStorage
const saved = JSON.parse(localStorage.getItem('landingPages') || '[]');
saved.push(newPage);
localStorage.setItem('landingPages', JSON.stringify(saved));
```

---

## 🐛 Troubleshooting

### Componente não aparece
- Verifique se o tipo está correto
- Confira se as props obrigatórias estão presentes
- Veja o console para erros de rendering

### Preview não responsivo
- Confirme se está usando as classes Tailwind corretas
- Verifique breakpoints (sm:, md:, lg:)

### Não salva
- Confirme se localStorage está disponível
- Verifique permissões do navegador
- Veja console para erros

---

**Versão**: 1.0.0  
**Última atualização**: 12 de outubro de 2025  
**Status**: ✅ Funcional (Fase 1 completa)  
**Próxima milestone**: Editor de Propriedades + Deploy
