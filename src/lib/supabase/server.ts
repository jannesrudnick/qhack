'use server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';
import { auth } from '@clerk/nextjs/server';

/**
 * Don't use this on *CLIENT* side. trpc / server actions use this
 */
export async function useSupabaseServerAdmin() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function useSupabaseServer(admin = false) {
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    admin ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    },
  );
}
