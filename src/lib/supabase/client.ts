import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useMemo, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';
import { useSession } from '@clerk/nextjs';

// https://supabase.com/blog/react-query-nextjs-app-router-cache-helpers

export type TypedSupabaseClient = SupabaseClient<Database>;

let client: TypedSupabaseClient | undefined;

function isStorageRequest(url: RequestInfo | URL): boolean {
  const urlString = url instanceof URL ? url.toString() : url.toString();
  return urlString.includes('/storage/v1');
}

export function useSupabaseBrowser() {
  const { session } = useSession();

  return useMemo(() => {
    if (client) {
      return client;
    }

    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        /*async accessToken() {
          return (await session?.getToken()) ?? null;
        },*/
        global: {
          fetch: async (url, options) => {
            console.log('fetch', url, options);
            let token: string | null | undefined = null;
            if (isStorageRequest(url)) {
              token = await session?.getToken({ template: 'supabase' });
            } else {
              token = await session?.getToken();
            }
            const headers = new Headers(options?.headers);
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      },
    );

    return client;
  }, []);
}
