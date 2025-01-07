'use server';

import { env } from '@/env.mjs';
import { catchError } from '@/lib/utils';

export default async function deleteShortLink({
  id,
  authorization,
  projectSlug,
}: {
  id: string;
  authorization: string | null;
  projectSlug: string | null;
}) {
  try {
    const getAuthorization = authorization || env.HOV_SH_TOKEN;
    const getProjectSlug = projectSlug || env.HOV_SH_SLUG;

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAuthorization}`,
      },
      cache: 'no-store' as RequestCache,
    };

    const response = await fetch(
      `https://api.hov.sh/links/${id}?projectSlug=${getProjectSlug}`,
      options,
    );

    switch (response.status) {
      case 401:
      case 404:
      case 403:
        return {
          success: false,
          error: 'Unauthorized or invalid credentails.',
          data: null,
        };
      case 404:
        return {
          success: false,
          error: 'Short Link not found.',
        };
      case 429:
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
        };
      default:
        if (!response.ok) {
          return {
            success: false,
            error: `Error: ${response.statusText}`,
          };
        }
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    catchError(error);
  }
}
