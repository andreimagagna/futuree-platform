import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  placeholder?: string;
  maxLength?: number;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onFinishEdit?: () => void;
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  as = 'p',
  className = '',
  placeholder = 'Click to edit',
  maxLength,
  isEditing: parentIsEditing = false,
  onStartEdit,
  onFinishEdit,
  multiline = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const Component = as;

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    if (parentIsEditing) {
      e.stopPropagation();
      setIsEditing(true);
      onStartEdit?.();
    }
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
    onFinishEdit?.();
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    onFinishEdit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            className={`${className} w-full border-2 border-primary rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none`}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            className={`${className} w-full border-2 border-primary rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50`}
          />
        )}
        <div className="absolute -right-20 top-0 flex gap-1">
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Save (Enter)"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Cancel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {maxLength && (
          <div className="text-xs text-muted-foreground mt-1">
            {editValue.length}/{maxLength}
          </div>
        )}
      </div>
    );
  }

  return (
    <Component
      className={`${className} ${
        parentIsEditing
          ? 'cursor-text hover:bg-primary/5 hover:outline hover:outline-2 hover:outline-primary/30 rounded transition-all relative group'
          : ''
      }`}
      onClick={handleStartEdit}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      {parentIsEditing && (
        <Pencil className="w-3 h-3 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground p-0.5 rounded transition-opacity" />
      )}
    </Component>
  );
}
