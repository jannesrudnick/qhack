'use client';
import FloorMap from '@/components/floor-map';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

export default function Home() {
  const supabase = useSupabaseBrowser();
  const { data, isLoading } = useQuery(supabase.from('test').select('*'));

  return (
    <div className="flex flex-col">
      <h1>Hello Debug Demons</h1>
      <div className="bg-red-200 min-h-screen w-full">
        <FloorMap />
      </div>
      {data?.map((item) => (
        <div key={item.id}>
          <h2>{item.test}</h2>
        </div>
      ))}
    </div>
  );
}
