import React from 'react';
import { EditableText } from './EditableText';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesComponentV2Props {
  props: {
    title?: string;
    subtitle?: string;
    features: Feature[];
    layout?: 'grid' | 'list';
    columns?: 2 | 3 | 4;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

function SortableFeature({ 
  feature, 
  isEditing, 
  onUpdate 
}: { 
  feature: Feature; 
  isEditing: boolean; 
  onUpdate: (updated: Feature) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id });

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
          className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <div className="bg-primary text-primary-foreground p-2 rounded shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Feature Card */}
      <div className="p-6 rounded-lg border bg-card/80 backdrop-blur-sm hover:shadow-lg hover:bg-card/90 transition-all duration-300">
        {/* Icon */}
        <div className="text-4xl mb-4">{feature.icon}</div>

        {/* Title */}
        <EditableText
          value={feature.title}
          onChange={(value) => onUpdate({ ...feature, title: value })}
          as="h3"
          className="text-xl font-bold mb-3"
          placeholder="Título da feature..."
          maxLength={60}
          isEditing={isEditing}
        />

        {/* Description */}
        <EditableText
          value={feature.description}
          onChange={(value) => onUpdate({ ...feature, description: value })}
          as="p"
          className="text-muted-foreground"
          placeholder="Descrição da feature..."
          maxLength={200}
          isEditing={isEditing}
          multiline
        />
      </div>
    </div>
  );
}

export function FeaturesComponentV2({
  props,
  styles,
  isEditing = false,
  onUpdate,
}: FeaturesComponentV2Props) {
  const {
    title = 'Funcionalidades Poderosas',
    subtitle = 'Tudo que você precisa',
    features = [],
    layout = 'grid',
    columns = 3,
  } = props;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = features.findIndex((f) => f.id === active.id);
    const newIndex = features.findIndex((f) => f.id === over.id);

    const newFeatures = [...features];
    const [movedItem] = newFeatures.splice(oldIndex, 1);
    newFeatures.splice(newIndex, 0, movedItem);

    onUpdate?.({ ...props, features: newFeatures });
  };

  const updateFeature = (index: number, updated: Feature) => {
    const newFeatures = [...features];
    newFeatures[index] = updated;
    onUpdate?.({ ...props, features: newFeatures });
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

      {/* Features Grid */}
      {isEditing ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={features.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <div className={`grid gap-8 ${layout === 'grid' ? gridCols[columns] : 'grid-cols-1'}`}>
              {features.map((feature, index) => (
                <SortableFeature
                  key={feature.id}
                  feature={feature}
                  isEditing={isEditing}
                  onUpdate={(updated) => updateFeature(index, updated)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={`grid gap-8 ${layout === 'grid' ? gridCols[columns] : 'grid-cols-1'}`}>
          {features.map((feature, index) => (
            <SortableFeature
              key={feature.id}
              feature={feature}
              isEditing={false}
              onUpdate={(updated) => updateFeature(index, updated)}
            />
          ))}
        </div>
      )}

      {isEditing && features.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-primary/30 rounded-lg">
          <p className="text-muted-foreground">
            ➕ Adicione features usando o painel lateral
          </p>
        </div>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg font-semibold border border-blue-400/50">
            🎨 Features - Arraste para reordenar
          </span>
        </div>
      )}
    </div>
  );
}
