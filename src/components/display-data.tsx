'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { FacebookIcon, ImageIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react';
import type { DataProps, DisplayDataProps } from '@/types';
import ExtraLinksCard from '@/components/extra-links-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { names } from '@/types';

export default function DisplayData({ acc }: DisplayDataProps) {
  const allSocialLinksAreEmpty =
    !acc.f &&
    !acc.t &&
    !acc.ig &&
    !acc.tg &&
    !acc.w &&
    !acc.y &&
    !acc.e &&
    !acc.gh &&
    !acc.l;

  const iconMap: Record<string, string> = {
    f: 'ph:facebook-logo-duotone',
    t: 'ph:twitter-logo-duotone',
    ig: 'ph:instagram-logo-duotone',
    tg: 'ph:telegram-logo-duotone',
    w: 'ph:whatsapp-logo-duotone',
    y: 'ph:youtube-logo-duotone',
    e: 'ph:envelope-duotone',
    gh: 'ph:github-logo-duotone',
    l: 'ph:linkedin-logo-duotone',
  };
  const iconsMap: Record<string, any> = {
    f: <FacebookIcon/>,
    t: <TwitterIcon/>,
    ig: <InstagramIcon/>,
    // tg: <TelegramIcon/>,
    // w: <WhatsappIcon/>,
    y: <YoutubeIcon/>,
    e: 'ph:envelope-duotone',
    // gh: 'ph:github-logo-duotone',
    l: 'ph:linkedin-logo-duotone',
  };
  const excludedKeys = ['i', 'n', 'd', 'bg'];
  return (
    <div className="hide_scrollbar mx-auto size-full max-w-lg space-y-8 overflow-y-scroll p-2">
      <div className="z-50 text-center">
        {acc.i && (
          <Avatar className="mx-auto size-20 overflow-hidden rounded-full ring ring-slate-200">
            <AvatarImage
              src={acc.i}
              alt={`${acc.n}'s profile picture`}
              className="size-full object-cover"
            />
            <AvatarFallback>
              <ImageIcon className="size-8 text-gray-300" />
            </AvatarFallback>
          </Avatar>
        )}
        {acc.n && (
          <h1 className="mt-4 text-2xl font-bold text-slate-800">{acc.n}</h1>
        )}
        {acc.d && <p className="mt-2 text-sm text-slate-600">{acc.d}</p>}
      </div>
      {!allSocialLinksAreEmpty && (
        <div className="flex flex-wrap items-center justify-center">
          {Object.entries(acc)
   .filter(([key]) => !excludedKeys.includes(key)) // 过滤掉 excludedKeys 中的键
   .map(([key, value]: [string, any]) => {
              

              if (key !== 'ls' && value && !excludedKeys.includes(key)) {
                const propIcon = iconMap[key];
                if (key === 'e') {
                  // Handle email link generation
                  return (
                    <span className="p-1" key={key}>
                      <a href={`mailto:${value}`}>
                        <Icon icon={propIcon} className="size-6" />
                      </a>
                    </span>
                  );
                } else if (key === 'w') {
                  // Handle WhatsApp link generation
                  const whatsappValue: string = value.startsWith(
                    'https://wa.me/',
                  )
                    ? value // If it already starts with the correct prefix
                    : `https://wa.me/${value}`;

                  return (
                    <span className="p-1" key={key}>
                      <a
                        href={whatsappValue}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon={propIcon} className="size-6" />
                      </a>
                    </span>
                  );
                } else {
                  return (
                    <span className="p-1" key={key}>
                      <a href={value} target="_blank" rel="noopener noreferrer">
                      {propIcon ? (
    <Icon icon={propIcon} className="size-6" />
) : (
    (() => {
        const value = names[key as keyof typeof names];
        if (typeof value === 'string') {
            return value; // Return the string value directly
        } else if (typeof value === 'object' && value !== null) {
            return value.name; // Return the name property from the object
        }
        return null; // Handle the case where value is undefined or null
    })()
)}

                      </a>
                    </span>
                  );
                }
              }
              return null;
            },
          )}
        </div>
      )}
      <ul className="space-y-2">
        {acc.ls &&
          acc.ls.map((link, id) => (
            <ExtraLinksCard
              label={link.l}
              icon={link.i}
              url={link.u}
              key={id}
            />
          ))}
      </ul>
    </div>
  );
}
