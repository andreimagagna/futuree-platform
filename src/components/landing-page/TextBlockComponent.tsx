import React from 'react';

interface TextBlockComponentProps {
  props: {
    content?: string;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function TextBlockComponent({ props, styles, isEditing, onEdit }: TextBlockComponentProps) {
  const { content = 'Digite seu texto aqui...', alignment = 'left', fontSize = 'base', fontWeight = 'normal' } = props;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <div
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        <p className={`${alignmentClasses[alignment]} ${fontSizeClasses[fontSize]} ${fontWeightClasses[fontWeight]}`}>
          {content}
        </p>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Text
          </span>
        </div>
      )}
    </div>
  );
}
