'use server';

import { env } from '@/env.mjs';
import { catchError, dub, generateNanoId } from '@/lib/utils';
import type { APIResponse, ShortLinkProps } from '@/types';

export default async function retrieveShortLink(key: string) {
  if (!key) return
  try {
    const response = await dub.links.get({
      domain: "hov.sh",
      key
    });

    // Return the response from the Dub API
    return {
      success: true,
      error: null,
      data: response as unknown as APIResponse,
    };
  } catch (error) {
    // Handle any errors and log them
    console.log(error)
    // catchError(error);
    return {
      success: false,
      error: 'An unexpected error occurred.',
      data: null,
    };
  }
}
