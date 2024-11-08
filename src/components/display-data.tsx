'use client';

import React from 'react';
import type { DataProps, DisplayDataProps } from '@/types';
import ExtraLinksCard from '@/components/extra-links-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { names } from '@/types';
import { iconMap } from './forms/social-links-form';
import { IconWrapper } from './ui/social-input';
import { SaveVcf } from './client/save-as-vcf';
import { useParams } from 'next/navigation';
import Link from 'next/link';

function getInitials(firstName: string = '', lastName: string = '') {
  // Check if the name is Chinese
  const isChinese = /[\u4e00-\u9fa5]/.test(firstName + lastName);

  if (isChinese) {
    const fullName = lastName + firstName; // Combine last and first name
    if (fullName.length === 2) {
      return fullName; // For 2-character Chinese names, return full name
    } else {
      return lastName; // For 3 or more characters, return last name only
    }
  } else {
    // Handle non-Chinese names (assumed to be in English)
    const initials = (firstName[0] || '') + (lastName[0] || '');
    return initials.length > 3
      ? initials.slice(0, 3).toUpperCase()
      : initials.toUpperCase();
  }
}

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

  const excludedKeys = ['i', 'n', 'd', 'bg', 'ln', 'em', 'p'];

  const { locale, defaultLocale } = useParams();
  const lang = locale || defaultLocale;
  let firstname = acc?.n || '';
  let lastname = acc?.ln || '';
  let fullname =
    lang === 'zh' ? lastname + firstname : firstname + ' ' + lastname;
  console.log(acc);

  return (
    <div className="hide_scrollbar mx-auto size-full max-w-lg space-y-8 overflow-y-scroll p-4">
      <div className="z-50 text-center flex flex-col items-center">
        <div className="rounded-full relative">
          <SaveVcf data={acc} variant="icon" cta={''} />

          {acc.i && (
            <Avatar className="size-24 shadow border">
              <AvatarImage
                alt={fullname}
                src={acc?.i}
                className="size-full object-cover"
              />
              <AvatarFallback className="font-monoo font-bold text-lg">
                {getInitials(firstname, lastname)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        {acc.n && (
          <h1 className="mt-4 text-2xl font-bold text-slate-800">{acc.n}</h1>
        )}
        {acc.d && <p className="mt-2 text-sm text-slate-600">{acc.d}</p>}
      </div>
      {!allSocialLinksAreEmpty && (
        <div className="flex flex-wrap items-center justify-center gap-1">
          {Object.entries(acc)
            .filter(([key]) => !excludedKeys.includes(key)) // 过滤掉 excludedKeys 中的键
            .map(([key, value]: [string, any]) => {
              if (key !== 'ls' && value && !excludedKeys.includes(key)) {
                const propIcon = iconMap[key as string];
                const link =
                  key === 'e'
                    ? `mailto:${value}`
                    : key === 'w'
                      ? `https://wa.me/${value}`
                      : value;
                const target = key === 'w' ? '_blank' : '_self';
                const rel = key === 'w' ? 'noopener noreferrer' : '';
                let name =
                  typeof names[key as keyof typeof names] !== 'string'
                    ? // @ts-ignore
                      names[key as keyof typeof names]?.name
                    : key;

                return (
                  <span className="p-2" key={key}>
                    <Link
                      href={link}
                      target={target}
                      rel={rel}
                      className="social-link-icon"
                    >
                      {propIcon ? (
                        <IconWrapper className="size-6" Icon={propIcon} />
                      ) : (
                        <span>{name}</span>
                      )}
                    </Link>
                  </span>
                );
              }
              return null;
            })}
        </div>
      )}
      <ul className="space-y-2 overflow-visible">
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
