'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { SocialLinkProviderProps } from '@/types';
import { TdesignLogoWechatStroke } from '@/components/icon/wechat';
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  MailIcon,
} from 'lucide-react';
import { WhatsappIcon } from '../icon/whatsapp';
import { AkarIconsTelegramFill } from '../icon/telegram';
import { useTranslations } from 'next-intl';

import { SocialInput } from '@/components/ui/social-input';
import { useData } from '@/lib/context/link-context';
import { ScrollArea } from '../ui/scroll-area';

const socialLinksProvider: SocialLinkProviderProps[] = [
  { name: 'facebook', icon: FacebookIcon, id: 'f', placeholder: '' },
  { name: 'twitter', icon: TwitterIcon, id: 't', placeholder: '' },
  { name: 'instagram', icon: InstagramIcon, id: 'ig', placeholder: '' },
  {
    name: 'telegram',
    icon: AkarIconsTelegramFill,
    id: 'tg',
    placeholder: '',
  },
  { name: 'youtube', icon: YoutubeIcon, id: 'y', placeholder: '' },
  { name: 'email', icon: MailIcon, id: 'e', placeholder: '' },
  { name: 'github', icon: GithubIcon, id: 'gh', placeholder: '' },
  { name: 'linkedin', icon: LinkedinIcon, id: 'l', placeholder: '' },
  {
    name: 'whatsapp',
    icon: WhatsappIcon,
    id: 'w',
    placeholder: 'wa.me/+34627620232',
  },
  {
    name: 'wechat',
    icon: TdesignLogoWechatStroke,
    id: 'wc',
    placeholder: 'wechat id',
  },
];

export const iconMap: { [key: string]: React.ElementType } = Object.fromEntries(
  socialLinksProvider.map((social: any) => [social.id, social.icon]),
);

export default function SocialLinksForm() {
  const t = useTranslations('SocialLinksForm');

  const { data, updateSocialInfo } = useData();

  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateSocialInfo(name, value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle className="text-xl">{t('Title')}</CardTitle>
        <CardDescription className="!mt-0">{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ScrollArea
          className={
            '!-m-1 p-1 max-sm:masked-full h-[12.6rem] md:h-full !overflow-y-scroll md:!overflow-hidden w-full'
          }
        >
          <div className="grid gap-4 md:grid-cols-2 py-1 h-full !-mb-4 pb-4">
            {socialLinksProvider.map((link: any) => {
              let value: any = data?.[link.id as keyof typeof data] || null;
              if (!link?.id) return null;
              // if (!link?.id || !value) return null;
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
      </CardContent>
    </Card>
  );
}
