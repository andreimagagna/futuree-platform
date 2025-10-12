import React from 'react';

interface DividerComponentProps {
  props: {
    thickness?: number;
    style?: 'solid' | 'dashed' | 'dotted';
    width?: number;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function DividerComponent({ props, styles, isEditing, onEdit }: DividerComponentProps) {
  const { thickness = 1, style = 'solid', width = 100 } = props;

  return (
    <div
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative py-4 ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        <hr
          style={{
            borderWidth: `${thickness}px 0 0 0`,
            borderStyle: style,
            borderColor: styles?.borderColor || 'currentColor',
            width: `${width}%`,
            margin: '0 auto',
          }}
          className="border-muted-foreground/20"
        />
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Divider
          </span>
        </div>
      )}
    </div>
  );
}
