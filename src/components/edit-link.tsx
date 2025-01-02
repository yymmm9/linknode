'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfileForm from './forms/profile-form';
import SocialLinksForm from './forms/social-links-form';
import { useData } from '@/lib/context/link-context';
import { toast } from "sonner"
import { decodeData } from '@/lib/utils';
import retrieveShortLink from '@/app/_actions/shortlink/retrieve';
import updateShortLink from '@/app/_actions/shortlink/update';
import BackgroundShell from './backgrounds/background-shell';
import ExtraLinksForm from './forms/extra-links-form';

export default function EditShortLink({ 
  linkKey: key,
  linkId: id,
  initialData 
}: { 
  linkKey: string
  linkId: string 
}) {
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
        return;
      }

      console.log('[fetchData] Full URL:', result.data.url);

      const urlParts = result.data.url.split('?');
      const queryString = urlParts[1];
      
      if (!queryString) {
        console.log('[fetchData] No query string found');
        return;
      }

      const params = new URLSearchParams(queryString);
      const rawData = params.get('data');
      
      if (!rawData) {
        console.log('[fetchData] No data parameter in URL');
        return;
      }

      console.log('[fetchData] Raw encoded data:', rawData);

      // 尝试直接解析 JSON
      try {
        const parsedData = JSON.parse(decodeURIComponent(rawData));
        console.log('[fetchData] Parsed data:', parsedData);
        
        if (parsedData) {
          setData(parsedData);
          setHasFetchedData(true);
        }
      } catch (parseError) {
        // 如果直接解析失败，尝试 Base64 解码
        try {
          const decodedData = decodeData(rawData);
          console.log('[fetchData] Decoded data:', decodedData);

          if (decodedData) {
            setData(decodedData);
            setHasFetchedData(true);
          }
        } catch (decodeError) {
          console.log('[fetchData] Failed to decode data:', decodeError);
        }
      }
    } catch (error) {
      console.error('[fetchData] Error:', error);
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
    console.log('[updateLink] Starting update with key:', key, 'and id:', id);
    console.log('[updateLink] Current data:', data);
    
    // 数据验证
    if (!key || !data) {
      console.log('[updateLink] Missing key or data');
      toast(t('NoDataToUpdate'));
      return;
    }

    try {
      // 防止重复提交
      if (isLoading) return;
      
      setIsLoading(true);
      
      // 保存原始数据，以便在更新失败时回滚
      const originalData = { ...data };
      
      // 编码数据
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const updateUrl = `${window.location.protocol}//${window.location.host}?data=${encodedData}`;
      
      console.log('[updateLink] Update URL:', updateUrl);

      // 立即更新本地状态
      setData(data);

      // 调用更新 API
      const result = await updateShortLink({
        id: id,  
        url: updateUrl,
        key: key,  
      });
      
      console.log('[updateLink] API response:', result);

      // 处理更新结果
      if (result.success) {
        // 成功后的操作
        toast(t('UpdateSuccess'));
        handleDrawerChange(false);
      } else {
        // 更新失败，回滚到原始数据
        console.error('[updateLink] Update failed:', result.error);
        setData(originalData);
        toast(t('UpdateFailed'));
      }
    } catch (error) {
      console.error('[updateLink] Unexpected error:', error);
      // 发生异常，回滚到原始数据
      setData(originalData);
      toast(t('UpdateFailed'));
    } finally {
      // 确保在任何情况下都重置加载状态
      setIsLoading(false);
    }
  }, [id, key, data, handleDrawerChange, isLoading, setData, t]);

  // 测试 toast 的函数
  const testToast = useCallback(() => {
    // toast('测试成功 Toast');
    console.log('测试 Toast 按钮被点击');
  }, []);

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

            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={testToast} 
                className="w-full"
              >
                测试 Toast 通知
              </Button>
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
}
