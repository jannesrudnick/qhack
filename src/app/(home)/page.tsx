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

export type Point = {
  x: number;
  y: number;
  value_temperature: number;
  value_humidity: number;
  value: number;
  createdAt: Date;
};

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

  console.log('selectedTime',selectedTime);

  const { data: measurements } = useQuery(supabase.from('measurements_simulation').select());
  const { data: latestMeasurements, isLoading } = useQuery(supabase.rpc('get_latest_measurements', selectedTime ? {
    before_time: selectedTime!,
  } : undefined).select());

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
        value_temperature: !sensor ? 0 : measurement.value_temperature,
        value_humidity: !sensor ? 0 : measurement.value_humidity,
        value: !sensor ? 0 : measurement.value,
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
          <Header points={points} />
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
