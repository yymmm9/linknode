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

export default function EditShortLink({ linkKey: key }: { linkKey: string }) {
  console.log('[EditShortLink] Render with key:', key);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const t = useTranslations('EditShortLink');
  const { data, setData } = useData();

  const resetState = useCallback(() => {
    console.log('[EditShortLink] Resetting state...');
    setHasFetchedData(false);
    setIsLoading(false);
    setData(null);
  }, [setData]);

  const fetchData = useCallback(async () => {
    console.log('[fetchData] Starting with key:', key);
    
    if (!key || hasFetchedData) {
      console.log('[fetchData] Skipping fetch - no key or already fetched');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[fetchData] Fetching data from API...');
      
      const result = await retrieveShortLink(key);
      console.log('[fetchData] API response:', result);

      if (!result?.data?.url) {
        console.log('[fetchData] No URL in response');
        toast.error(t('FetchError'));
        return;
      }

      const params = new URLSearchParams(result.data.url.split('?')[1]);
      const rawData = params.get('data');
      
      if (!rawData) {
        console.log('[fetchData] No data parameter in URL');
        toast.error(t('FetchError'));
        return;
      }

      const decodedData = decodeData(rawData);
      if (decodedData) {
        console.log('[fetchData] Setting decoded data:', decodedData);
        setData(decodedData);
        setHasFetchedData(true);
      } else {
        console.log('[fetchData] Failed to decode data');
        toast.error(t('FetchError'));
      }
    } catch (error) {
      console.error('[fetchData] Error:', error);
      toast.error(t('FetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [key, hasFetchedData, setData, t]);

  const handleDrawerChange = useCallback((open: boolean) => {
    console.log('[Drawer] onOpenChange:', open);
    if (!open) {
      resetState();
    }
    setIsDrawerOpen(open);
  }, [resetState]);

  useEffect(() => {
    if (isDrawerOpen) {
      fetchData();
    }
  }, [isDrawerOpen, fetchData]);

  const updateLink = useCallback(async () => {
    console.log('[updateLink] Starting update with key:', key);
    console.log('[updateLink] Current data:', data);
    
    if (!key || !data) {
      console.log('[updateLink] Missing key or data');
      toast.error(t('NoDataToUpdate'));
      return;
    }

    try {
      setIsLoading(true);
      console.log('[updateLink] Encoding data...');
      
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const updateUrl = `${window.location.protocol}//${window.location.host}?data=${encodedData}`;
      console.log('[updateLink] Update URL:', updateUrl);

      const result = await updateShortLink({
        id: key,
        url: updateUrl,
      });
      
      console.log('[updateLink] API response:', result);

      if (result.success) {
        toast.success(t('UpdateSuccess'));
        handleDrawerChange(false);
      } else {
        console.log('[updateLink] Update failed:', result.error);
        toast.error(result.error || t('UpdateFailed'));
      }
    } catch (error) {
      console.error('[updateLink] Error:', error);
      toast.error(t('UpdateFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [key, data, t, handleDrawerChange]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerChange}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => {
            console.log('[EditButton] Clicked');
            handleDrawerChange(true);
          }}
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
                    onClick={() => {
                      console.log('[CancelButton] Clicked');
                      handleDrawerChange(false);
                    }}
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
