'use server';

import { env } from '@/env.mjs';
import { catchError, generateNanoId } from '@/lib/utils';
import { Dub } from 'dub';
import type { APIResponse, ShortLinkProps } from '@/types';

// Initialize Dub with the API token from environment variables
const dub = new Dub({
  token: env.DUB_DOT_CO_TOKEN,
});

export default async function createShortLink(shortUrlInfo: ShortLinkProps) {
  try {
    // Generate necessary parameters
    const projectSlug = shortUrlInfo?.projectSlug || env.DUB_DOT_CO_SLUG;
    const shortLink = shortUrlInfo?.shortLink || generateNanoId();

    // Create a short link using the Dub API
    const response = await dub.links.create({
      url: shortUrlInfo.url,
      key: shortLink,
      domain: shortUrlInfo?.domain || env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
    });

    // Return the response from the Dub API
    return {
      success: true,
      error: null,
      data: response as unknown as APIResponse,
    };
  } catch (error) {
    // Handle any errors and log them
    catchError(error);
    return {
      success: false,
      error: 'An unexpected error occurred.',
      data: null,
    };
  }
}
