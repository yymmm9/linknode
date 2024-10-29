import React, { Suspense } from 'react';
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
import { SocialLinksFormClient } from './social-links-CLIENT';

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

// export default function SocialLinksForm() {
//   return (

//     // <NextIntlClientProvider
//     // locale=''
//     //   messages={
//     //     // … and provide the relevant messages
//     //     messages
//     //     // pick(messages, 'SocialLinksForm')
//     //   }
//     // >
//     //   <SocialLinksFormC />
//     // </NextIntlClientProvider>
//   );
// }
export default function SocialLinksForm() {
  const t = useTranslations('SocialLinksForm');

  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle className="text-xl">{t('Title')}</CardTitle>
        <CardDescription className="!mt-0">{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent className="">
        {/* <Suspense>
          <SocialLinksFormClient socialLinksProvider={socialLinksProvider} />
        </Suspense> */}
      </CardContent>
    </Card>
  );
}
