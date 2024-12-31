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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateShortlinkForm() {
  const { data } = useData();
  const { shortUrlInfo } = useShortener();
  const isValid = checkCustomCredentials(shortUrlInfo);
  const [isLoading, setIsLoading] = React.useState(false);
  const { setSomeResponseInfo, setAuthKey, setProjectSlug, setShortedLink } = useAPIResponse();

  const { data: user } = useUser();

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
    const url = `${window.location.origin}/1?data=${encodeData(data)}`;
    form.setValue('url', url);
    setShortUrlInfoState((prevInfo) => ({
      ...prevInfo,
      url: url,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function onSubmit(data: CreateShortLinkInput) {
    try {
      setIsLoading(true);
      const response = await createShortLink(data);

      if (user && response) {
        const body = [
          {
            user_id: user.id,
            key: response.data?.key,
          },
        ];
        const res = await supabase.from('links').insert(body);
      }

      if (!response) {
        toast.error('No response received');
        return;
      }

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Link created successfully!');

      setShortedLink(`https://${response.data?.domain}/${response.data?.key}`);
      setSomeResponseInfo(response.data);
      
      // Convert values to strings explicitly
      setAuthKey(
        data.authorization && data.authorization !== '' 
          ? String(data.authorization)
          : env.DUB_DOT_CO_TOKEN
      );
      setProjectSlug(
        data.projectSlug && data.projectSlug !== ''
          ? String(data.projectSlug)
          : env.DUB_DOT_CO_SLUG
      );
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
