import React, { useState } from 'react';
import { Pencil, Check, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditableButtonProps {
  text: string;
  link?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onTextChange: (text: string) => void;
  onLinkChange?: (link: string) => void;
  onVariantChange?: (variant: string) => void;
  className?: string;
  isEditing?: boolean;
}

export function EditableButton({
  text,
  link = '#',
  variant = 'primary',
  size = 'md',
  onTextChange,
  onLinkChange,
  onVariantChange,
  className = '',
  isEditing: parentIsEditing = false,
}: EditableButtonProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editLink, setEditLink] = useState(link);

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all';
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
      secondary: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      ghost: 'text-primary hover:bg-primary/10',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const handleSaveText = () => {
    onTextChange(editText);
    setIsEditingText(false);
  };

  const handleSaveLink = () => {
    onLinkChange?.(editLink);
    setIsEditingLink(false);
  };

  const handleCancelText = () => {
    setEditText(text);
    setIsEditingText(false);
  };

  const handleCancelLink = () => {
    setEditLink(link);
    setIsEditingLink(false);
  };

  if (isEditingText) {
    return (
      <div className="inline-flex items-center gap-2">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveText();
            if (e.key === 'Escape') handleCancelText();
          }}
          className="w-auto min-w-[200px]"
          autoFocus
        />
        <button
          onClick={handleSaveText}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancelText}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isEditingLink) {
    return (
      <div className="inline-flex flex-col gap-2 p-3 bg-card/95 backdrop-blur-md border-2 border-primary rounded-lg shadow-2xl">
        <Label className="text-xs">Link URL</Label>
        <div className="flex items-center gap-2">
          <Input
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveLink();
              if (e.key === 'Escape') handleCancelLink();
            }}
            placeholder="https://..."
            className="min-w-[300px]"
            autoFocus
          />
          <button
            onClick={handleSaveLink}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancelLink}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block group/button">
      <a
        href={link}
        className={`${getButtonClasses()} ${
          parentIsEditing ? 'cursor-pointer' : ''
        }`}
        onClick={(e) => {
          if (parentIsEditing) {
            e.preventDefault();
          }
        }}
      >
        {text}
      </a>
      
      {parentIsEditing && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover/button:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingText(true);
            }}
            className="p-1.5 bg-primary text-primary-foreground rounded shadow-lg hover:bg-primary/90 transition-colors"
            title="Edit text"
          >
            <Pencil className="w-3 h-3" />
          </button>
          {onLinkChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingLink(true);
              }}
              className="p-1.5 bg-primary text-primary-foreground rounded shadow-lg hover:bg-primary/90 transition-colors"
              title="Edit link"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
