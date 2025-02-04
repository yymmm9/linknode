'use client';

import React from 'react';
import { Drawer } from 'vaul';
import useWindow from '@/hooks/use-window';
import { Info, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/context/link-context';
import { useAPIResponse } from '@/lib/context/api-response-context';
import { DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import CreateShortlinkForm from '@/components/forms/create-shortlink-form';
import DeleteShortlinkForm from '@/components/forms/delete-shortlink-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LinkCreationStore } from '@/stores/link-creation-store';
import useUser from '@/app/hook/useUser';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import createShortLink from '@/app/_actions/shortlink/create';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
// import { CreateShortlinkFormData } from '@/types';  // 引入类型定义

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 安全的类型转换函数
const safeStringConvert = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

// 安全的链接数据创建函数
const createSafeFormData = (
  user: any, 
  destination: string, 
  customDomain?: string, 
  shortLink?: string
): any => {
  // 防御性地获取用户元数据
  const metadata = user?.user_metadata ?? {};

  return {
    url: destination || '',
    domain: customDomain ?? '',
    shortLink: shortLink ?? '',
    n: safeStringConvert(metadata.firstName),
    ln: safeStringConvert(metadata.lastName)
  };
};

interface ShortenerButtonProps {
  destination?: string;
  customDomain?: string;
  shortLink?: string;
  tags?: string[];
  disabled?: boolean;
  className?: string;
  handleCreateLink?: () => Promise<void>;
}

export default function ShortenerButtonClient({
  destination = '',
  customDomain,
  shortLink,
  tags,
  disabled,
  className,
  handleCreateLink,
}: ShortenerButtonProps) {
  const t = useTranslations('ShortenerButton');
  const locale = useLocale();

  const { data } = useData();
  const { isDesktop } = useWindow();
  const [isLoading, setIsLoading] = React.useState(false);
  const { setSomeResponseInfo, setAuthKey, setProjectSlug, setShortedLink } = useAPIResponse();

  const { data: user } = useUser();
  const router = useRouter();

  const { shortedLink, isOpen, setOpen } = useAPIResponse();

  const handleInfoClick = (link: string) => {
    window.open(link, '_blank');
  };


  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <LinkIcon className="mr-2 size-4" />
              {t('shortener')}
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="overflow-hidden p-0 sm:max-w-[450px]"
          >
            <CardHeader className="p-6 pb-0">
              <CardTitle className="flex select-none items-center justify-between text-xl">
                {t('powered-by-dub-co')}
                <Info
                  onClick={() => handleInfoClick('https://on.hov.sh/')}
                  className="size-4 cursor-pointer text-muted-foreground hover:text-accent-foreground active:scale-95"
                />
              </CardTitle>
              <CardDescription>
                {t('shorten-your-link-with-dub-co-and-get-full-control-over-it')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-6 pt-0">
              {shortedLink ? (
                <DeleteShortlinkForm />
              ) : (
                <CreateShortlinkForm 
                  // handleCreateLink={handleSubmit} 
                />
              )}
            </CardContent>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root open={isOpen} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button className="w-full">
              <LinkIcon className="mr-2 size-4" />
              {t('shortener-0')}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-max p-6">
            <CardHeader className="p-0 pb-4 pt-1">
              <CardTitle className="flex select-none items-center justify-between p-0 text-lg">
                {t('powered-by-dub-co-0')}
                {/* <Info
                  onClick={() => handleInfoClick('https://on.hov.sh/')}
                  className="size-4 cursor-pointer text-muted-foreground hover:text-accent-foreground active:scale-95"
                /> */}
              </CardTitle>
              <CardDescription>
                {t('shorten-your-link-with-dub-co-and-get-full-control-over-it-0')}
              </CardDescription>
            </CardHeader>
            {shortedLink ? (
              <DeleteShortlinkForm />
            ) : (
              <CreateShortlinkForm 
                // handleCreateLink={handleSubmit} 
              />
            )}
          </DrawerContent>
        </Drawer.Root>
      )}
    </>
  )
}
