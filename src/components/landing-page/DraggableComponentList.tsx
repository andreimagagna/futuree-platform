import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { LandingPageComponent } from '@/types/LandingPage';

interface SortableItemProps {
  component: LandingPageComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children: React.ReactNode;
}

function SortableItem({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  children,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        isSelected ? 'ring-4 ring-blue-600 ring-offset-4 shadow-2xl' : ''
      }`}
    >
      {/* Drag Handle & Actions Toolbar */}
      <div className="absolute -left-14 top-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 cursor-grab active:cursor-grabbing bg-white shadow-lg"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 shadow-lg"
          onClick={onSelect}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 shadow-lg"
          onClick={onDuplicate}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="h-8 shadow-lg"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Component Content */}
      <div onClick={onSelect} className="cursor-pointer">
        {children}
      </div>
    </div>
  );
}

interface DraggableComponentListProps {
  components: LandingPageComponent[];
  selectedComponentId?: string;
  onReorder: (components: LandingPageComponent[]) => void;
  onSelectComponent: (component: LandingPageComponent) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (component: LandingPageComponent) => void;
  renderComponent: (component: LandingPageComponent) => React.ReactNode;
}

export function DraggableComponentList({
  components,
  selectedComponentId,
  onReorder,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  renderComponent,
}: DraggableComponentListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      const newComponents = arrayMove(components, oldIndex, newIndex);
      
      // Update order property
      const reorderedComponents = newComponents.map((comp, index) => ({
        ...comp,
        order: index + 1,
      }));

      onReorder(reorderedComponents);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={components.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {components.map((component) => (
            <SortableItem
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={() => onSelectComponent(component)}
              onDelete={() => onDeleteComponent(component.id)}
              onDuplicate={() => onDuplicateComponent(component)}
            >
              {renderComponent(component)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
