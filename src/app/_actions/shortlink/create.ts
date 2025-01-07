'use server';

import { env } from '@/env.mjs';
import { catchError, dub, generateNanoId } from '@/lib/utils';
import { 
  APIResponse, 
  CreateShortLinkInput, 
  normalizeShortLinkValue 
} from '@/types';

export default async function createShortLink(shortUrlInfo: CreateShortLinkInput) {
  try {
    // Generate necessary parameters
    const projectSlug = normalizeShortLinkValue(shortUrlInfo.projectSlug) ?? env.DUB_DOT_CO_SLUG;
    const shortLink = normalizeShortLinkValue(shortUrlInfo.shortLink) ?? generateNanoId();

    // Create a short link using the Dub API
    const response = await dub.links.create({
      url: shortUrlInfo.url,
      key: shortLink,
      domain: normalizeShortLinkValue(shortUrlInfo.domain) ?? env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
      ...(shortUrlInfo.projectSlug && { projectSlug }),
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
