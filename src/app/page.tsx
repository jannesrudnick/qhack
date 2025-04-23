'use client';
import FloorMap from '@/components/floor-map';
import HeatmapOverlay from '@/components/heatmap-overlay';
import IconButton from '@/components/icon-button';
import TimeLineWrapper from '@/components/timeline-wrapper';
import { Button } from '@/components/ui/button';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { ChartBar, Lightbulb, Link2, MapIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const supabase = useSupabaseBrowser();
  const { data, isLoading } = useQuery(supabase.from('test').select('*'));

  const heatmapRef = useRef<HTMLDivElement>(null);
  const [heatmapSize, setHeatmapSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (heatmapRef.current) {
      const { offsetWidth, offsetHeight } = heatmapRef.current;
      setHeatmapSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const points1 = [
    { x: 0, y: 0 },
    { x: 1, y: 0, value: 1 },
    { x: 1, y: 1 },
  ];

  const points2 = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0.1, y: 0.21 },
    { x: 0.1, y: 0.31 },
    { x: 0.1, y: 0.41 },
    { x: 0.1, y: 0.51, value: 2 },
    { x: 0.2, y: 0.21 },
    { x: 0.2, y: 0.31 },
    { x: 0.2, y: 0.41 },
    { x: 0.1, y: 0.11 },
    { x: 0.23, y: 0.21 },
    { x: 0.82, y: 0.41 },
    { x: 0.26, y: 0.21 },
    { x: 0.16, y: 0.31 },
  ];
  const [points, setPoints] = useState([]);

  return (
    <div className="flex flex-col">
      <div className="min-h-screen w-full bg-linear-to-bl from-violet-200 to-fuchsia-200 p-10">
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
        <div className="mb-4 glass-card dots">
          <FloorMap />
          <div ref={heatmapRef} className="relative  w-full aspect-video">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(https://axscm.wordpress.com/wp-content/uploads/2017/10/pick-frequency.png)',
              }}
            ></div>
            {heatmapSize.width > 0 && heatmapSize.height > 0 && (
              <div className="w-full h-full relative">
                <HeatmapOverlay width={heatmapSize.width} height={heatmapSize.height} points={points} />
                <Button onClick={() => setPoints(points2)}>Points 2</Button>
                <Button onClick={() => setPoints(points1)}>Points 1</Button>
                <Button onClick={() => setPoints([])}>Clear</Button>
              </div>
            )}
          </div>
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
