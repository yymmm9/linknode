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
import { TdesignLogoWechatStroke } from "@/components/icon/wechat";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, MailIcon} from 'lucide-react';
import { WhatsappIcon } from '../icon/whatsapp';
import { AkarIconsTelegramFill } from '../icon/telegram';

const socialLinksProvider: SocialLinkProviderProps[] = [
  { name: 'facebook', icon: FacebookIcon, id: 'f', placeholder: ''},
  { name: 'twitter', icon: TwitterIcon, id: 't', placeholder: ''},
  { name: 'instagram', icon: InstagramIcon, id: 'ig', placeholder: ''},
  { name: 'telegram', icon: AkarIconsTelegramFill, id: 'tg', placeholder: ''},
  { name: 'youtube', icon: YoutubeIcon, id: 'y', placeholder: ''},
  { name: 'email', icon: MailIcon, id: 'e', placeholder: ''},
  { name: 'github', icon: GithubIcon, id: 'gh', placeholder: ''},
  { name: 'linkedin', icon: LinkedinIcon, id: 'l', placeholder: ''},
  { name: 'whatsapp', icon: WhatsappIcon, id: 'w', placeholder: 'wa.me/+34627620232'},
  { name: 'whatsapp', icon: TdesignLogoWechatStroke, id: 'wc', placeholder: 'wechat id'},
];

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function SocialLinksForm() {
  const { data, updateSocialInfo } = useData();

  const handleInputChange = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    updateSocialInfo(name, value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Social Links</CardTitle>
        <CardDescription>Enter your social media links here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {socialLinksProvider.map((link) => {
          return (
            <SocialInput
              key={link.name}
              id={link.name}
              name={link.id}
              icon={link.icon}
              placeholder={link?.placeholder ? link.placeholder :`${link.name}.com/johndoe`}
              value={data[link.id]}
              onChange={handleInputChange}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
