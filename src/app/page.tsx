'use client';
import { useSupabaseBrowser } from '@/lib/supabase/client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'

export default function Home() {

  const supabase = useSupabaseBrowser();
  const { data, isLoading } = useQuery(supabase.from('test').select('*'));

  return (
    <div>
      <h1>Hello World</h1>
      {data?.map((item) => (
        <div key={item.id}>
          <h2>{item.test}</h2>
        </div>
      ))}
    </div>
  );
}
