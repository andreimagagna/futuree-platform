import React from 'react';

interface GlassOverlayProps {
  show: boolean;
  icon?: React.ReactNode;
  title: string;
  description: string;
  variant?: 'warning' | 'info' | 'success' | 'primary';
}

export function GlassOverlay({ 
  show, 
  icon, 
  title, 
  description,
  variant = 'info' 
}: GlassOverlayProps) {
  if (!show) return null;

  const borderColors = {
    warning: 'border-warning',
    info: 'border-blue-500',
    success: 'border-green-500',
    primary: 'border-primary',
  };

  const textColors = {
    warning: 'text-warning',
    info: 'text-blue-500',
    success: 'text-green-500',
    primary: 'text-primary',
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/30 cursor-not-allowed pointer-events-auto">
      <div className={`bg-card/95 backdrop-blur-md border-2 ${borderColors[variant]} shadow-2xl rounded-lg p-8 max-w-md text-center pointer-events-none animate-in fade-in zoom-in duration-300`}>
        {icon && (
          <div className={`h-16 w-16 mx-auto mb-4 ${textColors[variant]}`}>
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
