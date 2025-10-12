import React, { useState } from 'react';
import { EditableText } from './EditableText';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQComponentV2Props {
  props: {
    title?: string;
    subtitle?: string;
    items: FAQItem[];
    defaultExpanded?: boolean;
    showNumbers?: boolean;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

function SortableFAQItem({
  item,
  index,
  isEditing,
  showNumbers,
  onUpdate,
  onRemove,
}: {
  item: FAQItem;
  index: number;
  isEditing: boolean;
  showNumbers: boolean;
  onUpdate: (updated: FAQItem) => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isEditing ? 'ring-1 ring-primary/30 hover:ring-2 hover:ring-primary' : ''}`}
    >
      {/* Drag Handle */}
      {isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20"
        >
          <div className="bg-primary text-primary-foreground p-2 rounded shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Delete Button */}
      {isEditing && (
        <button
          onClick={onRemove}
          className="absolute -right-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <div className="bg-red-500 text-white p-2 rounded shadow-lg hover:bg-red-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </div>
        </button>
      )}

      {/* FAQ Item Card */}
      <div className="border rounded-lg bg-card/80 backdrop-blur-sm overflow-hidden hover:shadow-md hover:bg-card/90 transition-all duration-300">
        {/* Question Header */}
        <button
          onClick={() => !isEditing && setIsExpanded(!isExpanded)}
          className={`w-full p-4 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors ${
            isEditing ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          {showNumbers && (
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
          )}
          
          <div className="flex-grow">
            <EditableText
              value={item.question}
              onChange={(value) => onUpdate({ ...item, question: value })}
              as="h3"
              className="text-lg font-semibold"
              placeholder="Pergunta frequente..."
              maxLength={150}
              isEditing={isEditing}
            />
          </div>

          {!isEditing && (
            <ChevronDown
              className={`flex-shrink-0 w-5 h-5 transition-transform ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
            />
          )}
        </button>

        {/* Answer Body */}
        {(isExpanded || isEditing) && (
          <div className="px-4 pb-4 border-t bg-muted/20">
            <div className={showNumbers ? 'pl-9' : ''}>
              <EditableText
                value={item.answer}
                onChange={(value) => onUpdate({ ...item, answer: value })}
                as="p"
                className="text-muted-foreground pt-3"
                placeholder="Resposta detalhada..."
                maxLength={500}
                isEditing={isEditing}
                multiline
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FAQComponentV2({
  props,
  styles,
  isEditing = false,
  onUpdate,
}: FAQComponentV2Props) {
  const {
    title = 'Perguntas Frequentes',
    subtitle = 'Tire suas dúvidas',
    items = [],
    showNumbers = true,
  } = props;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = [...items];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    onUpdate?.({ ...props, items: newItems });
  };

  const updateItem = (index: number, updated: FAQItem) => {
    const newItems = [...items];
    newItems[index] = updated;
    onUpdate?.({ ...props, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate?.({ ...props, items: newItems });
  };

  const addItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'Nova pergunta?',
      answer: 'Resposta aqui...',
    };
    onUpdate?.({ ...props, items: [...items, newItem] });
  };

  return (
    <div style={styles} className="container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        {subtitle && (
          <EditableText
            value={subtitle}
            onChange={(value) => onUpdate?.({ ...props, subtitle: value })}
            as="p"
            className="text-sm font-semibold uppercase tracking-wider text-primary mb-3"
            placeholder="Subtítulo..."
            maxLength={50}
            isEditing={isEditing}
          />
        )}
        <EditableText
          value={title}
          onChange={(value) => onUpdate?.({ ...props, title: value })}
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
          placeholder="Título da seção..."
          maxLength={80}
          isEditing={isEditing}
        />
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <SortableFAQItem
                    key={item.id}
                    item={item}
                    index={index}
                    isEditing={isEditing}
                    showNumbers={showNumbers}
                    onUpdate={(updated) => updateItem(index, updated)}
                    onRemove={() => removeItem(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <SortableFAQItem
                key={item.id}
                item={item}
                index={index}
                isEditing={false}
                showNumbers={showNumbers}
                onUpdate={(updated) => updateItem(index, updated)}
                onRemove={() => {}}
              />
            ))}
          </div>
        )}

        {/* Add New Button */}
        {isEditing && (
          <button
            onClick={addItem}
            className="mt-6 w-full p-4 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-primary font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Adicionar Pergunta
          </button>
        )}

        {items.length === 0 && !isEditing && (
          <div className="text-center py-12 border-2 border-dashed border-primary/30 rounded-lg">
            <p className="text-muted-foreground">
              Nenhuma pergunta ainda
            </p>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg font-semibold border border-blue-400/50">
            ❓ FAQ - Arraste para reordenar, clique + para adicionar
          </span>
        </div>
      )}
    </div>
  );
}
