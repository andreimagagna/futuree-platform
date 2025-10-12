import React from 'react';
import { EditableText } from './EditableText';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialComponentV2Props {
  props: {
    title?: string;
    subtitle?: string;
    testimonials: Testimonial[];
    layout?: 'grid' | 'carousel' | 'single';
    columns?: 2 | 3 | 4;
    showRating?: boolean;
    showAvatar?: boolean;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

function SortableTestimonial({
  testimonial,
  isEditing,
  showRating = true,
  showAvatar = true,
  onUpdate,
}: {
  testimonial: Testimonial;
  isEditing: boolean;
  showRating: boolean;
  showAvatar: boolean;
  onUpdate: (updated: Testimonial) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const updateRating = (newRating: number) => {
    onUpdate({ ...testimonial, rating: newRating });
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
          className="absolute -left-8 top-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20"
        >
          <div className="bg-primary text-primary-foreground p-2 rounded shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Testimonial Card */}
      <div className="p-6 rounded-lg border bg-card/80 backdrop-blur-sm hover:shadow-lg hover:bg-card/90 transition-all duration-300 h-full flex flex-col">
        {/* Rating Stars */}
        {showRating && (
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => isEditing && updateRating(star)}
                disabled={!isEditing}
                className={`text-xl transition-colors ${
                  star <= (testimonial.rating || 5)
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                } ${isEditing ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
        )}

        {/* Quote */}
        <EditableText
          value={testimonial.quote}
          onChange={(value) => onUpdate({ ...testimonial, quote: value })}
          as="p"
          className="text-lg italic mb-6 flex-grow"
          placeholder="Depoimento do cliente..."
          maxLength={300}
          isEditing={isEditing}
          multiline
        />

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {showAvatar && (
            <div className="relative group/avatar">
              {testimonial.avatar ? (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {testimonial.author.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Name and Role */}
          <div className="flex-grow">
            <EditableText
              value={testimonial.author}
              onChange={(value) => onUpdate({ ...testimonial, author: value })}
              as="p"
              className="font-bold"
              placeholder="Nome do autor"
              maxLength={50}
              isEditing={isEditing}
            />
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <EditableText
                value={testimonial.role}
                onChange={(value) => onUpdate({ ...testimonial, role: value })}
                as="span"
                placeholder="Cargo"
                maxLength={50}
                isEditing={isEditing}
              />
              {testimonial.company && (
                <>
                  <span>•</span>
                  <EditableText
                    value={testimonial.company}
                    onChange={(value) => onUpdate({ ...testimonial, company: value })}
                    as="span"
                    placeholder="Empresa"
                    maxLength={50}
                    isEditing={isEditing}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialComponentV2({
  props,
  styles,
  isEditing = false,
  onUpdate,
}: TestimonialComponentV2Props) {
  const {
    title = 'O Que Nossos Clientes Dizem',
    subtitle = 'Depoimentos reais',
    testimonials = [],
    layout = 'grid',
    columns = 3,
    showRating = true,
    showAvatar = true,
  } = props;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex((t) => t.id === active.id);
    const newIndex = testimonials.findIndex((t) => t.id === over.id);

    const newTestimonials = [...testimonials];
    const [movedItem] = newTestimonials.splice(oldIndex, 1);
    newTestimonials.splice(newIndex, 0, movedItem);

    onUpdate?.({ ...props, testimonials: newTestimonials });
  };

  const updateTestimonial = (index: number, updated: Testimonial) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = updated;
    onUpdate?.({ ...props, testimonials: newTestimonials });
  };

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
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

      {/* Testimonials Grid */}
      {isEditing ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={testimonials.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className={`grid gap-8 ${layout === 'grid' ? gridCols[columns] : 'grid-cols-1'}`}>
              {testimonials.map((testimonial, index) => (
                <SortableTestimonial
                  key={testimonial.id}
                  testimonial={testimonial}
                  isEditing={isEditing}
                  showRating={showRating}
                  showAvatar={showAvatar}
                  onUpdate={(updated) => updateTestimonial(index, updated)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={`grid gap-8 ${layout === 'grid' ? gridCols[columns] : 'grid-cols-1'}`}>
          {testimonials.map((testimonial, index) => (
            <SortableTestimonial
              key={testimonial.id}
              testimonial={testimonial}
              isEditing={false}
              showRating={showRating}
              showAvatar={showAvatar}
              onUpdate={(updated) => updateTestimonial(index, updated)}
            />
          ))}
        </div>
      )}

      {isEditing && testimonials.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-primary/30 rounded-lg">
          <p className="text-muted-foreground">
            ➕ Adicione depoimentos usando o painel lateral
          </p>
        </div>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg font-semibold border border-blue-400/50">
            💬 Testimonials - Arraste para reordenar, clique nas estrelas para mudar rating
          </span>
        </div>
      )}
    </div>
  );
}
