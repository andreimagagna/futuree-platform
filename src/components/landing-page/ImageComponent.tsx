import React from 'react';

interface ImageComponentProps {
  props: {
    src?: string;
    alt?: string;
    width?: number;
    alignment?: 'left' | 'center' | 'right';
    caption?: string;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function ImageComponent({ props, styles, isEditing, onEdit }: ImageComponentProps) {
  const { 
    src = 'https://via.placeholder.com/800x400?text=Adicione+sua+imagem', 
    alt = 'Imagem',
    width = 100,
    alignment = 'center',
    caption
  } = props;

  const alignmentClasses = {
    left: 'mx-0',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className={alignmentClasses[alignment]} style={{ width: `${width}%` }}>
          <img
            src={src}
            alt={alt}
            className="w-full h-auto rounded-lg shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Erro+ao+carregar+imagem';
            }}
          />
          {caption && (
            <p className="text-sm text-muted-foreground mt-2 text-center italic">
              {caption}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Imagem
          </span>
        </div>
      )}
    </div>
  );
}
