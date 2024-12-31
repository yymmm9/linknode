'use client';

import { useEffect, useState } from 'react';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [data, setData] = useState<any>(null); // State for storing the fetched data
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const [hasFetchedData, setHasFetchedData] = useState(false); // Track if data has been fetched
  const t = useTranslations('EditShortLink');
  const { data, setData } = useData();
  useEffect(() => {
    const fetchData = async () => {
      if (!key || hasFetchedData) return; // Only fetch if key exists and data hasn't been fetched yet

      setIsLoading(true); // Start loading when the fetch begins
      const result = await retrieveShortLink(key);
      const url = result?.data?.url;

      if (url) {
        const params = new URLSearchParams(url.split('?')[1]);
        const rawData = params.get('data');
        const decodedData: any = rawData && decodeData(rawData);
        if (decodedData) {
          setData(decodedData); // Store fetched and decoded data in state
        }
      }

      setIsLoading(false); // End loading when fetch is complete
      setHasFetchedData(true); // Mark data as fetched
    };

    if (isDrawerOpen) {
      // Fetch data only when the drawer is open
      fetchData();
    }
  }, [isDrawerOpen, key, hasFetchedData]); // Only refetch when the drawer opens and key changes

  const updateLink = async () => {
    if (!key || !data) {
      toast.error(t('NoDataToUpdate'));
      return;
    }

    try {
      setIsLoading(true);
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const result = await updateShortLink({
        id: key,
        url: `https://${window.location.host}?data=${encodedData}`,
      });
      
      if (result.success) {
        setIsDrawerOpen(false);
        toast.success(t('UpdateSuccess'));
      } else {
        toast.error(result.error || t('UpdateFailed'));
      }
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error(t('UpdateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2">
          <Button variant={'ghost'}>{t('edit')}</Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[75vh] pb-2">
        <div className="mx-auto w-full max-w-sm overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{t('edit-short-link')}</DrawerTitle>
            <DrawerDescription>
              {t('modify-your-short-link-settings')}
            </DrawerDescription>
          </DrawerHeader>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              {t('loading')}...
            </div>
          ) : data ? (
            <div className="hide_scrollbar flex w-full flex-col gap-5 overflow-y-auto pb-12 lg:pb-0">
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

          <DrawerFooter className="fixed left-1/2 bottom-0 -translate-x-1/2 flex flex-row w-full gap-2">
          
            <Button className='w-full'
              onClick={updateLink} 
              disabled={isLoading || !data}
            > 
              {isLoading ? t('updating') : t('submit')}
            </Button>
            <DrawerClose asChild className='w-full'>
              <Button variant="outline">{t('cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
