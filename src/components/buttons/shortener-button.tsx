'use client';

import React from 'react';
import { Drawer } from 'vaul';
import useWindow from '@/hooks/use-window';
import { isEmptyValues } from '@/lib/utils';
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

interface ShortenerButtonProps {
  destination: string;
  customDomain?: string;
  shortLink?: string;
  tags?: string[];
  disabled?: boolean;
  className?: string;
  onCreateLink?: (data: {
    destination: string;
    customDomain?: string;
    shortLink?: string;
    tags?: string[];
  }) => Promise<void>;
}

export default function ShortenerButtonClient({
  destination,
  customDomain,
  shortLink,
  tags,
  disabled,
  className,
  onCreateLink,
}: ShortenerButtonProps) {
  const t = useTranslations('ShortenerButton');

  const { isDesktop } = useWindow();
  const { data } = useData();
  const isEmpty = isEmptyValues(data);
  const { shortedLink, isOpen, setOpen } = useAPIResponse();
  const router = useRouter();
  const { data: user } = useUser();

  const handleInfoClick = (link: string) => {
    window.open(link, '_blank');
  };

  const handleCreateLink = async () => {
    if (!user) {
      // Store link data for post-signup restoration
      LinkCreationStore.setLinkData({
        destination,
        customDomain,
        shortLink,
        tags,
      });

      // Redirect to signup/login
      router.push('/signup');
      return;
    }

    // If onCreateLink prop is provided, use it
    if (onCreateLink) {
      await onCreateLink({
        destination,
        customDomain,
        shortLink,
        tags,
      });
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
            // showClose={false}
          >
            <CardHeader className="p-6  pb-0">
              <CardTitle className="flex select-none items-center justify-between text-xl">
                {t('powered-by-dub-co')}
                <Info
                  onClick={() => handleInfoClick('https://on.hov.sh/')}
                  className="size-4 cursor-pointer text-muted-foreground hover:text-accent-foreground active:scale-95"
                />
              </CardTitle>
              <CardDescription>
                {t(
                  'shorten-your-link-with-dub-co-and-get-full-control-over-it',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-6 pt-0">
              {isEmpty ? (
                <Button className="w-full">
                  {t('can-and-39-t-short-link-with-empty-fields')}
                </Button>
              ) : shortedLink ? (
                <DeleteShortlinkForm />
              ) : (
                <CreateShortlinkForm handleCreateLink={handleCreateLink} />
              )}
            </CardContent>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root>
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
                <Info
                  onClick={() => handleInfoClick('https://on.hov.sh/')}
                  className="size-4 cursor-pointer text-muted-foreground hover:text-accent-foreground active:scale-95"
                />
              </CardTitle>
              <CardDescription>
                {t(
                  'shorten-your-link-with-dub-co-and-get-full-control-over-it-0',
                )}
              </CardDescription>
            </CardHeader>
            {isEmpty ? (
              <Button className="w-full">
                {t('can-and-39-t-short-link-with-empty-fields-0')}
              </Button>
            ) : shortedLink ? (
              <DeleteShortlinkForm />
            ) : (
              <CreateShortlinkForm handleCreateLink={handleCreateLink} />
            )}
          </DrawerContent>
        </Drawer.Root>
      )}
    </>
  );
}
