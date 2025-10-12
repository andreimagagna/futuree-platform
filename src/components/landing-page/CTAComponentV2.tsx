import React, { useState } from 'react';
import { EditableText } from './EditableText';
import { EditableButton } from './EditableButton';

interface CTAComponentV2Props {
  props: {
    title?: string;
    subtitle?: string;
    description?: string;
    primaryCTA?: string;
    primaryCTALink?: string;
    secondaryCTA?: string;
    secondaryCTALink?: string;
    backgroundImage?: string;
    overlayOpacity?: number;
    overlayColor?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

export function CTAComponentV2({
  props,
  styles,
  isEditing = false,
  onUpdate,
}: CTAComponentV2Props) {
  const {
    title = 'Pronto Para Começar?',
    subtitle = 'Junte-se a milhares de clientes satisfeitos',
    description = 'Comece seu teste gratuito hoje mesmo. Sem cartão de crédito necessário.',
    primaryCTA = 'Começar Agora',
    primaryCTALink = '#',
    secondaryCTA = 'Falar com Vendas',
    secondaryCTALink = '#',
    backgroundImage,
    overlayOpacity = 0.7,
    overlayColor = '#000000',
    alignment = 'center',
  } = props;

  const [showImageUpload, setShowImageUpload] = useState(false);

  const updateProp = (key: string, value: any) => {
    onUpdate?.({
      ...props,
      [key]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateProp('backgroundImage', event.target?.result);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div
      style={styles}
      className="relative overflow-hidden"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}

      {/* Overlay with glassmorphism */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundColor: overlayColor,
          opacity: backgroundImage ? overlayOpacity : 0,
        }}
      />

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 flex flex-col ${alignmentClasses[alignment]} gap-6`}>
        {/* Glass container para o conteúdo */}
        <div className={`w-full max-w-4xl ${backgroundImage ? 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl' : ''}`}>
        {/* Subtitle */}
        {subtitle && (
          <EditableText
            value={subtitle}
            onChange={(value) => updateProp('subtitle', value)}
            as="p"
            className="text-sm sm:text-base font-semibold uppercase tracking-wider opacity-90"
            placeholder="Subtítulo aqui..."
            maxLength={80}
            isEditing={isEditing}
          />
        )}

        {/* Title */}
        <EditableText
          value={title}
          onChange={(value) => updateProp('title', value)}
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl"
          placeholder="Título do CTA..."
          maxLength={100}
          isEditing={isEditing}
        />

        {/* Description */}
        {description && (
          <EditableText
            value={description}
            onChange={(value) => updateProp('description', value)}
            as="p"
            className="text-lg sm:text-xl opacity-90 max-w-2xl"
            placeholder="Descrição..."
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
        </div> {/* Close glass container */}
      </div> {/* Close content container */}

      {/* Editor Controls */}
      {isEditing && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {/* Background Image Upload */}
          <div className="relative">
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="bg-blue-500/90 backdrop-blur-md text-white px-3 py-2 rounded shadow-lg hover:bg-blue-600/90 transition-colors flex items-center gap-2 text-sm font-semibold border border-blue-400/50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
              </svg>
              {backgroundImage ? 'Trocar Fundo' : 'Adicionar Fundo'}
            </button>
            {showImageUpload && (
              <div className="absolute top-full mt-2 right-0 bg-card/95 backdrop-blur-md border-2 border-primary shadow-2xl rounded-lg p-4 w-64">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm mb-3"
                />
                {backgroundImage && (
                  <button
                    onClick={() => {
                      updateProp('backgroundImage', undefined);
                      setShowImageUpload(false);
                    }}
                    className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    Remover Fundo
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Overlay Controls */}
          {backgroundImage && (
            <div className="bg-card border-2 border-primary shadow-lg rounded-lg p-3 flex flex-col gap-2">
              <label className="text-xs font-semibold">Overlay Opacity:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={overlayOpacity}
                onChange={(e) => updateProp('overlayOpacity', parseFloat(e.target.value))}
                className="w-32"
              />
              <span className="text-xs">{Math.round(overlayOpacity * 100)}%</span>
              
              <label className="text-xs font-semibold mt-2">Overlay Color:</label>
              <input
                type="color"
                value={overlayColor}
                onChange={(e) => updateProp('overlayColor', e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          )}

          {/* Info Badge */}
          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg font-semibold h-fit border border-blue-400/50">
            🎯 CTA Section
          </span>
        </div>
      )}
    </div>
  );
}
