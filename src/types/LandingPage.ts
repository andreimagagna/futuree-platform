// Tipos para o Editor de Landing Pages

export type ComponentType = 
  | 'hero'
  | 'hero-fullscreen'
  | 'bento-grid'
  | 'interactive-showcase'
  | 'stats-counter'
  | 'form'
  | 'text'
  | 'image'
  | 'video'
  | 'testimonial'
  | 'features'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'countdown'
  | 'social-proof'
  | 'spacer'
  | 'divider'
  | 'columns';

export type TemplateCategory = 
  | 'saas'
  | 'produto'
  | 'marketing'
  | 'webinar'
  | 'ebook'
  | 'demo'
  | 'newsletter'
  | 'servico'
  | 'evento';

export interface LandingPageComponent {
  id: string;
  type: ComponentType;
  order?: number;
  props: Record<string, any>;
  styles?: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
    [key: string]: any;
  };
}

export interface LandingPageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnail?: string;
  description: string;
  palette?: string;
  typography?: string;
  components: LandingPageComponent[];
  settings?: LandingPageSettings;
  createdAt?: string;
  isPublished?: boolean;
}

export interface LandingPageSettings {
  title: string;
  metaDescription?: string;
  favicon?: string;
  ogImage?: string;
  customCSS?: string;
  customJS?: string;
  analytics?: {
    googleAnalytics?: string;
    facebookPixel?: string;
    linkedInInsight?: string;
  };
  seo?: {
    keywords?: string[];
    canonical?: string;
  };
  integrations?: {
    crmWebhook?: string;
    emailProvider?: string;
    zapierWebhook?: string;
  };
}

export interface LandingPageVersion {
  id: string;
  landingPageId: string;
  name: string;
  components: LandingPageComponent[];
  traffic: number; // percentage
  metrics: {
    views: number;
    submissions: number;
    conversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
  };
  createdAt: string;
  isActive: boolean;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select, radio
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  };
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  alignment: 'left' | 'center' | 'right';
  overlay?: boolean;
  overlayOpacity?: number;
}

export interface TestimonialProps {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating?: number;
}

export interface FeatureProps {
  icon?: string;
  title: string;
  description: string;
}

export interface PricingTierProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  ctaLink?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CountdownProps {
  targetDate: string;
  title?: string;
  expiredMessage?: string;
}

export interface SocialProofProps {
  type: 'logos' | 'numbers' | 'reviews';
  items: Array<{
    logo?: string;
    label?: string;
    value?: string;
  }>;
}
