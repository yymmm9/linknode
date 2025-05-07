// @ts-nocheck
'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/lib/context/link-context';
import type { ExtraLinkProps } from '@/types';
import { Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SortableLinksProps {
  id: ExtraLinkProps;
  index: number;
}

export default function SortableLinks({ id, index }: SortableLinksProps) {
  const t = useTranslations('SortableLinks');
  const uniqueID = id.id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueID });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { data, updateAdditionalInfo } = useData();

  return (
    <div ref={setNodeRef} style={style} key={uniqueID}>
      <Card className="relative p-4">
        <div className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="hidden">
              <div className="grid gap-2">
                <Label htmlFor={`link-icon-${uniqueID}`}>{t('iconKey')}</Label>
                <Input
                  id={`link-icon-${uniqueID}`}
                  name="i"
                  type="text"
                  placeholder={t('placeholderIcon')}
                  value={id.i}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newLinks = [...data.ls];
                    if (newLinks && index >= 0 && newLinks[index]) {
                      newLinks[index].i = e.target.value;
                    } else {
                      console.error(
                        'Error updating link icon:',
                        index,
                        newLinks,
                      );
                    }
                    updateAdditionalInfo(newLinks);
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`link-name-${uniqueID}`}>{t('label')}</Label>
              <Input
                id={`link-name-${uniqueID}`}
                name="l"
                type="text"
                placeholder={t('placeholderLabel')}
                value={id.l}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newLinks = [...data.ls];
                  if (newLinks && newLinks[index]) {
                    newLinks[index].l = e.target.value;
                  }
                  updateAdditionalInfo(newLinks);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`link-name-${uniqueID}`}>{t('destinationUrl')}</Label>
              <Input
                id={`link-url-${uniqueID}`}
                name="u"
                type="url"
                placeholder={t('placeholderUrl')}
                value={id.u}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newLinks = [...data.ls];
                  if (newLinks && newLinks[index]) {
                    newLinks[index].u = e.target.value;
                  }
                  updateAdditionalInfo(newLinks);
                }}
              />
            </div>

          </div>
        </div>
        <div className="absolute -top-2 right-5 bg-white flex gap-2">
          <button
            onClick={() => {
              const newLinks = [...data.ls]; // 创建数组副本
              newLinks.splice(index, 1); // 删除指定索引的元素
              updateAdditionalInfo(newLinks);
            }}
          >
            <Trash2Icon className="size-4" />
          </button>
          <button
            // className="absolute -top-2 right-5 bg-white"
            {...attributes}
            {...listeners}
          >
            <svg viewBox="0 0 20 20" width="15">
              <path
                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                transform="rotate(-90,10,10)"
                fill={'currentcolor'}
              ></path>
            </svg>
          </button>
        </div>
      </Card>
    </div>
  );
}
