'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SocialInput } from '@/components/ui/social-input';
import { useData } from '@/lib/context/link-context';
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
import { ScrollArea } from '../ui/scroll-area';
import { useTranslations } from 'next-intl';

const t = useTranslations('SocialLinksForm');

const socialLinksProvider: SocialLinkProviderProps[] = [
  { name: t('facebook'), icon: FacebookIcon, id: 'f', placeholder: '' },
  { name: t('twitter'), icon: TwitterIcon, id: 't', placeholder: '' },
  { name: t('instagram'), icon: InstagramIcon, id: 'ig', placeholder: '' },
  {
    name: t('telegram'),
    icon: AkarIconsTelegramFill,
    id: 'tg',
    placeholder: '',
  },
  { name: t('youtube'), icon: YoutubeIcon, id: 'y', placeholder: '' },
  { name: t('email'), icon: MailIcon, id: 'e', placeholder: '' },
  { name: t('github'), icon: GithubIcon, id: 'gh', placeholder: '' },
  { name: t('linkedin'), icon: LinkedinIcon, id: 'l', placeholder: '' },
  {
    name: t('whatsapp'),
    icon: WhatsappIcon,
    id: 'w',
    placeholder: 'wa.me/+34627620232',
  },
  {
    name: t('wechat'),
    icon: TdesignLogoWechatStroke,
    id: 'wc',
    placeholder: 'wechat id',
  },
];

export const iconMap: { [key: string]: React.ElementType } = Object.fromEntries(
  socialLinksProvider.map((social: any) => [social.id, social.icon]),
);

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function SocialLinksForm() {
  const { data, updateSocialInfo } = useData();

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
            {socialLinksProvider.map((link) => {
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
                  value={data[link.id]}
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
