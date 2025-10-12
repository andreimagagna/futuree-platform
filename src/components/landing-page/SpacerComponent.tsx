import React from 'react';

interface SpacerComponentProps {
  props: {
    height?: number;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function SpacerComponent({ props, styles, isEditing, onEdit }: SpacerComponentProps) {
  const { height = 40 } = props;

  return (
    <div
      style={{ ...styles, height: `${height}px` }}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2 bg-gray-100/50' : ''}`}
    >
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Espaço: {height}px
          </span>
        </div>
      )}
    </div>
  );
}
