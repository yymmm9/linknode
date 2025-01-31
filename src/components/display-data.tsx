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
import { useLocale } from 'next-intl';
import ContactDrawer from './contact-drawer';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

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

// 格式化姓名的函数
function formatName(firstName?: string, lastName?: string, locale?: string): string {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName || '';
  if (!lastName) return firstName || '';
  
  return locale === 'zh' 
    ? `${lastName}${firstName}` 
    : `${firstName} ${lastName}`;
}

export default function DisplayData({ acc }: DisplayDataProps) {
  const { locale } = useParams();
  const t = useTranslations('ProfileForm');
  const localeValue = useLocale();

  // 优化信息检查逻辑，使用更简洁的方法
  const hasNoInformation = React.useMemo(() => {
    const infoFields = [
      acc?.n, 
      acc?.ln, 
      acc?.ti, 
      acc?.o, 
      acc?.r, 
      acc?.d
    ];
    return infoFields.every(field => !field || field.trim() === '');
  }, [acc]);

  // 如果没有信息，渲染邀请添加信息的界面
  if (hasNoInformation) {
    return (
      <div className="hide_scrollbar mx-auto size-full max-w-lg space-y-8 overflow-y-scroll p-4 text-center">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700">
            {t('NoInformationTitle')}
          </h2>
          
          <p className="text-gray-500 max-w-xs">
            {t('NoInformationDescription')}
          </p>
          
          <Link 
            href={`/${locale}/profile`}
            className="mt-4"
          >
            {t('AddInformation')}
          </Link>
        </div>
      </div>
    );
  }

  // 重构社交链接检查逻辑
  const socialLinks = [
    acc.f, acc.t, acc.ig, acc.tg, 
    acc.gh, acc.l, acc.e, acc.w, acc.y
  ];
  const allSocialLinksAreEmpty = socialLinks.every(link => !link);

  // 姓名处理逻辑
  const firstname = acc?.firstName || acc?.n || '';
  const lastname = acc?.lastName || acc?.ln || '';
  const fullname = formatName(firstname, lastname, localeValue);

  return (
    <div className="hide_scrollbar mx-auto size-full max-w-lg space-y-8 overflow-y-scroll p-4">
      <div className="z-50 text-center flex flex-col items-center">
        {/* 头像和个人信息渲染 */}
        <div className="relative mb-4">
          <SaveVcf 
            acc={acc}
            variant="icon" 
            cta={''} 
          />

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
        </div>
        
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {fullname}
          </h1>

          {/* 职业信息渲染 */}
          {(acc.ti || acc.o || acc.r) && (
            <div className="mt-1 text-sm text-slate-600">
              {acc.ti && <span>{acc.ti}</span>}
              {acc.o && (
                <>
                  {acc.ti && <span className="mx-2 opacity-50">·</span>}
                  <span>{acc.o}</span>
                </>
              )}
              {acc.r && (
                <>
                  {(acc.ti || acc.o) && <span className="mx-2 opacity-50">·</span>}
                  <span>{acc.r}</span>
                </>
              )}
            </div>
          )}

          {/* 个人描述 */}
          {acc.d && <p className="mt-2 text-sm text-slate-600">{acc.d}</p>}
        </div>
      </div>

      {/* 社交链接渲染 */}
      {!allSocialLinksAreEmpty && (
        <div className="flex flex-wrap items-center justify-center gap-1">
          {Object.entries(acc)
            .filter(([key]) => !['i', 'n', 'd', 'bg', 'ln', 'em', 'p', 'o', 'ti', 'r'].includes(key)) // 过滤掉 excludedKeys 中的键
            .map(([key, value]: [string, any]) => {
              if (key !== 'ls' && value && !['i', 'n', 'd', 'bg', 'ln', 'em', 'p', 'o', 'ti', 'r'].includes(key)) {
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

                // 如果是微信，使用 ContactDrawer
                if (key === 'wc') {
                  return (
                    <span className="p-2" key={key}>
                      {propIcon && (
                        <ContactDrawer
                          toCopy={value}
                          info="微信号："
                          title={`添加 ${fullname} 的微信`}
                          description="扫码或复制微信号添加好友"
                          variant="outline"
                          cta={
                            <div className="social-link-icon">
                              <IconWrapper className="size-6" Icon={propIcon} />
                            </div>
                          }
                        />
                      )}
                    </span>
                  );
                }

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

      {/* 其他组件渲染 */}
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
