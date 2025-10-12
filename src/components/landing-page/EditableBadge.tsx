import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EditableBadgeProps {
  text: string;
  onChange: (text: string) => void;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  isEditing?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export function EditableBadge({
  text,
  onChange,
  variant = 'default',
  isEditing: parentIsEditing = false,
  removable = false,
  onRemove,
}: EditableBadgeProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState(text);

  const getVariantClasses = () => {
    const variants = {
      default: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return variants[variant];
  };

  const handleSave = () => {
    if (editText.trim()) {
      onChange(editText.trim());
    }
    setIsEditingText(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditingText(false);
  };

  if (isEditingText) {
    return (
      <div className="inline-flex items-center gap-1">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className="h-7 w-auto min-w-[100px] text-sm"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getVariantClasses()} ${
        parentIsEditing ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all' : ''
      } group/badge`}
      onClick={(e) => {
        if (parentIsEditing) {
          e.stopPropagation();
          setIsEditingText(true);
        }
      }}
    >
      {text}
      {parentIsEditing && removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 opacity-0 group-hover/badge:opacity-100 hover:bg-black/10 rounded-full p-0.5 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
