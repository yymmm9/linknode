'use client';

import React from 'react';
import { SocialInput } from '@/components/ui/social-input';
import { useData } from '@/lib/context/link-context';

import { ScrollArea } from '../ui/scroll-area';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export function SocialLinksFormClient({ socialLinksProvider }: any) {
  const { data, updateSocialInfo } = useData();

  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateSocialInfo(name, value);
  };

  return (
    <ScrollArea
      className={
        '!-m-1 p-1 max-sm:masked-full h-[12.6rem] md:h-full !overflow-y-scroll md:!overflow-hidden w-full'
      }
    >
      <div className="grid gap-4 md:grid-cols-2 py-1 h-full !-mb-4 pb-4">
        {socialLinksProvider.map((link: any) => {
          let value: any = data?.[link.id as keyof typeof data];
          if (!link?.id || !value) return;
          return (
            <SocialInput
              key={link.name}
              id={link.name}
              name={link.id}
              icon={link.icon}
              placeholder={
                link?.placeholder
                  ? link.placeholder
                  : `${link.name}.com/johndoe`
              }
              value={value}
              onChange={handleInputChange}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}
