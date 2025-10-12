import { LandingPageComponent } from '@/types/LandingPage';

/**
 * Seções Prontas Otimizadas para Conversão
 * Baseadas em análise de landing pages de alta performance
 */

export const READY_SECTIONS = {
  // HERO SECTIONS - Above the Fold
  heroes: [
    {
      id: 'hero-saas-centered',
      name: 'Hero SaaS Centrado',
      category: 'hero',
      description: 'Hero clássico centrado com foco em conversão para SaaS',
      thumbnail: '🎯',
      components: [
        {
          id: 'hero-1',
          type: 'hero' as const,
          props: {
            title: 'Transforme Sua Empresa em 30 Dias',
            subtitle: '✨ Usado por 10.000+ empresas que crescem rápido',
            description: 'A plataforma completa que automatiza seu marketing e vendas. Comece grátis, sem cartão de crédito.',
            primaryCTA: 'Começar Grátis Agora',
            secondaryCTA: 'Ver Como Funciona',
            alignment: 'center',
          },
          styles: {
            backgroundColor: 'linear-gradient(135deg, hsl(25, 40%, 35%) 0%, hsl(25, 50%, 25%) 100%)',
            color: 'white',
            padding: '120px 20px 80px',
            minHeight: '90vh',
          },
        },
        {
          id: 'trust-badges-1',
          type: 'social-proof' as const,
          props: {
            type: 'logos',
            logos: [
              { name: 'Google', url: '' },
              { name: 'Microsoft', url: '' },
              { name: 'Amazon', url: '' },
              { name: 'Meta', url: '' },
            ],
            stats: {
              customers: '10,000+',
              rating: '4.9/5',
              reviews: '2,500+',
            },
          },
          styles: {
            backgroundColor: 'white',
            padding: '40px 20px',
          },
        },
      ],
    },
    {
      id: 'hero-split-screen',
      name: 'Hero Split Screen',
      category: 'hero',
      description: 'Hero com divisão lado a lado - texto + visual',
      thumbnail: '📱',
      components: [
        {
          id: 'hero-split-1',
          type: 'columns' as const,
          props: {
            columns: [
              {
                width: 6,
                items: [
                  {
                    type: 'text',
                    content: `
                      <div style="padding-top: 40px;">
                        <span style="background: hsl(142, 76%, 90%); color: hsl(142, 76%, 36%); padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">✨ Novidade 2025</span>
                        <h1 style="font-size: 48px; font-weight: 800; margin-top: 24px; line-height: 1.1;">
                          O Futuro do Seu Negócio Começa Aqui
                        </h1>
                        <p style="font-size: 20px; color: hsl(0, 0%, 46%); margin-top: 16px; line-height: 1.6;">
                          Automatize processos, aumente vendas e cresça 10x mais rápido com nossa plataforma inteligente.
                        </p>
                      </div>
                    `,
                  },
                  {
                    type: 'cta',
                    buttonText: 'Começar Teste Grátis',
                    buttonLink: '#',
                  },
                ],
                verticalAlign: 'center',
              },
              {
                width: 6,
                items: [
                  {
                    type: 'image',
                    imageUrl: 'https://via.placeholder.com/600x500?text=Dashboard+Preview',
                  },
                ],
                verticalAlign: 'center',
              },
            ],
            gap: 8,
          },
          styles: {
            padding: '80px 20px',
            minHeight: '85vh',
          },
        },
      ],
    },
  ],

  // TRUST SECTIONS - Social Proof
  trust: [
    {
      id: 'trust-comprehensive',
      name: 'Prova Social Completa',
      category: 'trust',
      description: 'Seção completa com logos, estatísticas e badges de confiança',
      thumbnail: '🏆',
      components: [
        {
          id: 'trust-stats',
          type: 'stats' as const,
          props: {
            title: 'Números que Provam Nossa Excelência',
            subtitle: 'Resultados reais de clientes reais',
            stats: [
              { value: '10,000', label: 'Empresas Ativas', suffix: '+', icon: 'users', trend: 24, color: 'hsl(25, 40%, 35%)' },
              { value: '5M', label: 'Usuários no Mundo', suffix: '+', icon: 'target', trend: 35, color: 'hsl(25, 40%, 35%)' },
              { value: '150', label: 'Países Atendidos', suffix: '+', icon: 'zap', trend: 18, color: 'hsl(25, 40%, 35%)' },
              { value: '4.9', label: 'Avaliação Média', suffix: '/5', icon: 'award', trend: 5, color: 'hsl(25, 40%, 35%)' },
            ],
            layout: 'grid',
            animated: true,
            showIcons: true,
            showTrends: true,
          },
          styles: {
            backgroundColor: 'hsl(0, 0%, 98%)',
            padding: '80px 20px',
          },
        },
        {
          id: 'trust-logos',
          type: 'social-proof' as const,
          props: {
            title: 'Empresas que Confiam em Nossa Solução',
            type: 'logos',
            logos: [
              { name: 'Empresa 1', url: '' },
              { name: 'Empresa 2', url: '' },
              { name: 'Empresa 3', url: '' },
              { name: 'Empresa 4', url: '' },
              { name: 'Empresa 5', url: '' },
              { name: 'Empresa 6', url: '' },
            ],
          },
          styles: {
            padding: '60px 20px',
          },
        },
      ],
    },
  ],

  // FEATURE SECTIONS - Benefícios
  features: [
    {
      id: 'features-icon-grid',
      name: 'Features Grid com Ícones',
      category: 'features',
      description: 'Grid 3 colunas com ícones e descrições curtas',
      thumbnail: '⚡',
      components: [
        {
          id: 'features-grid',
          type: 'features' as const,
          props: {
            title: 'Tudo que Você Precisa para Crescer',
            subtitle: 'Recursos poderosos em uma plataforma simples',
            features: [
              {
                icon: 'Zap',
                title: 'Velocidade Incomparável',
                description: 'Performance otimizada que aumenta sua produtividade em 300%',
              },
              {
                icon: 'Shield',
                title: 'Segurança Enterprise',
                description: 'Proteção de nível bancário com criptografia de ponta a ponta',
              },
              {
                icon: 'Users',
                title: 'Colaboração Perfeita',
                description: 'Trabalhe em equipe em tempo real, de qualquer lugar',
              },
              {
                icon: 'TrendingUp',
                title: 'Analytics Avançado',
                description: 'Insights acionáveis que impulsionam seu crescimento',
              },
              {
                icon: 'Heart',
                title: 'Suporte Humanizado',
                description: 'Atendimento 24/7 com tempo de resposta < 2 minutos',
              },
              {
                icon: 'Star',
                title: 'Integrações Ilimitadas',
                description: 'Conecte com 500+ ferramentas que você já usa',
              },
            ],
            layout: 'grid',
            columns: 3,
          },
          styles: {
            padding: '80px 20px',
          },
        },
      ],
    },
    {
      id: 'features-alternating',
      name: 'Features Alternadas',
      category: 'features',
      description: 'Layout alternado imagem/texto para destaque de features principais',
      thumbnail: '🎨',
      components: [
        {
          id: 'feature-1',
          type: 'columns' as const,
          props: {
            columns: [
              {
                width: 6,
                items: [
                  {
                    type: 'text',
                    content: `
                      <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 16px;">
                        Automatize Seu Workflow
                      </h2>
                      <p style="font-size: 18px; color: hsl(0, 0%, 46%); line-height: 1.6; margin-bottom: 24px;">
                        Economize 20 horas por semana com automações inteligentes que trabalham para você 24/7.
                      </p>
                      <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                          <span style="color: hsl(142, 76%, 36%); margin-right: 8px;">✓</span>
                          <span>Automação de emails e follow-ups</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                          <span style="color: hsl(142, 76%, 36%); margin-right: 8px;">✓</span>
                          <span>Integração com CRM e ferramentas</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                          <span style="color: hsl(142, 76%, 36%); margin-right: 8px;">✓</span>
                          <span>Relatórios automatizados diários</span>
                        </li>
                      </ul>
                    `,
                  },
                ],
                verticalAlign: 'center',
              },
              {
                width: 6,
                items: [
                  {
                    type: 'image',
                    imageUrl: 'https://via.placeholder.com/600x400?text=Automation+Dashboard',
                  },
                ],
                verticalAlign: 'center',
              },
            ],
            gap: 8,
          },
          styles: {
            padding: '80px 20px',
          },
        },
        {
          id: 'feature-2',
          type: 'columns' as const,
          props: {
            columns: [
              {
                width: 6,
                items: [
                  {
                    type: 'image',
                    imageUrl: 'https://via.placeholder.com/600x400?text=Analytics+Dashboard',
                  },
                ],
                verticalAlign: 'center',
              },
              {
                width: 6,
                items: [
                  {
                    type: 'text',
                    content: `
                      <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 16px;">
                        Insights que Convertem
                      </h2>
                      <p style="font-size: 18px; color: hsl(0, 0%, 46%); line-height: 1.6; margin-bottom: 24px;">
                        Tome decisões baseadas em dados com dashboards intuitivos e relatórios em tempo real.
                      </p>
                      <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                          <span style="color: hsl(142, 76%, 36%); margin-right: 8px;">✓</span>
                          <span>Métricas de conversão detalhadas</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                          <span style="color: hsl(142, 76%, 36%); margin-right: 8px;">✓</span>
                          <span>Análise preditiva com IA</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                          <span style="color: hsl(142, 76%, 36%); margin-right: 8px;">✓</span>
                          <span>Alertas inteligentes de oportunidades</span>
                        </li>
                      </ul>
                    `,
                  },
                ],
                verticalAlign: 'center',
              },
            ],
            gap: 8,
            reverseOnMobile: true,
          },
          styles: {
            backgroundColor: 'hsl(0, 0%, 98%)',
            padding: '80px 20px',
          },
        },
      ],
    },
  ],

  // PRICING SECTIONS - Otimizadas para Conversão
  pricing: [
    {
      id: 'pricing-standard',
      name: 'Pricing 3 Tiers',
      category: 'pricing',
      description: 'Seção de pricing otimizada com tier popular destacado',
      thumbnail: '💳',
      components: [
        {
          id: 'pricing-tiers',
          type: 'pricing' as const,
          props: {
            title: 'Planos Simples e Transparentes',
            subtitle: 'Escolha o melhor para seu momento',
            description: 'Todos os planos incluem 14 dias grátis. Cancele quando quiser.',
            tiers: [
              {
                name: 'Starter',
                price: 'R$ 49',
                period: '/mês',
                description: 'Perfeito para começar',
                features: [
                  '✓ Até 5 usuários',
                  '✓ 10GB de armazenamento',
                  '✓ Suporte por email',
                  '✓ Relatórios básicos',
                  '✓ Integrações essenciais',
                ],
                ctaText: 'Começar Grátis',
                highlighted: false,
              },
              {
                name: 'Professional',
                price: 'R$ 149',
                period: '/mês',
                description: '🔥 Mais Popular',
                features: [
                  '✓ Usuários ilimitados',
                  '✓ 100GB de armazenamento',
                  '✓ Suporte prioritário 24/7',
                  '✓ Analytics avançado',
                  '✓ Todas as integrações',
                  '✓ Automações ilimitadas',
                  '✓ White-label',
                ],
                ctaText: 'Começar Teste Grátis',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Personalizado',
                period: '',
                description: 'Para grandes operações',
                features: [
                  '✓ Tudo do Professional',
                  '✓ SLA garantido 99.9%',
                  '✓ Gerente de sucesso dedicado',
                  '✓ Treinamento personalizado',
                  '✓ API dedicada',
                  '✓ Segurança enterprise',
                ],
                ctaText: 'Falar com Especialista',
                highlighted: false,
              },
            ],
          },
          styles: {
            backgroundColor: 'hsl(0, 0%, 98%)',
            padding: '80px 20px',
          },
        },
        {
          id: 'pricing-guarantee',
          type: 'cta' as const,
          props: {
            title: '💯 Garantia de 30 Dias',
            description: 'Se você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.',
            ctaText: 'Começar Sem Riscos',
            ctaLink: '#',
          },
          styles: {
            backgroundColor: 'hsl(142, 76%, 95%)',
            padding: '40px 20px',
          },
        },
      ],
    },
  ],

  // TESTIMONIAL SECTIONS - Social Proof
  testimonials: [
    {
      id: 'testimonials-grid',
      name: 'Depoimentos em Grid',
      category: 'social',
      description: 'Grid de depoimentos com fotos e avaliações',
      thumbnail: '⭐',
      components: [
        {
          id: 'testimonials-section',
          type: 'testimonial' as const,
          props: {
            title: 'Adorado por 10.000+ Empresas',
            subtitle: 'Veja o que nossos clientes estão dizendo',
            testimonials: [
              {
                quote: 'Aumentamos nossa conversão em 340% nos primeiros 60 dias. O ROI foi impressionante!',
                author: 'Maria Silva',
                role: 'CEO',
                company: 'TechCorp Brasil',
                avatar: '',
                rating: 5,
              },
              {
                quote: 'A automação economizou 25 horas por semana da nossa equipe. Simplesmente revolucionário.',
                author: 'João Santos',
                role: 'Diretor de Marketing',
                company: 'Growth Startup',
                avatar: '',
                rating: 5,
              },
              {
                quote: 'Melhor decisão que tomamos este ano. Suporte incrível e resultados consistentes.',
                author: 'Ana Costa',
                role: 'Head of Sales',
                company: 'SalesMax',
                avatar: '',
                rating: 5,
              },
              {
                quote: 'Interface intuitiva e poderosa. Nossa equipe adotou em menos de uma semana.',
                author: 'Carlos Oliveira',
                role: 'CTO',
                company: 'DevHub',
                avatar: '',
                rating: 5,
              },
              {
                quote: 'Os insights de IA nos ajudaram a identificar oportunidades que nunca veríamos sozinhos.',
                author: 'Patricia Lima',
                role: 'CMO',
                company: 'DataDriven Co',
                avatar: '',
                rating: 5,
              },
              {
                quote: 'Escalamos de 100 para 1000 clientes sem precisar contratar mais gente. Incrível!',
                author: 'Ricardo Alves',
                role: 'Founder',
                company: 'ScaleUp',
                avatar: '',
                rating: 5,
              },
            ],
          },
          styles: {
            padding: '80px 20px',
          },
        },
      ],
    },
  ],

  // CTA SECTIONS - Conversion Focused
  ctas: [
    {
      id: 'cta-final',
      name: 'CTA Final Poderoso',
      category: 'conversion',
      description: 'Seção de CTA final com elementos de persuasão',
      thumbnail: '🚀',
      components: [
        {
          id: 'cta-main',
          type: 'cta' as const,
          props: {
            title: 'Pronto para Transformar Seus Resultados?',
            subtitle: 'Junte-se a 10.000+ empresas que crescem com nossa plataforma',
            description: 'Comece grátis hoje. Não precisa de cartão de crédito. Configure em menos de 5 minutos.',
            ctaText: 'Começar Gratuitamente Agora',
            ctaLink: '#',
            ctaSecondaryText: 'Agendar Demonstração',
            ctaSecondaryLink: '#demo',
          },
          styles: {
            backgroundColor: 'linear-gradient(135deg, hsl(25, 40%, 35%) 0%, hsl(25, 50%, 25%) 100%)',
            color: 'white',
            padding: '100px 20px',
          },
        },
        {
          id: 'cta-trust-final',
          type: 'social-proof' as const,
          props: {
            stats: {
              customers: '10,000+ clientes',
              rating: '4.9/5 estrelas',
              reviews: 'Mais de 2,500 avaliações',
            },
          },
          styles: {
            backgroundColor: 'hsl(0, 0%, 98%)',
            padding: '40px 20px',
          },
        },
      ],
    },
  ],

  // FAQ SECTIONS
  faqs: [
    {
      id: 'faq-comprehensive',
      name: 'FAQ Completo',
      category: 'info',
      description: 'Seção de FAQ otimizada para reduzir fricção',
      thumbnail: '❓',
      components: [
        {
          id: 'faq-section',
          type: 'faq' as const,
          props: {
            title: 'Perguntas Frequentes',
            subtitle: 'Tudo que você precisa saber',
            items: [
              {
                question: 'Como funciona o teste grátis?',
                answer: 'Você tem 14 dias para testar todas as funcionalidades, sem limitações. Não pedimos cartão de crédito e você pode cancelar a qualquer momento.',
              },
              {
                question: 'Posso mudar de plano depois?',
                answer: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. As mudanças são aplicadas imediatamente e o valor é ajustado proporcionalmente.',
              },
              {
                question: 'Quais formas de pagamento vocês aceitam?',
                answer: 'Aceitamos todos os cartões de crédito (Visa, Mastercard, Amex), PIX, boleto bancário e transferência. Para planos anuais, oferecemos 20% de desconto.',
              },
              {
                question: 'Meus dados estão seguros?',
                answer: 'Absolutamente. Usamos criptografia de nível bancário (AES-256), certificação SOC 2 Type II, e conformidade com LGPD e GDPR. Seus dados nunca são compartilhados.',
              },
              {
                question: 'Como funciona o suporte?',
                answer: 'Oferecemos suporte por email, chat e telefone. No plano Professional e Enterprise, o suporte é 24/7 com SLA de resposta garantido.',
              },
              {
                question: 'Preciso de conhecimento técnico?',
                answer: 'Não! Nossa plataforma é feita para ser intuitiva. Além disso, oferecemos tutoriais, documentação completa e webinars de onboarding gratuitos.',
              },
              {
                question: 'Posso integrar com outras ferramentas?',
                answer: 'Sim! Temos integrações nativas com 500+ ferramentas incluindo Salesforce, HubSpot, Google Analytics, Slack, Zapier e muito mais.',
              },
              {
                question: 'E se eu cancelar?',
                answer: 'Você pode cancelar a qualquer momento, sem multas ou taxas de cancelamento. Seus dados ficam disponíveis por 30 dias caso queira voltar.',
              },
            ],
          },
          styles: {
            backgroundColor: 'white',
            padding: '80px 20px',
          },
        },
      ],
    },
  ],
};

// Export organized by category
export const getSectionsByCategory = (category: string) => {
  switch (category) {
    case 'hero':
      return READY_SECTIONS.heroes;
    case 'trust':
      return READY_SECTIONS.trust;
    case 'features':
      return READY_SECTIONS.features;
    case 'pricing':
      return READY_SECTIONS.pricing;
    case 'social':
      return READY_SECTIONS.testimonials;
    case 'conversion':
      return READY_SECTIONS.ctas;
    case 'info':
      return READY_SECTIONS.faqs;
    default:
      return [];
  }
};

// Get all sections
export const getAllReadySections = () => {
  return [
    ...READY_SECTIONS.heroes,
    ...READY_SECTIONS.trust,
    ...READY_SECTIONS.features,
    ...READY_SECTIONS.pricing,
    ...READY_SECTIONS.testimonials,
    ...READY_SECTIONS.ctas,
    ...READY_SECTIONS.faqs,
  ];
};
