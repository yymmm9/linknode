'use client';

import React from 'react';
import { env } from '@/env.mjs';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/context/link-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShortener } from '@/lib/context/shortlink-context';
import createShortLink from '@/app/_actions/shortlink/create';
import { CreateShortLinkInput, shortlinkSchema, isValidShortLinkKey, normalizeShortLinkValue } from '@/types';
import { useAPIResponse } from '@/lib/context/api-response-context';
import { catchError, checkCustomCredentials, cn, encodeData } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useUser from '@/app/hook/useUser';
import { createClient } from '@supabase/supabase-js';
import { useLocale } from 'next-intl';
import { LinkCreationStore } from '@/stores/link-creation-store';
import { useRouter } from 'next/navigation';
import { useRedirect } from '@/lib/utils/redirect';
import { useTranslations } from 'next-intl';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateShortlinkFormProps {
  handleCreateLink?: () => Promise<void>;
}

type CreateShortlinkFormData = {
  url: string;
  domain?: string;
  shortLink: string;
  n?: number | string;
  ln?: number | string;
};

export default function CreateShortlinkForm({
  handleCreateLink,
}: {
  handleCreateLink?: () => Promise<void>;
}) {
  const { data } = useData();
  const { shortUrlInfo } = useShortener();
  const isValid = checkCustomCredentials(shortUrlInfo);
  const [isLoading, setIsLoading] = React.useState(false);
  const { setSomeResponseInfo, setAuthKey, setProjectSlug, setShortedLink } = useAPIResponse();

  const { data: user } = useUser();

  const locale = useLocale();

  const { redirect } = useRedirect();

  const [shortUrlInfoState, setShortUrlInfoState] = React.useState<CreateShortlinkFormData>({
    url: '',
    shortLink: '',
  });

  const form = useForm<CreateShortlinkFormData>({
    resolver: zodResolver(shortlinkSchema),
    defaultValues: {
      url: '',
      domain: '',
      shortLink: '',
    },
  });

  const router = useRouter();

  const t = useTranslations('CreateShortLink');
  const tCommon = useTranslations('Common');

  // Utility function to convert value to string or undefined
  const convertToStringOrUndefined = (value: string | number | boolean | undefined): string | undefined => {
    if (value === undefined || value === '') return undefined;
    return String(value);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    if (name in form.getValues()) {
      form.setValue(name as keyof CreateShortlinkFormData, value);
      setShortUrlInfoState((prevData) => ({
        ...prevData,
        [name]: convertToStringOrUndefined(value) ?? value,
      }));
    }
  }

  function handleGlobalState(name: keyof CreateShortlinkFormData, value: string | number | boolean | undefined) {
    const stringValue = convertToStringOrUndefined(value);
    
    if (stringValue !== undefined) {
      form.setValue(name, stringValue);
      setShortUrlInfoState((prevInfo) => ({
        ...prevInfo,
        [name]: stringValue,
      }));
      return;
    }
    
    form.resetField(name, { defaultValue: '' });
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/link?data=${encodeData(data)}`;
    form.setValue('url', url);
    setShortUrlInfoState((prevInfo) => ({
      ...prevInfo,
      url: url,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function onSubmit(formData: CreateShortlinkFormData) {
    try {
      setIsLoading(true);

      // Check if user is logged in before making any API calls
      if (!user) {
        // Store form data for later
      LinkCreationStore.setLinkData({
        destination: formData.url,
        customDomain: formData.domain !== undefined 
            ? String(formData.domain) 
            : undefined,
        shortLink: formData.shortLink,
        n: formData.n !== undefined 
            ? typeof formData.n === 'string' 
                ? formData.n 
                : String(formData.n)
            : undefined,
        ln: formData.ln !== undefined 
             ? typeof formData.ln === 'string' 
                 ? formData.ln 
                 : String(formData.ln)
             : undefined
      });
      
      // Redirect to signup with locale and next path
      router.push(`/${locale}/signup?next=/${locale}/create`);
        return;
      }

      // If external handleCreateLink is provided, use it
      if (handleCreateLink) {
        await handleCreateLink()
        return
      }

      // Normal submission logic
      const response = await createShortLink(formData);

      if (!response) {
        return;
      }

      if (response.error) {
        return;
      }

      // Save to user's links if successful
      if (response.data?.key) {
        const linkName = locale === 'zh' 
          ? `${formData.n} ${formData.ln}` 
          : `${formData.ln} ${formData.n}`;
        
        const body = [
          {
            user_id: user.id,
            key: response.data.key,
            n: formData.n,  
            ln: formData.ln, 
            link_name: linkName, 
          },
        ];
        await supabase.from('links').insert(body);
      }

      setShortedLink(`https://${response.data?.domain}/${response.data?.key}`);
      setSomeResponseInfo(response.data);
      
      const isAdmin = user.id === 'your-admin-id'; // Replace with actual admin ID
      const token = isAdmin ? env.DUB_DOT_CO_TOKEN ?? '' : '';
      const projectSlug = isAdmin ? env.DUB_DOT_CO_SLUG ?? '' : '';

      setAuthKey(token);
      setProjectSlug(projectSlug);
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        className="grid gap-2"
      >
        <FormField
          control={form.control}
          name="shortLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customShortLink')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('enterCustomShortLink')}
                  {...field}
                  value={
                    shortUrlInfoState.shortLink 
                      ?? field.value 
                      ?? ''
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(e);
                  }}
                  name="shortLink"
                  className="h-8"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          // className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <AiOutlineLoading3Quarters
                className={cn(
                  !isLoading ? "hidden" : "block animate-spin"
                )}
                aria-hidden="true"
              />
              {tCommon('creating')}
            </>
          ) : (
            t('createShortLink')
          )}
        </Button>
      </form>
    </Form>
  );
}
