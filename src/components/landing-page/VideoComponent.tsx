import React from 'react';

interface VideoComponentProps {
  props: {
    url?: string;
    type?: 'youtube' | 'vimeo' | 'direct';
    autoplay?: boolean;
    controls?: boolean;
    width?: number;
    alignment?: 'left' | 'center' | 'right';
    caption?: string;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function VideoComponent({ props, styles, isEditing, onEdit }: VideoComponentProps) {
  const { 
    url = '',
    type = 'youtube',
    autoplay = false,
    controls = true,
    width = 100,
    alignment = 'center',
    caption
  } = props;

  const alignmentClasses = {
    left: 'mx-0',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const getEmbedUrl = () => {
    if (!url) return '';
    
    if (type === 'youtube') {
      const videoId = url.includes('youtube.com') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&controls=${controls ? '1' : '0'}`;
    }
    
    if (type === 'vimeo') {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? '1' : '0'}&controls=${controls ? '1' : '0'}`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div
      style={styles}
      onClick={isEditing ? onEdit : undefined}
      className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className={alignmentClasses[alignment]} style={{ width: `${width}%` }}>
          {embedUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              {type === 'direct' ? (
                <video
                  src={embedUrl}
                  controls={controls}
                  autoPlay={autoplay}
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                />
              ) : (
                <iframe
                  src={embedUrl}
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Adicione uma URL de vídeo</p>
            </div>
          )}
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
            Vídeo
          </span>
        </div>
      )}
    </div>
  );
}
