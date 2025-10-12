import React from 'react';

interface ColumnItem {
  type: 'text' | 'image' | 'cta';
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface Column {
  width: number; // 1-12 (grid columns)
  items: ColumnItem[];
  verticalAlign?: 'top' | 'center' | 'bottom';
}

interface ColumnsComponentProps {
  props: {
    columns?: Column[];
    gap?: number;
    mobileStack?: boolean;
    reverseOnMobile?: boolean;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function ColumnsComponent({ props, styles, isEditing, onEdit }: ColumnsComponentProps) {
  const {
    columns = [],
    gap = 4,
    mobileStack = true,
    reverseOnMobile = false,
  } = props;

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'top':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'bottom':
        return 'items-end';
      default:
        return 'items-start';
    }
  };

  if (columns.length === 0) {
    return (
      <div
        style={styles}
        onClick={isEditing ? onEdit : undefined}
        className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="bg-muted rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Configure as colunas</p>
          </div>
        </div>
        {isEditing && (
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Colunas
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`grid grid-cols-1 ${
            mobileStack ? 'md:grid-cols-12' : 'grid-cols-12'
          } ${reverseOnMobile ? 'flex-col-reverse md:flex-row' : ''}`}
          style={{ gap: `${gap * 0.25}rem` }}
        >
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`flex flex-col ${getAlignClass(column.verticalAlign)}`}
              style={{
                gridColumn: mobileStack
                  ? `md-start / span ${column.width}`
                  : `span ${column.width}`,
              }}
            >
              {column.items.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-4 last:mb-0">
                  {item.type === 'text' && item.content && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  )}
                  {item.type === 'image' && item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                  {item.type === 'cta' && item.buttonText && (
                    <a
                      href={item.buttonLink || '#'}
                      className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      {item.buttonText}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Colunas
          </span>
        </div>
      )}
    </div>
  );
}
