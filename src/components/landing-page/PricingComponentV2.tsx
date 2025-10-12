import React from 'react';
import { EditableText } from './EditableText';
import { EditableButton } from './EditableButton';
import { EditableBadge } from './EditableBadge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
}

interface PricingComponentV2Props {
  props: {
    title?: string;
    subtitle?: string;
    tiers: PricingTier[];
    showAnnual?: boolean;
    guarantee?: string;
  };
  styles?: Record<string, any>;
  isEditing?: boolean;
  onUpdate?: (props: any) => void;
}

function SortablePricingTier({
  tier,
  isEditing,
  onUpdate,
}: {
  tier: PricingTier;
  isEditing: boolean;
  onUpdate: (updated: PricingTier) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...tier.features];
    newFeatures[index] = value;
    onUpdate({ ...tier, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = tier.features.filter((_, i) => i !== index);
    onUpdate({ ...tier, features: newFeatures });
  };

  const addFeature = () => {
    onUpdate({ ...tier, features: [...tier.features, 'Nova funcionalidade'] });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${tier.highlighted ? 'scale-105 z-10' : ''}`}
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

      {/* Pricing Card */}
      <div
        className={`relative p-8 rounded-2xl border-2 bg-card/80 backdrop-blur-sm h-full flex flex-col ${
          tier.highlighted
            ? 'border-primary shadow-2xl bg-card/95'
            : 'border-border hover:border-primary/50 hover:shadow-lg hover:bg-card/90 transition-all'
        } ${isEditing ? 'ring-1 ring-primary/30 hover:ring-2 hover:ring-primary' : ''}`}
      >
        {/* Badge */}
        {tier.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <EditableBadge
              text={tier.badge}
              onChange={(value) => onUpdate({ ...tier, badge: value })}
              variant={tier.highlighted ? 'warning' : 'default'}
              isEditing={isEditing}
              removable={isEditing}
              onRemove={() => onUpdate({ ...tier, badge: undefined })}
            />
          </div>
        )}

        {/* Plan Name */}
        <EditableText
          value={tier.name}
          onChange={(value) => onUpdate({ ...tier, name: value })}
          as="h3"
          className="text-2xl font-bold mb-2 text-center"
          placeholder="Nome do plano..."
          maxLength={30}
          isEditing={isEditing}
        />

        {/* Description */}
        <EditableText
          value={tier.description}
          onChange={(value) => onUpdate({ ...tier, description: value })}
          as="p"
          className="text-sm text-muted-foreground text-center mb-6"
          placeholder="Descrição do plano..."
          maxLength={100}
          isEditing={isEditing}
        />

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg font-semibold">R$</span>
            <EditableText
              value={tier.price}
              onChange={(value) => onUpdate({ ...tier, price: value })}
              as="span"
              className="text-5xl font-bold"
              placeholder="99"
              maxLength={10}
              isEditing={isEditing}
            />
            {tier.period && (
              <EditableText
                value={tier.period}
                onChange={(value) => onUpdate({ ...tier, period: value })}
                as="span"
                className="text-muted-foreground"
                placeholder="/mês"
                maxLength={20}
                isEditing={isEditing}
              />
            )}
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-8 flex-grow">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 group/feature">
              <span className="text-primary mt-1">✓</span>
              <EditableText
                value={feature}
                onChange={(value) => updateFeature(index, value)}
                as="span"
                className="flex-grow text-sm"
                placeholder="Funcionalidade..."
                maxLength={100}
                isEditing={isEditing}
              />
              {isEditing && (
                <button
                  onClick={() => removeFeature(index)}
                  className="opacity-0 group-hover/feature:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              )}
            </li>
          ))}
          {isEditing && (
            <li>
              <button
                onClick={addFeature}
                className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1"
              >
                <span className="text-lg">+</span> Adicionar funcionalidade
              </button>
            </li>
          )}
        </ul>

        {/* CTA Button */}
        <EditableButton
          text={tier.ctaText}
          link={tier.ctaLink}
          variant={tier.highlighted ? 'primary' : 'outline'}
          size="lg"
          onTextChange={(value) => onUpdate({ ...tier, ctaText: value })}
          onLinkChange={(value) => onUpdate({ ...tier, ctaLink: value })}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

export function PricingComponentV2({
  props,
  styles,
  isEditing = false,
  onUpdate,
}: PricingComponentV2Props) {
  const {
    title = 'Escolha Seu Plano',
    subtitle = 'Preços transparentes',
    tiers = [],
    guarantee = '💯 Garantia de 30 dias ou seu dinheiro de volta',
  } = props;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tiers.findIndex((t) => t.id === active.id);
    const newIndex = tiers.findIndex((t) => t.id === over.id);

    const newTiers = [...tiers];
    const [movedItem] = newTiers.splice(oldIndex, 1);
    newTiers.splice(newIndex, 0, movedItem);

    onUpdate?.({ ...props, tiers: newTiers });
  };

  const updateTier = (index: number, updated: PricingTier) => {
    const newTiers = [...tiers];
    newTiers[index] = updated;
    onUpdate?.({ ...props, tiers: newTiers });
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

      {/* Pricing Tiers */}
      {isEditing ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tiers.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
              {tiers.map((tier, index) => (
                <SortablePricingTier
                  key={tier.id}
                  tier={tier}
                  isEditing={isEditing}
                  onUpdate={(updated) => updateTier(index, updated)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
          {tiers.map((tier, index) => (
            <SortablePricingTier
              key={tier.id}
              tier={tier}
              isEditing={false}
              onUpdate={(updated) => updateTier(index, updated)}
            />
          ))}
        </div>
      )}

      {/* Guarantee */}
      {guarantee && (
        <div className="text-center">
          <EditableText
            value={guarantee}
            onChange={(value) => onUpdate?.({ ...props, guarantee: value })}
            as="p"
            className="text-lg font-semibold text-primary"
            placeholder="Garantia..."
            maxLength={100}
            isEditing={isEditing}
          />
        </div>
      )}

      {isEditing && tiers.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-primary/30 rounded-lg">
          <p className="text-muted-foreground">
            ➕ Adicione planos de pricing usando o painel lateral
          </p>
        </div>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded shadow-lg font-semibold border border-blue-400/50">
            💰 Pricing - Arraste para reordenar
          </span>
        </div>
      )}
    </div>
  );
}
