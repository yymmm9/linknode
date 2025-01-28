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

interface ShortenerButtonProps {
  destination: string;
  customDomain?: string;
  shortLink?: string;
  tags?: string[];
  disabled?: boolean;
  className?: string;
  handleCreateLink?: () => Promise<void>;
}

export default function ShortenerButtonClient({
  destination,
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        // Store link data for post-signup restoration
        LinkCreationStore.setLinkData({
          destination,
          customDomain,
          shortLink,
          tags
        });
        
        // Redirect to signup with locale and next path
        router.push(`/${locale}/signup?next=/${locale}/create`);
        return;
      }

      // If external handleCreateLink is provided, use it
      if (handleCreateLink) {
        await handleCreateLink();
        return;
      }

      // Default link creation logic
      // TODO: Implement default link creation logic
    } catch (error) {
      console.error('Link creation error:', error);
    } finally {
      setIsLoading(false);
    }
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
                  handleCreateLink={handleSubmit} 
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
                handleCreateLink={handleSubmit} 
              />
            )}
          </DrawerContent>
        </Drawer.Root>
      )}
    </>
  )
}
