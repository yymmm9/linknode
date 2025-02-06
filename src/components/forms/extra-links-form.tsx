'use client';

import React from 'react';
import type { ExtraLinkProps } from '@/types';
import { Button } from '@/components/ui/button';
import type { DragEndEvent } from '@dnd-kit/core';
import { useData } from '@/lib/context/link-context';
import SortableLinks from '@/components/sortable-links';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function ExtraLinksForm() {
  const t = useTranslations('ExtraLinksForm');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const scrollDownRef = React.useRef<HTMLDivElement | null>(null);

  const [shouldScroll, setShouldScroll] = React.useState(false);
  const { data, addNewData, updateIndex } = useData();

  // 防御性处理：确保 data.ls 始终是一个数组
  const safeLinks = data.ls || [];

  const addLinkDetailForm = () => {
    const newLink: ExtraLinkProps = {
      id: Date.now(),
      i: '',
      l: '',
      u: '',
      ls: [], // 添加空的嵌套链接数组
    };
    addNewData(newLink);
    setShouldScroll(true);
  };

  React.useEffect(() => {
    if (shouldScroll && scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  // "handleDragEnd" function written by chatGPT
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const updatedItems = [...safeLinks]; // Accessing items from the context
      const draggedItem = updatedItems.find((item) => item.id === active.id);
      const targetItem = updatedItems.find((item) => item.id === over?.id);

      const draggedIndex = updatedItems.indexOf(draggedItem!);
      const targetIndex = updatedItems.indexOf(targetItem!);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove the dragged item from its original position
        updatedItems.splice(draggedIndex, 1);
        // Insert the dragged item at the target position
        updatedItems.splice(targetIndex, 0, draggedItem!);

        updateIndex(updatedItems);
      }
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center justify-between text-xl">
            {t('Title')}
          </CardTitle>
          <CardDescription>{t('Description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={safeLinks.map((link) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              {safeLinks
                .filter((link) => link.id > 1 || link.l || link.u)
                .map((link, index) => (
                  <SortableLinks key={link.id} id={link} index={index} />
                ))}
            </SortableContext>
          </DndContext>
          <Button variant={'outline'} onClick={() => addLinkDetailForm()}>
            +
          </Button>
        </CardContent>
      </Card>
      <div ref={scrollDownRef}></div>
    </>
  );
}
