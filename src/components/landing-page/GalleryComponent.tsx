import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  url: string;
  title?: string;
  description?: string;
}

interface GalleryComponentProps {
  props: {
    images?: GalleryImage[];
    layout?: 'grid' | 'carousel' | 'masonry';
    columns?: number;
    showThumbnails?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    showCaptions?: boolean;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onEdit?: () => void;
}

export function GalleryComponent({ props, styles, isEditing, onEdit }: GalleryComponentProps) {
  const {
    images = [],
    layout = 'grid',
    columns = 3,
    showThumbnails = true,
    autoplay = false,
    autoplayInterval = 3000,
    showCaptions = true,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  React.useEffect(() => {
    if (layout === 'carousel' && autoplay && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [layout, autoplay, autoplayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div
        style={styles}
        onClick={isEditing ? onEdit : undefined}
        className={`relative ${isEditing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="bg-muted rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Adicione imagens à galeria</p>
          </div>
        </div>
        {isEditing && (
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Galeria
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
        {/* Grid Layout */}
        {layout === 'grid' && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.title || `Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {showCaptions && (image.title || image.description) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      {image.title && <h3 className="font-semibold">{image.title}</h3>}
                      {image.description && (
                        <p className="text-sm text-white/90">{image.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Carousel Layout */}
        {layout === 'carousel' && (
          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].title || `Image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {showCaptions && (images[currentIndex].title || images[currentIndex].description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  {images[currentIndex].title && (
                    <h3 className="font-semibold text-lg mb-1">{images[currentIndex].title}</h3>
                  )}
                  {images[currentIndex].description && (
                    <p className="text-sm text-white/90">{images[currentIndex].description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Thumbnails */}
            {showThumbnails && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-muted hover:bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Masonry Layout */}
        {layout === 'masonry' && (
          <div
            className="columns-1 md:columns-2 lg:columns-3 gap-4"
            style={{ columnCount: columns }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative break-inside-avoid mb-4 cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={image.title || `Image ${index + 1}`}
                    className="w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {showCaptions && (image.title || image.description) && (
                  <div className="mt-2">
                    {image.title && <h3 className="font-semibold text-sm">{image.title}</h3>}
                    {image.description && (
                      <p className="text-xs text-muted-foreground">{image.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
          >
            <ChevronRight className="w-6 h-6 rotate-45" />
          </button>
          <img
            src={images[selectedImage].url}
            alt={images[selectedImage].title || `Image ${selectedImage + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Galeria
          </span>
        </div>
      )}
    </div>
  );
}
