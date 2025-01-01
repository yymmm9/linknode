'use client';

import { useEffect, useState, useCallback } from 'react';
import { decodeData } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import retrieveShortLink from '@/app/_actions/shortlink/retrieve';
import updateShortLink from '@/app/_actions/shortlink/update';
import { useTranslations } from 'next-intl';
import BackgroundShell from './backgrounds/background-shell';
import ExtraLinksForm from './forms/extra-links-form';
import ProfileForm from './forms/profile-form';
import SocialLinksForm from './forms/social-links-form';
import { useData } from '@/lib/context/link-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EditShortLink({ linkKey: key }: { linkKey: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('EditShortLink');
  const { data, setData } = useData();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resetState = useCallback(() => {
    setHasFetchedData(false);
    setIsLoading(false);
    setData(null);
  }, [setData]);

  const fetchData = useCallback(async () => {
    if (!key || hasFetchedData || !isMounted) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await retrieveShortLink(key);

      if (!result?.data?.url) {
        toast.error(t('FetchError'));
        return;
      }

      const params = new URLSearchParams(result.data.url.split('?')[1]);
      const rawData = params.get('data');
      
      if (!rawData) {
        toast.error(t('FetchError'));
        return;
      }

      const decodedData = decodeData(rawData);
      if (decodedData) {
        setData(decodedData);
        setHasFetchedData(true);
      } else {
        toast.error(t('FetchError'));
      }
    } catch (error) {
      toast.error(t('FetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [key, hasFetchedData, setData, t, isMounted]);

  const handleDrawerChange = useCallback((open: boolean) => {
    if (!open) {
      resetState();
    }
    setIsDrawerOpen(open);
  }, [resetState]);

  useEffect(() => {
    if (isDrawerOpen && isMounted) {
      fetchData();
    }
  }, [isDrawerOpen, fetchData, isMounted]);

  const updateLink = useCallback(async () => {
    if (!key || !data || !isMounted) {
      toast.error(t('NoDataToUpdate'));
      return;
    }

    try {
      setIsLoading(true);
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const updateUrl = `${window.location.protocol}//${window.location.host}?data=${encodedData}`;

      const result = await updateShortLink({
        id: key,
        url: updateUrl,
      });

      if (result.success) {
        toast.success(t('UpdateSuccess'));
        handleDrawerChange(false);
        router.refresh();
      } else {
        toast.error(result.error || t('UpdateFailed'));
      }
    } catch (error) {
      toast.error(t('UpdateFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [key, data, t, handleDrawerChange, router, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerChange}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => handleDrawerChange(true)}
        >
          {t('edit')}
        </Button>
      </DrawerTrigger>
      
      {isDrawerOpen && (
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{t('edit-short-link')}</DrawerTitle>
              <DrawerDescription>
                {t('modify-your-short-link-settings')}
              </DrawerDescription>
            </DrawerHeader>

            <div className="max-h-[calc(75vh-10rem)] overflow-y-auto px-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  {t('loading')}...
                </div>
              ) : data ? (
                <div className="flex w-full flex-col gap-5">
                  <ProfileForm />
                  <SocialLinksForm />
                  <ExtraLinksForm />
                  <BackgroundShell />
                </div>
              ) : (
                <div className="flex items-center justify-center p-4">
                  {t('no-data-available')}
                </div>
              )}
            </div>

            <DrawerFooter className="mt-4">
              <div className="flex w-full gap-2">
                <Button
                  className="flex-1"
                  onClick={updateLink}
                  disabled={isLoading || !data}
                >
                  {isLoading ? t('updating') : t('submit')}
                </Button>
                <DrawerClose asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDrawerChange(false)}
                  >
                    {t('cancel')}
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
}
