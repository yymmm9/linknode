'use client';

import React from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { env } from '@/env.mjs';
import { Loader2 } from 'lucide-react';
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
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import useUser from '@/app/hook/useUser';
import { createClient } from '@supabase/supabase-js';
import { useLocale } from 'next-intl';
import { LinkCreationStore } from '@/stores/link-creation-store';
import { useRouter } from 'next/navigation';
import { useRedirect } from '@/lib/utils/redirect';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateShortlinkFormProps {
  handleCreateLink?: () => Promise<void>;
}

export default function CreateShortlinkForm({ handleCreateLink }: CreateShortlinkFormProps) {
  const { data } = useData();
  const { shortUrlInfo } = useShortener();
  const isValid = checkCustomCredentials(shortUrlInfo);
  const [isLoading, setIsLoading] = React.useState(false);
  const { setSomeResponseInfo, setAuthKey, setProjectSlug, setShortedLink } = useAPIResponse();

  const { data: user } = useUser();

  const locale = useLocale();

  const { redirect } = useRedirect();

  const [shortUrlInfoState, setShortUrlInfoState] = React.useState<CreateShortLinkInput>({
    url: '',
  });

  const form = useForm<CreateShortLinkInput>({
    resolver: zodResolver(shortlinkSchema),
    defaultValues: {
      url: '',
      authorization: '',
      projectSlug: '',
      domain: '',
      shortLink: '',
      password: '',
      rewrite: false,
    },
  });

  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    if (isValidShortLinkKey(name)) {
      form.setValue(name, value);
      setShortUrlInfoState((prevData) => ({
        ...prevData,
        [name]: normalizeShortLinkValue(value) ?? value,
      }));
    }
  }

  function handleGlobalState(name: string, value: string | number | boolean | undefined) {
    if (isValidShortLinkKey(name)) {
      const normalizedValue = normalizeShortLinkValue(value);
      
      if (normalizedValue !== '') {
        form.setValue(name, normalizedValue ?? '');
        setShortUrlInfoState((prevInfo) => ({
          ...prevInfo,
          [name]: normalizedValue ?? value,
        }));
        return;
      }
      
      form.resetField(name, { defaultValue: '' });
    }
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

  // Utility function to convert value to string or undefined
  const convertToStringOrUndefined = (value: string | number | boolean | undefined): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'string') return value;
    return String(value);
  };

  async function onSubmit(formData: CreateShortLinkInput) {
    try {
      setIsLoading(true);

      // Check if user is logged in before making any API calls
      if (!user) {
        // Store form data for later
      LinkCreationStore.setLinkData({
        destination: formData.url,
        customDomain: formData.domain,
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
              <FormLabel>Short Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter custom short link"
                  {...field}
                  value={
                    shortUrlInfoState.shortLink 
                      ? String(shortUrlInfoState.shortLink) 
                      : ''
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    field.onChange(inputValue);
                    handleChange(e);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? (
            <>
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
              Creating
            </>
          ) : (
            'Create short link'
          )}
        </Button>
      </form>
    </Form>
  );
}
