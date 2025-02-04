'use client';

import React from 'react';
import { toast } from 'sonner';
import { catchError } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, Loader2, Trash2 } from 'lucide-react';
import deleteShortLink from '@/app/_actions/shortlink/delete';
import { useAPIResponse } from '@/lib/context/api-response-context';
import { useTranslations } from 'next-intl';

export default function DeleteShortlinkForm() {
  const [hasCopied, setHasCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { someResponseInfo, authKey, projectSlug, setOpen, setShortedLink } =
    useAPIResponse();
  
  const t = useTranslations('DeleteShortlinkForm');

  async function handleDelete() {
    try {
      setIsLoading(true);
      if (!someResponseInfo?.id) {
        toast.error(t('invalidParameters'));
        return;
      }

      const response = await deleteShortLink({
        id: someResponseInfo?.id,
        authorization: authKey,
        projectSlug: projectSlug,
      });

      if (!response) {
        toast.error(t('noResponseReceived'));
        return;
      }

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(t('linkDeletedSuccessfully'));

      setOpen(false);
      setShortedLink(null);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = React.useCallback(async () => {
    const shortedLink = `https://${someResponseInfo?.domain}/${someResponseInfo?.key}`;
    try {
      await navigator.clipboard.writeText(shortedLink);
      setHasCopied(true);
    } catch (error) {
      toast.error(t('failedToCopyToClipboard'));
      return null;
    }
  }, [someResponseInfo, t]);

  return (
    <div className="grid gap-2">
      <Input
        type="text"
        value={`https://${someResponseInfo?.domain}/${someResponseInfo?.key}`}
        readOnly
      />
      <div className="flex w-full items-center justify-between gap-2">
        {/* <Button
          disabled={isLoading}
          variant={'destructive'}
          className="w-full"
          onClick={handleDelete}
        >
          {isLoading ? (
            <>
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
              {t('deleting')}
            </>
          ) : (
            <>
              <Trash2 className="mr-2 size-4" />
              {t('delete')}
            </>
          )}
        </Button> */}
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={copyToClipboard}
        >
          {hasCopied ? (
            <>
              <Check className="mr-2 size-4" />
              {t('copied')}
            </>
          ) : (
            <>
              <Copy className="mr-2 size-4" />
              {t('copyLink')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
