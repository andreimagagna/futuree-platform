import React from 'react';
import { EditableText } from './EditableText';
import { EditableButton } from './EditableButton';
import { EditableBadge } from './EditableBadge';

interface HeroComponentV2Props {
  props: {
    badge?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    primaryCTA?: string;
    primaryCTALink?: string;
    secondaryCTA?: string;
    secondaryCTALink?: string;
    alignment?: 'left' | 'center' | 'right';
    backgroundImage?: string;
    showBadge?: boolean;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
  onUpdate?: (props: any) => void;
}

export function HeroComponentV2({
  props,
  styles,
  isEditing = false,
  onEdit,
  onUpdate,
}: HeroComponentV2Props) {
  const {
    badge = '✨ Novidade 2025',
    title = 'Transforme Seu Negócio Hoje',
    subtitle = 'Soluções Inovadoras',
    description = 'Descubra ferramentas poderosas para impulsionar seus resultados',
    primaryCTA = 'Começar Agora',
    primaryCTALink = '#',
    secondaryCTA = 'Saiba Mais',
    secondaryCTALink = '#',
    alignment = 'center',
    backgroundImage,
    showBadge = true,
  } = props;

  const updateProp = (key: string, value: any) => {
    onUpdate?.({
      ...props,
      [key]: value,
    });
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div
      style={{
        ...styles,
        ...(backgroundImage && {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`container mx-auto px-4 flex flex-col ${alignmentClasses[alignment]} gap-6 max-w-4xl relative z-10`}>
        {/* Badge */}
        {showBadge && (
          <EditableBadge
            text={badge}
            onChange={(value) => updateProp('badge', value)}
            variant="success"
            isEditing={isEditing}
          />
        )}

        {/* Subtitle */}
        {subtitle && (
          <EditableText
            value={subtitle}
            onChange={(value) => updateProp('subtitle', value)}
            as="p"
            className="text-sm sm:text-base font-semibold uppercase tracking-wider opacity-90"
            placeholder="Subtítulo aqui..."
            maxLength={50}
            isEditing={isEditing}
          />
        )}

        {/* Title */}
        <EditableText
          value={title}
          onChange={(value) => updateProp('title', value)}
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          placeholder="Título principal aqui..."
          maxLength={100}
          isEditing={isEditing}
        />

        {/* Description */}
        {description && (
          <EditableText
            value={description}
            onChange={(value) => updateProp('description', value)}
            as="p"
            className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl"
            placeholder="Descrição aqui..."
            maxLength={200}
            isEditing={isEditing}
            multiline
          />
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mt-4">
          {primaryCTA && (
            <EditableButton
              text={primaryCTA}
              link={primaryCTALink}
              variant="primary"
              size="lg"
              onTextChange={(value) => updateProp('primaryCTA', value)}
              onLinkChange={(value) => updateProp('primaryCTALink', value)}
              isEditing={isEditing}
            />
          )}
          {secondaryCTA && (
            <EditableButton
              text={secondaryCTA}
              link={secondaryCTALink}
              variant="outline"
              size="lg"
              onTextChange={(value) => updateProp('secondaryCTA', value)}
              onLinkChange={(value) => updateProp('secondaryCTALink', value)}
              isEditing={isEditing}
            />
          )}
        </div>

        {/* Trust Indicators */}
        <div className={`flex flex-wrap gap-6 mt-8 opacity-75 ${
          alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">✓</span>
            <span>Teste grátis de 14 dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">✓</span>
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">✓</span>
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg font-semibold border border-blue-400/50">
            🎯 Hero Section - Click nos elementos para editar
          </span>
        </div>
      )}
    </div>
  );
}
