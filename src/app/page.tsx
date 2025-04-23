'use client';
import FloorMap from '@/components/floor-map';
import IconButton from '@/components/icon-button';
import TimeLineWrapper from '@/components/timeline-wrapper';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { ChartBar, Lightbulb, Link2, MapIcon } from 'lucide-react';

export default function Home() {
  const supabase = useSupabaseBrowser();
  const { data, isLoading } = useQuery(supabase.from('test').select('*'));

  return (
    <div className="flex flex-col">
      <div className="min-h-screen w-full  bg-linear-to-bl from-violet-200 to-fuchsia-200 p-10">
        <div className="flex justify-between">
          <div className="h-14 bg-white rounded-full px-4 flex items-center justify-center">
            Unser<b>Logo</b>
          </div>
          <div className="flex gap-2 items-center">
            <IconButton icon={<MapIcon />} />
            <IconButton icon={<ChartBar />} />
            <IconButton icon={<Lightbulb />} />
            <IconButton icon={<Link2 />} />
          </div>
        </div>
        <div className="flex items-center my-6">
          <div className="flex flex-col">
            <p className="text-gray-500">Comprehensive Insights</p>
            <p className="font-bold">Executive Overview</p>
          </div>
          <div className="ml-auto"></div>
        </div>
        <TimeLineWrapper />
        <div className="mb-4 glass-card">
          <FloorMap />
        </div>
        <div className="flex gap-4">
          <div className="glass-card">
            <p>Enter new Stock</p>
            <p>Lorem Ipsum</p>
            {data?.map((item) => (
              <div key={item.id}>
                <h2>{item.test}</h2>
              </div>
            ))}
          </div>
          <div className="glass-card">
            <p>New Stock report</p>
            <p>Lorem Ipsum</p>
          </div>
        </div>
      </div>
    </div>
  );
}
