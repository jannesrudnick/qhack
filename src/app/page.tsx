'use client';
import { CreateStock } from '@/components/create-stock';
import FloorMap, { IMeasurementsContextValue, MeasurementsContext } from '@/components/floor-map';
import HeatmapOverlay from '@/components/heatmap-overlay';
import IconButton from '@/components/icon-button';
import TimeLineWrapper, { ITimelineMarker, roundDate5Min } from '@/components/timeline-wrapper';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { addMinutes, sub, subMinutes } from 'date-fns';
import { EllipsisVertical, Map as LucideMap, User2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

type Point = {
  x: number;
  y: number;
  value: number;
  createdAt: Date;
};

const initPoints: Point[] = [
  { x: 0, y: 0, value: 18, createdAt: new Date() },
  { x: 1, y: 0, value: 22, createdAt: new Date(Date.now() - 600000) }, // 10 mins ago
  { x: 1, y: 1, value: 13, createdAt: new Date(Date.now() - 1200000) }, // 20 mins ago
  { x: 0.1, y: 0.21, value: 25, createdAt: new Date(Date.now() - 1800000) }, // 30 mins ago
  { x: 0.1, y: 0.31, value: 16, createdAt: new Date(Date.now() - 2400000) }, // 40 mins ago
  { x: 0.1, y: 0.41, value: 19, createdAt: new Date(Date.now() - 3000000) }, // 50 mins ago
  { x: 0.1, y: 0.51, value: 21, createdAt: new Date(Date.now() - 3600000) }, // 1 hour ago
  { x: 0.2, y: 0.21, value: 14, createdAt: new Date() },
  { x: 0.2, y: 0.31, value: 17, createdAt: new Date(Date.now() - 900000) }, // 15 mins ago
  { x: 0.2, y: 0.41, value: 23, createdAt: new Date(Date.now() - 1500000) }, // 25 mins ago
  { x: 0.1, y: 0.11, value: 11, createdAt: new Date(Date.now() - 2100000) }, // 35 mins ago
  { x: 0.23, y: 0.21, value: 24, createdAt: new Date(Date.now() - 2700000) }, // 45 mins ago
  { x: 0.82, y: 0.41, value: 20, createdAt: new Date(Date.now() - 3300000) }, // 55 mins ago
  { x: 0.26, y: 0.21, value: 15, createdAt: new Date() },
  { x: 0.16, y: 0.31, value: 10, createdAt: new Date(Date.now() - 1800000) }, // 30 mins ago
];

export default function Home() {
  const supabase = useSupabaseBrowser();

  const [selectedTime, setSelectedTime] = useState<string>(roundDate5Min(new Date().toISOString()));

  const heatmapRef = useRef<HTMLDivElement>(null);
  const [heatmapSize, setHeatmapSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (heatmapRef.current) {
      const { offsetWidth, offsetHeight } = heatmapRef.current;
      setHeatmapSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  useEffect(() => {
    // from selectedTime as '10:30' to date object and then filter points by createdAt
    const [hours, minutes] = selectedTime?.split(':') ?? [];
    const date = new Date();
    date.setHours(parseInt(hours ?? '0'));
    date.setMinutes(parseInt(minutes ?? '0'));
    const filteredPoints = initPoints.filter((point) => {
      console.log(point.createdAt, date, point.createdAt > date);
      return point.createdAt >= subMinutes(date, 30) && point.createdAt <= addMinutes(date, 30);
    });
    setPoints(filteredPoints);
  }, [selectedTime]);

  const [points, setPoints] = useState<Point[]>(initPoints);

  const { data: measurements } = useQuery(supabase.from('measurements_simulation')
    .select());

  const measurmentsCtxValue = useMemo(() => {
    const ctx: IMeasurementsContextValue = {
      timelineMarkers: [],
      relevantBySensor: new Map(),
    };

    const seenSensors = new Set<string>();

    /* markers.push(
      { time: sub(new Date(), { hours: 4 }).toISOString(), value: 'Incident' },
      { time: sub(new Date(), { hours: 3 }).toISOString(), value: 'Incident' },
      { time: sub(new Date(), { hours: 2 }).toISOString(), value: 'Incident' },
    ); */

    if (measurements) for (const measurement of measurements) {
      if (measurement.value <= 0) continue;
      const location = `${measurement.location_shelf_idx}_${measurement.location_floor}_${measurement.location_sensor_idx}`;

      if (!seenSensors.has(location)) {
        seenSensors.add(location);
        ctx.timelineMarkers.push({
          time: measurement.time,
          value: 'Incident',
        });
      }

      if (new Date(measurement.time).toISOString() === selectedTime) {
        ctx.relevantBySensor.set(location, measurement);
      }
    }

    return ctx;
  }, [measurements, selectedTime]);

  return (
    <MeasurementsContext.Provider value={measurmentsCtxValue}>
      <div className="flex flex-col">
        <div className="min-h-screen w-full bg-linear-to-bl from-violet-200 to-fuchsia-200 p-10">
          <div className="flex justify-between">
            <div className="h-14 bg-white rounded-full px-4 flex items-center justify-center">
              Unser<b>Logo</b>
            </div>
            <div className="flex gap-4 items-center">
              <IconButton icon={<LucideMap />} />
              <IconButton icon={<User2 />} />
              <IconButton icon={<EllipsisVertical />} />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center my-6">
              <div className="flex flex-col">
                <p className="text-gray-500">Comprehensive Insights</p>
                <p className="font-bold">Executive Overview</p>
              </div>
              <div className="ml-auto"></div>
            </div>
            <div className="ml-auto"></div>
          </div>
          <TimeLineWrapper markers={measurmentsCtxValue.timelineMarkers} setSelectedTime={setSelectedTime} selectedTime={selectedTime} />
          <div ref={heatmapRef} className="mb-4 dots glass-card relative overflow-hidden pointer-events-none">
            <FloorMap />
            <div className="absolute inset-0 ">
              {heatmapSize.width > 0 && heatmapSize.height > 0 && (
                <HeatmapOverlay width={heatmapSize.width} height={heatmapSize.height} points={points} />
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="glass-card">
              <CreateStock />
              <p>Lorem Ipsum</p>
            </div>
            <div className="glass-card">
              <p>New Stock report</p>
              <p>Lorem Ipsum</p>
            </div>
          </div>
        </div>
      </div>
    </MeasurementsContext.Provider>
  );
}
