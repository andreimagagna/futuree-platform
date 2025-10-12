/**
 * Sistema de Edição Inline para Landing Page Builder
 * 
 * Este arquivo centraliza toda a lógica de edição inline, incluindo:
 * - Gerenciamento de estado de edição
 * - Toolbar flutuante com ferramentas de formatação
 * - Upload e crop de imagens inline
 * - Drag-and-drop de elementos
 * - Sincronização com PropertyEditor
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type EditMode = 'none' | 'text' | 'button' | 'badge' | 'image';

export interface EditState {
  componentId: string | null;
  elementId: string | null;
  mode: EditMode;
  position: { x: number; y: number } | null;
}

export interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: string;
  color?: string;
}

export interface InlineEditorContextValue {
  // Estado atual de edição
  editState: EditState;
  setEditState: (state: EditState) => void;
  
  // Formatação de texto
  formatting: TextFormatting;
  setFormatting: (formatting: TextFormatting) => void;
  applyFormatting: (format: Partial<TextFormatting>) => void;
  
  // Controles
  startEdit: (componentId: string, elementId: string, mode: EditMode, position?: { x: number; y: number }) => void;
  stopEdit: () => void;
  isEditing: (componentId: string, elementId?: string) => boolean;
  
  // Toolbar
  showToolbar: boolean;
  toolbarPosition: { x: number; y: number } | null;
  
  // Image upload
  uploadImage: (file: File) => Promise<string>;
  cropImage: (imageUrl: string, crop: any) => Promise<string>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const InlineEditorContext = createContext<InlineEditorContextValue | null>(null);

export function useInlineEditor() {
  const context = useContext(InlineEditorContext);
  if (!context) {
    throw new Error('useInlineEditor must be used within InlineEditorProvider');
  }
  return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

export function InlineEditorProvider({ children }: { children: React.ReactNode }) {
  const [editState, setEditState] = useState<EditState>({
    componentId: null,
    elementId: null,
    mode: 'none',
    position: null,
  });

  const [formatting, setFormatting] = useState<TextFormatting>({});
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);

  // ============================================================================
  // EDIT CONTROLS
  // ============================================================================

  const startEdit = useCallback(
    (componentId: string, elementId: string, mode: EditMode, position?: { x: number; y: number }) => {
      setEditState({
        componentId,
        elementId,
        mode,
        position: position || null,
      });
      setShowToolbar(mode === 'text');
      if (position) {
        setToolbarPosition(position);
      }
    },
    []
  );

  const stopEdit = useCallback(() => {
    setEditState({
      componentId: null,
      elementId: null,
      mode: 'none',
      position: null,
    });
    setShowToolbar(false);
    setToolbarPosition(null);
    setFormatting({});
  }, []);

  const isEditing = useCallback(
    (componentId: string, elementId?: string) => {
      if (editState.componentId !== componentId) return false;
      if (elementId && editState.elementId !== elementId) return false;
      return true;
    },
    [editState]
  );

  // ============================================================================
  // TEXT FORMATTING
  // ============================================================================

  const applyFormatting = useCallback((format: Partial<TextFormatting>) => {
    setFormatting((prev) => ({ ...prev, ...format }));
    
    // Aplicar formatação ao texto selecionado
    if (document.queryCommandSupported) {
      if (format.bold !== undefined) {
        document.execCommand('bold', false);
      }
      if (format.italic !== undefined) {
        document.execCommand('italic', false);
      }
      if (format.underline !== undefined) {
        document.execCommand('underline', false);
      }
      if (format.color) {
        document.execCommand('foreColor', false, format.color);
      }
    }
  }, []);

  // ============================================================================
  // IMAGE UPLOAD & CROP
  // ============================================================================

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const cropImage = useCallback(async (imageUrl: string, crop: any): Promise<string> => {
    // TODO: Implementar crop de imagem real
    // Por enquanto, retorna a URL original
    return imageUrl;
  }, []);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B = Bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        applyFormatting({ bold: !formatting.bold });
      }
      
      // Ctrl/Cmd + I = Italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        applyFormatting({ italic: !formatting.italic });
      }
      
      // Ctrl/Cmd + U = Underline
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        applyFormatting({ underline: !formatting.underline });
      }
      
      // Escape = Sair da edição
      if (e.key === 'Escape') {
        stopEdit();
      }
    };

    if (editState.mode !== 'none') {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [editState.mode, formatting, applyFormatting, stopEdit]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: InlineEditorContextValue = {
    editState,
    setEditState,
    formatting,
    setFormatting,
    applyFormatting,
    startEdit,
    stopEdit,
    isEditing,
    showToolbar,
    toolbarPosition,
    uploadImage,
    cropImage,
  };

  return (
    <InlineEditorContext.Provider value={value}>
      {children}
      {showToolbar && toolbarPosition && <FloatingToolbar />}
    </InlineEditorContext.Provider>
  );
}

// ============================================================================
// FLOATING TOOLBAR
// ============================================================================

function FloatingToolbar() {
  const { toolbarPosition, formatting, applyFormatting, stopEdit } = useInlineEditor();

  if (!toolbarPosition) return null;

  const buttonClass = (active: boolean) =>
    `p-2 rounded hover:bg-primary/10 transition-colors ${
      active ? 'bg-primary/20 text-primary' : 'text-foreground'
    }`;

  return (
    <div
      className="fixed z-50 bg-card/95 backdrop-blur-xl border-2 border-primary shadow-2xl rounded-lg p-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        left: toolbarPosition.x,
        top: toolbarPosition.y - 60,
      }}
    >
      {/* Bold */}
      <button
        onClick={() => applyFormatting({ bold: !formatting.bold })}
        className={buttonClass(!!formatting.bold)}
        title="Negrito (Ctrl+B)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
        </svg>
      </button>

      {/* Italic */}
      <button
        onClick={() => applyFormatting({ italic: !formatting.italic })}
        className={buttonClass(!!formatting.italic)}
        title="Itálico (Ctrl+I)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
        </svg>
      </button>

      {/* Underline */}
      <button
        onClick={() => applyFormatting({ underline: !formatting.underline })}
        className={buttonClass(!!formatting.underline)}
        title="Sublinhado (Ctrl+U)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Align Left */}
      <button
        onClick={() => applyFormatting({ align: 'left' })}
        className={buttonClass(formatting.align === 'left')}
        title="Alinhar à esquerda"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </button>

      {/* Align Center */}
      <button
        onClick={() => applyFormatting({ align: 'center' })}
        className={buttonClass(formatting.align === 'center')}
        title="Centralizar"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </button>

      {/* Align Right */}
      <button
        onClick={() => applyFormatting({ align: 'right' })}
        className={buttonClass(formatting.align === 'right')}
        title="Alinhar à direita"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Color Picker */}
      <input
        type="color"
        value={formatting.color || '#000000'}
        onChange={(e) => applyFormatting({ color: e.target.value })}
        className="w-8 h-8 rounded cursor-pointer"
        title="Cor do texto"
      />

      <div className="w-px h-6 bg-border mx-1" />

      {/* Close */}
      <button
        onClick={stopEdit}
        className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors"
        title="Fechar (Esc)"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>
    </div>
  );
}

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Hook para detectar seleção de texto e mostrar toolbar
 */
export function useTextSelection(elementId: string) {
  const { startEdit } = useInlineEditor();
  const [selectionTimeout, setSelectionTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) {
        if (selectionTimeout) clearTimeout(selectionTimeout);
        return;
      }

      // Aguardar 200ms antes de mostrar toolbar (evitar mostrar ao clicar)
      const timeout = setTimeout(() => {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        startEdit('current', elementId, 'text', {
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }, 200);

      setSelectionTimeout(timeout);
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      if (selectionTimeout) clearTimeout(selectionTimeout);
    };
  }, [elementId, startEdit, selectionTimeout]);
}
