'use client';
import { FloorMap, IMeasurementsContextValue, MeasurementsContext } from '@/components/floor-map';
import { HeatmapOverlay } from '@/components/heatmap-overlay';
import { IconButton } from '@/components/icon-button';
import { NavigationPill } from '@/components/navigation-pill';
import { TimeLineWrapper } from '@/components/timeline-wrapper';
import { Switch } from '@/components/ui/switch';
import { aggregatedIncidents } from '@/lib/incidents';
import { ISensorConfig, SensorConfigs, ShelfConfigs } from '@/lib/locations';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { EllipsisVertical, LucideMap, MapPin, User2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertList } from './alert-list';
import { Header } from './header';
import { TopSpoiledFoods } from './top-spoiled-foods';

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

  const [displayMode, setDisplayMode] = useState<'overview' | 'temperature' | 'incidents'>('overview');
  const [liveMode, setLiveMode] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [heatmapSize, setHeatmapSize] = useState({ width: 0, height: 0 });

  const heatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // reset the selected time when live mode is enabled
    if (liveMode) {
      setSelectedTime(undefined);
    }
  }, [liveMode]);

  useEffect(() => {
    // initital set the heatmap size
    if (heatmapRef.current) {
      const { offsetWidth, offsetHeight } = heatmapRef.current;
      setHeatmapSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const { data: measurements } = useQuery(supabase.from('measurements_simulation').select(), {
    refetchInterval: 1000 * 60,
  });
  // get the latest measurements of all sensors
  const { data: latestMeasurements } = useQuery(
    supabase
      .rpc(
        'get_latest_measurements',
        selectedTime
          ? {
              before_time: selectedTime!,
            }
          : undefined,
      )
      .select(),
  );

  // create a map of all coordinates of the sensors that is used to map the measurements to the correct sensor
  // and display the correct values on the heatmap
  const points = useMemo(() => {
    // propagate map
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

    // map sensor coordinates to the values
    return latestMeasurements?.map((measurement) => {
      const key = `${measurement.location_shelf_idx}_${measurement.location_floor}_${measurement.location_sensor_idx}`;
      const sensor = map.get(key);

      return {
        x: (sensor?.position.left || 0) / r.width,
        y: (sensor?.position.top || 0) / r.height,
        value_temperature: !sensor ? 0 : measurement.value_temperature,
        value_humidity: !sensor ? 0 : measurement.value_humidity,
        value: !sensor ? 0 : measurement.value,
        createdAt: new Date(measurement.created_at),
      };
    });
  }, [latestMeasurements]);

  // create a map of all sensors that have been seen in the timeline
  const measurementsCtxValue = useMemo(() => {
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
      }

    return ctx;
  }, [measurements, selectedTime]);

  return (
    <div className="flex flex-col">
      <div className="min-h-screen w-full bg-linear-to-br from-[#C8D5DA] via-[#EBEBD0] to-[#C8D5DA] p-10">
        <div className="flex justify-between">
          <div className="h-14 text-xl font-bold bg-white rounded-full px-4 flex items-center justify-center">
            <span className="text-[#00B050] ">ECO</span>SHELF
          </div>
          <div className="flex gap-4 items-center">
            <IconButton icon={<LucideMap size={18} />} />
            <IconButton icon={<User2 size={18} />} />
            <IconButton icon={<EllipsisVertical size={18} />} />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center my-6 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin size={15} />
                <p className="">Warehouse Utrecht</p>
              </div>
              <p className="font-bold text-xl">Warehouse Climate & Mold Overview</p>
            </div>
            <div className="ml-auto"></div>
          </div>
          <div className="ml-auto"></div>
        </div>
        <Header points={points || []} />
        {displayMode !== 'incidents' ? (
          <>
            <div className="flex items-center gap-4 my-4 mt-12">
              <Switch checked={liveMode} onCheckedChange={(v) => setLiveMode(v)} />
              <span className="text-sm font-bold">live-mode</span>
              {liveMode ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-700 rounded-full animate-ping" />
                </div>
              ) : null}
            </div>
            {!liveMode && (
              <div className="p-4 mb-6 radius-xl glass-card">
                <TimeLineWrapper
                  markers={measurementsCtxValue.timelineMarkers}
                  setSelectedTime={setSelectedTime}
                  selectedTime={selectedTime}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center mt-12">
            <div className="mx-auto bg-slate-900 text-white my-4 rounded-full px-3 py-1 text-sm">
              Viewing the Aggregated Incidents from the last 30 days
            </div>
          </div>
        )}
        <div className="mb-4 dots glass-card relative overflow-hidden">
          <div ref={heatmapRef} className="relative w-full">
            <FloorMap selectedTime={selectedTime} />
            <div className="absolute inset-0 pointer-events-none pointer-none">
              {heatmapSize.width > 0 && heatmapSize.height > 0 && displayMode === 'temperature' && (
                <HeatmapOverlay
                  width={heatmapSize.width}
                  height={heatmapSize.height}
                  points={points?.map((i) => ({ ...i, value: i.value_temperature })) || []}
                />
              )}
              {heatmapSize.width > 0 && heatmapSize.height > 0 && displayMode === 'incidents' && (
                <HeatmapOverlay
                  width={heatmapSize.width}
                  height={heatmapSize.height}
                  points={aggregatedIncidents || []}
                />
              )}
            </div>
          </div>
          <div className=" px-6 flex items-center justify-center mb-4 mt-2">
            <div className="flex-[1]" />
            <NavigationPill displayMode={displayMode} setDisplayMode={setDisplayMode} />
            <div className="flex items-center justify-end gap-1 flex-[1]">
              <div className="size-2 rounded-full bg-slate-700"></div>
              <div className="text-sm text-gray-700">Values show the TVOC in ppm</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <TopSpoiledFoods />
          <AlertList />
        </div>
      </div>
    </div>
  );
}
