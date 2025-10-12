import { LandingPageTemplate } from '@/types/LandingPage';

export const LANDING_PAGE_TEMPLATES: LandingPageTemplate[] = [
  {
    id: 'webinar-1',
    name: 'Webinar Master',
    category: 'webinar',
    description: 'Template profissional para inscrições em webinar com countdown e prova social',
    isPublished: false,
    createdAt: new Date().toISOString(),
    settings: {
      title: 'Webinar - Cadastro',
      metaDescription: 'Inscreva-se no webinar gratuito',
    },
    components: [
      {
        id: 'hero-1',
        type: 'hero',
        order: 1,
        props: {
          title: 'Webinar Gratuito: Como Escalar Suas Vendas em 90 Dias',
          subtitle: 'Descubra as estratégias que empresas líderes usam para crescer exponencialmente',
          ctaText: 'Garantir Minha Vaga',
          alignment: 'center',
          overlay: true,
          overlayOpacity: 0.6,
        },
        styles: {
          backgroundColor: 'hsl(18,30%,25%)',
          padding: '80px 20px',
          color: 'white',
        },
      },
      {
        id: 'countdown-1',
        type: 'countdown',
        order: 2,
        props: {
          title: 'Vagas Limitadas - Inscrições Encerram Em:',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiredMessage: 'As inscrições foram encerradas',
        },
        styles: {
          backgroundColor: 'hsl(35,60%,55%)',
          padding: '40px 20px',
          textAlign: 'center',
        },
      },
      {
        id: 'features-1',
        type: 'features',
        order: 3,
        props: {
          title: 'O Que Você Vai Aprender',
          features: [
            {
              icon: 'Target',
              title: 'Estratégias de Prospecção',
              description: 'Técnicas comprovadas para encontrar e qualificar leads de alta conversão',
            },
            {
              icon: 'TrendingUp',
              title: 'Funil de Vendas Otimizado',
              description: 'Como estruturar um funil que converte em cada etapa',
            },
            {
              icon: 'Users',
              title: 'Gestão de Equipe',
              description: 'Processos para escalar seu time comercial de forma eficiente',
            },
          ],
        },
        styles: {
          padding: '60px 20px',
          backgroundColor: 'white',
        },
      },
      {
        id: 'form-1',
        type: 'form',
        order: 4,
        props: {
          title: 'Garanta Sua Vaga Agora',
          subtitle: 'Preencha o formulário abaixo para receber o link de acesso',
          fields: [
            { id: 'name', type: 'text', label: 'Nome Completo', required: true, placeholder: 'João Silva' },
            { id: 'email', type: 'email', label: 'E-mail Corporativo', required: true, placeholder: 'joao@empresa.com' },
            { id: 'phone', type: 'phone', label: 'Telefone/WhatsApp', required: true, placeholder: '(11) 99999-9999' },
            { id: 'company', type: 'text', label: 'Empresa', required: false, placeholder: 'Sua Empresa LTDA' },
          ],
          submitText: 'Confirmar Inscrição',
          privacyText: 'Ao se inscrever, você concorda com nossa Política de Privacidade',
        },
        styles: {
          backgroundColor: 'hsl(40,20%,97%)',
          padding: '60px 20px',
        },
      },
      {
        id: 'social-proof-1',
        type: 'social-proof',
        order: 5,
        props: {
          type: 'numbers',
          items: [
            { label: 'Participantes', value: '10.000+' },
            { label: 'Taxa de Satisfação', value: '98%' },
            { label: 'Empresas Atendidas', value: '500+' },
          ],
        },
        styles: {
          padding: '40px 20px',
          backgroundColor: 'hsl(18,30%,25%)',
          color: 'white',
        },
      },
    ],
  },
  {
    id: 'ebook-1',
    name: 'E-book Download',
    category: 'ebook',
    description: 'Landing page otimizada para download de e-book com captura de leads',
    isPublished: false,
    createdAt: new Date().toISOString(),
    settings: {
      title: 'Download Gratuito - E-book',
      metaDescription: 'Baixe nosso e-book gratuito',
    },
    components: [
      {
        id: 'hero-2',
        type: 'hero',
        order: 1,
        props: {
          title: 'E-book Gratuito: O Guia Completo de Marketing Digital',
          subtitle: '150 páginas com estratégias práticas e cases reais',
          ctaText: 'Baixar Agora Grátis',
          alignment: 'left',
        },
        styles: {
          backgroundColor: 'hsl(140,30%,40%)',
          padding: '100px 20px',
          color: 'white',
        },
      },
      {
        id: 'columns-1',
        type: 'columns',
        order: 2,
        props: {
          columns: [
            {
              width: '50%',
              content: {
                type: 'image',
                src: '/ebook-cover.png',
                alt: 'Capa do E-book',
              },
            },
            {
              width: '50%',
              content: {
                type: 'form',
                title: 'Preencha para Receber',
                fields: [
                  { id: 'name', type: 'text', label: 'Nome', required: true },
                  { id: 'email', type: 'email', label: 'E-mail', required: true },
                ],
                submitText: 'Quero o E-book Grátis',
              },
            },
          ],
        },
        styles: {
          padding: '60px 20px',
        },
      },
      {
        id: 'features-2',
        type: 'features',
        order: 3,
        props: {
          title: 'O Que Você Vai Encontrar Neste E-book',
          features: [
            { icon: 'Target', title: 'Capítulo 1', description: 'Fundamentos do Marketing Digital' },
            { icon: 'TrendingUp', title: 'Capítulo 2', description: 'SEO e Tráfego Orgânico' },
            { icon: 'Users', title: 'Capítulo 3', description: 'Social Media Marketing' },
            { icon: 'Mail', title: 'Capítulo 4', description: 'E-mail Marketing Avançado' },
            { icon: 'DollarSign', title: 'Capítulo 5', description: 'Métricas e ROI' },
            { icon: 'CheckCircle', title: 'Capítulo 6', description: 'Cases de Sucesso' },
          ],
        },
        styles: {
          padding: '60px 20px',
          backgroundColor: 'hsl(40,20%,97%)',
        },
      },
    ],
  },
  {
    id: 'demo-1',
    name: 'Demo de Produto',
    category: 'demo',
    description: 'Página para agendamento de demonstração do produto',
    isPublished: false,
    createdAt: new Date().toISOString(),
    settings: {
      title: 'Agende uma Demo',
      metaDescription: 'Veja nosso produto em ação',
    },
    components: [
      {
        id: 'hero-3',
        type: 'hero',
        order: 1,
        props: {
          title: 'Veja Nossa Plataforma em Ação',
          subtitle: 'Agende uma demonstração personalizada de 30 minutos',
          ctaText: 'Agendar Demo Gratuita',
          alignment: 'center',
        },
        styles: {
          backgroundColor: 'hsl(200,15%,45%)',
          padding: '80px 20px',
          color: 'white',
        },
      },
      {
        id: 'video-1',
        type: 'video',
        order: 2,
        props: {
          title: 'Assista ao Overview (2min)',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          autoplay: false,
        },
        styles: {
          padding: '60px 20px',
          backgroundColor: 'white',
        },
      },
      {
        id: 'features-3',
        type: 'features',
        order: 3,
        props: {
          title: 'Por Que Agendar uma Demo?',
          features: [
            { icon: 'Target', title: 'Personalizada', description: 'Demo adaptada às suas necessidades' },
            { icon: 'Users', title: 'Consultoria Grátis', description: '30 minutos com um especialista' },
            { icon: 'CheckCircle', title: 'Sem Compromisso', description: 'Nenhum custo ou obrigação' },
          ],
        },
        styles: {
          padding: '40px 20px',
        },
      },
      {
        id: 'form-2',
        type: 'form',
        order: 4,
        props: {
          title: 'Agende Sua Demonstração',
          fields: [
            { id: 'name', type: 'text', label: 'Nome', required: true },
            { id: 'email', type: 'email', label: 'E-mail', required: true },
            { id: 'phone', type: 'phone', label: 'Telefone', required: true },
            { id: 'company', type: 'text', label: 'Empresa', required: true },
            { 
              id: 'company_size', 
              type: 'select', 
              label: 'Tamanho da Empresa', 
              required: true,
              options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
            },
          ],
          submitText: 'Confirmar Agendamento',
        },
        styles: {
          backgroundColor: 'hsl(40,20%,97%)',
          padding: '60px 20px',
        },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        order: 5,
        props: {
          title: 'O Que Nossos Clientes Dizem',
          testimonials: [
            {
              name: 'Maria Silva',
              role: 'CEO',
              company: 'Tech Solutions',
              quote: 'A plataforma transformou completamente nossa operação de vendas.',
              rating: 5,
            },
            {
              name: 'João Santos',
              role: 'Diretor Comercial',
              company: 'Sales Corp',
              quote: 'ROI em menos de 3 meses. Recomendo fortemente!',
              rating: 5,
            },
          ],
        },
        styles: {
          padding: '60px 20px',
        },
      },
    ],
  },
  {
    id: 'newsletter-1',
    name: 'Newsletter Signup',
    category: 'newsletter',
    description: 'Página simples e elegante para inscrição em newsletter',
    isPublished: false,
    createdAt: new Date().toISOString(),
    settings: {
      title: 'Newsletter',
      metaDescription: 'Inscreva-se em nossa newsletter',
    },
    components: [
      {
        id: 'hero-4',
        type: 'hero',
        order: 1,
        props: {
          title: 'Receba Insights Semanais de Marketing',
          subtitle: 'Junte-se a 10.000+ profissionais que recebem nossas dicas todas as terças-feiras',
          ctaText: 'Inscrever-se Grátis',
          alignment: 'center',
        },
        styles: {
          backgroundColor: 'hsl(18,25%,30%)',
          padding: '100px 20px',
          color: 'white',
        },
      },
      {
        id: 'form-3',
        type: 'form',
        order: 2,
        props: {
          title: 'Cadastre-se Agora',
          subtitle: 'É grátis e você pode cancelar a qualquer momento',
          fields: [
            { id: 'name', type: 'text', label: 'Nome', required: true, placeholder: 'Seu nome' },
            { id: 'email', type: 'email', label: 'E-mail', required: true, placeholder: 'seu@email.com' },
          ],
          submitText: 'Quero Receber',
          privacyText: 'Não enviamos spam. Cancele quando quiser.',
        },
        styles: {
          padding: '60px 20px',
          backgroundColor: 'white',
          textAlign: 'center',
        },
      },
      {
        id: 'social-proof-2',
        type: 'social-proof',
        order: 3,
        props: {
          type: 'numbers',
          items: [
            { label: 'Inscritos', value: '10.000+' },
            { label: 'Taxa de Abertura', value: '45%' },
            { label: 'Nota Média', value: '4.8/5' },
          ],
        },
        styles: {
          padding: '40px 20px',
          backgroundColor: 'hsl(40,20%,97%)',
        },
      },
    ],
  },
  {
    id: 'produto-1',
    name: 'Lançamento de Produto',
    category: 'produto',
    description: 'Landing page completa para lançamento de produto com pricing',
    isPublished: false,
    createdAt: new Date().toISOString(),
    settings: {
      title: 'Novo Produto',
      metaDescription: 'Conheça nosso novo produto',
    },
    components: [
      {
        id: 'hero-5',
        type: 'hero',
        order: 1,
        props: {
          title: 'O Futuro do Marketing Está Aqui',
          subtitle: 'Plataforma completa de automação de marketing com IA',
          ctaText: 'Começar Grátis',
          alignment: 'center',
        },
        styles: {
          backgroundColor: 'hsl(35,60%,55%)',
          padding: '120px 20px',
          color: 'white',
        },
      },
      {
        id: 'features-4',
        type: 'features',
        order: 2,
        props: {
          title: 'Recursos Poderosos',
          features: [
            { icon: 'Zap', title: 'Automação Inteligente', description: 'Workflows que se adaptam ao comportamento do lead' },
            { icon: 'TrendingUp', title: 'Analytics Avançado', description: 'Dashboards em tempo real com insights acionáveis' },
            { icon: 'Users', title: 'Segmentação Precisa', description: 'Micro-segmentação baseada em comportamento e dados' },
            { icon: 'Mail', title: 'E-mail Marketing', description: 'Editor visual e templates responsivos' },
            { icon: 'MessageSquare', title: 'WhatsApp Integrado', description: 'Envio em massa e chatbots inteligentes' },
            { icon: 'Target', title: 'Landing Pages', description: 'Construtor drag-and-drop sem código' },
          ],
        },
        styles: {
          padding: '80px 20px',
          backgroundColor: 'white',
        },
      },
      {
        id: 'pricing-1',
        type: 'pricing',
        order: 3,
        props: {
          title: 'Planos Para Cada Necessidade',
          tiers: [
            {
              name: 'Starter',
              price: 'R$ 199',
              period: '/mês',
              features: ['Até 1.000 contatos', '5 usuários', 'E-mail marketing', 'Suporte por email'],
              ctaText: 'Começar Grátis',
            },
            {
              name: 'Professional',
              price: 'R$ 499',
              period: '/mês',
              features: ['Até 10.000 contatos', '15 usuários', 'Todos os recursos', 'Suporte prioritário', 'WhatsApp integrado'],
              highlighted: true,
              ctaText: 'Teste 14 Dias Grátis',
            },
            {
              name: 'Enterprise',
              price: 'Personalizado',
              features: ['Contatos ilimitados', 'Usuários ilimitados', 'Onboarding dedicado', 'Suporte 24/7', 'API customizada'],
              ctaText: 'Falar com Vendas',
            },
          ],
        },
        styles: {
          padding: '80px 20px',
          backgroundColor: 'hsl(40,20%,97%)',
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        order: 4,
        props: {
          title: 'Perguntas Frequentes',
          items: [
            { question: 'Preciso de cartão de crédito para o trial?', answer: 'Não! Você pode testar gratuitamente por 14 dias sem precisar cadastrar cartão.' },
            { question: 'Posso cancelar a qualquer momento?', answer: 'Sim, sem burocracias. Cancele quando quiser pelo painel.' },
            { question: 'Tem suporte em português?', answer: 'Sim, nossa equipe de suporte fala português e está disponível por chat, email e telefone.' },
            { question: 'Os dados são seguros?', answer: 'Sim, usamos criptografia de ponta e somos compliance com LGPD.' },
          ],
        },
        styles: {
          padding: '60px 20px',
        },
      },
      {
        id: 'cta-1',
        type: 'cta',
        order: 5,
        props: {
          title: 'Pronto Para Começar?',
          subtitle: 'Junte-se a milhares de empresas que já transformaram seu marketing',
          ctaText: 'Começar Agora Grátis',
          ctaSecondaryText: 'Agendar Demo',
        },
        styles: {
          backgroundColor: 'hsl(18,30%,25%)',
          padding: '80px 20px',
          color: 'white',
          textAlign: 'center',
        },
      },
    ],
  },
];

export const EMPTY_TEMPLATE: LandingPageTemplate = {
  id: 'blank',
  name: 'Página em Branco',
  category: 'produto',
  description: 'Comece do zero com uma página em branco',
  isPublished: false,
  createdAt: new Date().toISOString(),
  settings: {
    title: 'Nova Landing Page',
  },
  components: [],
};
