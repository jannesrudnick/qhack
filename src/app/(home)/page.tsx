'use client';
import { CreateStock } from '@/components/create-stock';
import FloorMap, { IMeasurementsContextValue, MeasurementsContext } from '@/components/floor-map';
import HeatmapOverlay from '@/components/heatmap-overlay';
import { ISensorConfig, SensorConfigs, ShelfConfigs } from '@/components/locations';
import SimulateAlert from '@/components/simulate-alert';
import TimeLineWrapper from '@/components/timeline-wrapper';
import { Button } from '@/components/ui/button';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './header';

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

  const [selectedTime, setSelectedTime] = useState<string>();

  const heatmapRef = useRef<HTMLDivElement>(null);
  const [heatmapSize, setHeatmapSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (heatmapRef.current) {
      const { offsetWidth, offsetHeight } = heatmapRef.current;
      setHeatmapSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const { data: measurements } = useQuery(supabase.from('measurements_simulation').select());

  const { data: latestMeasurements } = useQuery(supabase.rpc('get_latest_measurements_by_shelf').select());

  const points = useMemo(() => {
    const map = new Map<string, ISensorConfig>();
    for (const config of SensorConfigs) {
      const key = `${config.shelfIdx}_${config.floor}_${config.inShelfIdx}`;
      map.set(key, config);
    }

    const r: Record<'width' | 'height', number> = {
      width: 0,
      height: 0,
    };

    for (const shelf of ShelfConfigs) {
      r.width = Math.max(shelf.rect.left + shelf.rect.width);
      r.height = Math.max(shelf.rect.top + shelf.rect.height);
    }

    return latestMeasurements?.map((measurement) => {
      const key = `${measurement.location_shelf_idx}_${measurement.location_floor}_${measurement.location_sensor_idx}`;

      const sensor = map.get(key);

      return {
        x: (sensor?.position.left || 0) / r.width,
        y: (sensor?.position.top || 0) / r.height,
        value: measurement.value,
        value_humidity: measurement.value_humidity,
        value_temperature: measurement.value_temperature,
      };
    });
  }, [latestMeasurements]);

  const measurmentsCtxValue = useMemo(() => {
    const ctx: IMeasurementsContextValue = {
      timelineMarkers: [],
      relevantBySensor: new Map(),
    };

    const seenSensors = new Set<string>();

    if (measurements)
      for (const measurement of measurements) {
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
          <Header />
          {selectedTime ? (
            <div>
              Looking at: {selectedTime}
              <Button onClick={() => setSelectedTime(undefined)}>Back to live</Button>
            </div>
          ) : (
            <div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" /> Live
            </div>
          )}
          <TimeLineWrapper
            markers={measurmentsCtxValue.timelineMarkers}
            setSelectedTime={setSelectedTime}
            selectedTime={selectedTime}
          />
          <div ref={heatmapRef} className="mb-4 dots glass-card relative overflow-hidden">
            <FloorMap selectedTime={selectedTime} />
            <div className="absolute inset-0 pointer-events-none pointer-none">
              {heatmapSize.width > 0 && heatmapSize.height > 0 && (
                <HeatmapOverlay width={heatmapSize.width} height={heatmapSize.height} points={points || []} />
              )}
            </div>
          </div>
          <div className="flex gap-4 hidden">
            <div className="glass-card">
              <CreateStock />
              <p>Lorem Ipsum</p>
            </div>
            <div className="glass-card">
              <p>New Stock report</p>
              <p>Lorem Ipsum</p>
              <SimulateAlert />
            </div>
          </div>
        </div>
      </div>
    </MeasurementsContext.Provider>
  );
}
