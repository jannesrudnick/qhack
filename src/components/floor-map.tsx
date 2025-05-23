'use client';

import { ITimelineMarker } from '@/components/timeline-wrapper';
import { ISensorConfig, IShelfConfig, SensorConfigs, ShelfConfigs } from '@/lib/locations';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { getLiveMeasurements } from '@/lib/supabase/queries';
import { Tables } from '@/types_db';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { useQuery, useSubscription } from '@supabase-cache-helpers/postgrest-react-query';
import { clsx } from 'clsx';
import React, { ReactNode, useContext, useMemo } from 'react';
import { AnimatedNumber } from './animated-number';
import { SensorOverlay } from './sensor-overlay';

export interface IMeasurementsContextValue {
  timelineMarkers: ITimelineMarker[];
  relevantBySensor: Map<string, Tables<'measurements_simulation'>>;
}

export const MeasurementsContext = React.createContext<IMeasurementsContextValue | null>(null);

const BOX_SIZE_IN_COORDS = 80;

function boxCoords(num: number): number {
  return num * BOX_SIZE_IN_COORDS;
}

// -------------------------------------------------------------------------------------------------
// ShelfBoxProps

export interface ShelfBoxProps {
  left: number;
  top: number;
}

// -------------------------------------------------------------------------------------------------
// ShelfBox

const ShelfBox = (props: ShelfBoxProps) => {
  const { left, top } = props;

  return (
    <div
      className="absolute bg-gray-200 rounded-lg flex items-center justify-center"
      style={{
        left: boxCoords(left + 0.1),
        top: boxCoords(top + 0.1),
        width: boxCoords(0.8),
        height: boxCoords(0.8),
      }}
    >
      <div className="bg-white rounded-lg flex items-center justify-center aspect-square p-1 border border-gray-300 text-gray-400 text-sm">
        {left}·{top}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
// SensorProps

export interface SensorProps {
  config: ISensorConfig;
  selectedTime?: string;
}

// -------------------------------------------------------------------------------------------------
// Sensor

const Sensor = (props: SensorProps) => {
  const { config, selectedTime } = props;

  const supabase = useSupabaseBrowser();
  const { data: sensorData, refetch } = useQuery(getLiveMeasurements(supabase, config, selectedTime));
  const { data: activeAlerts, refetch: refetchAlerts } = useQuery(
    supabase.rpc('get_active_alerts').select('id, location_shelf_idx, location_sensor_idx, created_at'),
    {
      refetchInterval: 1000 * 60,
    },
  );

  // listen to database changes of the measurement table and alerts to update the displayed data
  useSubscription(
    supabase,
    `live`,
    {
      event: '*',
      table: 'measurements_simulation',
      schema: 'public',
    },
    ['id'],
    {
      callback: async () => {
        await refetch();
      },
    },
  );

  useSubscription(
    supabase,
    `live:alerts`,
    {
      event: '*',
      table: 'alerts',
      schema: 'public',
    },
    ['id'],
    {
      callback: async () => {
        await refetchAlerts();
      },
    },
  );

  const hasAlert =
    activeAlerts &&
    activeAlerts.filter((i) => i.location_sensor_idx === config.inShelfIdx && i.location_shelf_idx === config.shelfIdx)
      .length > 0;

  return (
    <div
      className={clsx(
        'absolute shadow-xl aspect-square rounded-full text-white px-2 z-0 text-sm w-10 text-center flex items-center justify-center',
        activeAlerts && hasAlert && !selectedTime ? 'bg-red-500' : 'bg-slate-700',
      )}
      style={{
        left: boxCoords(config.position.left) - 2 * 10,
        top: boxCoords(config.position.top) - 2 * 10,
      }}
    >
      {hasAlert && !selectedTime && <div className="absolute inset-0 bg-red-600 animate-ping rounded-full" />}
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer relative z-0 text-xs font-bold">
          <AnimatedNumber value={sensorData?.value ? Math.round(sensorData.value) : 0} />
        </HoverCardTrigger>
        <HoverCardContent side="right" sideOffset={10}>
          <SensorOverlay
            sensorConfig={props.config}
            displayId={`${props.config.shelfIdx}-${props.config.floor}-${props.config.inShelfIdx}`}
          />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
// ShelfProps

export interface ShelfProps {
  config: IShelfConfig;
}

// -------------------------------------------------------------------------------------------------
// Shelf

const Shelf = (props: ShelfProps) => {
  const { config } = props;

  return (
    <div
      className="absolute bg-white border rounded-xl"
      style={{
        left: boxCoords(config.rect.left),
        top: boxCoords(config.rect.top),
        width: boxCoords(config.rect.width),
        height: boxCoords(config.rect.height),
      }}
    />
  );
};

export const FloorMap = ({ selectedTime }: { selectedTime?: string }) => {
  // calculate the size of the floor map
  const sizes = useMemo(() => {
    const r: Record<'width' | 'height', number> = {
      width: 0,
      height: 0,
    };

    for (const shelf of ShelfConfigs) {
      r.width = Math.max(shelf.rect.left + shelf.rect.width);
      r.height = Math.max(shelf.rect.top + shelf.rect.height);
    }

    return r;
  }, []);

  return (
    <div id="floor-map" className="overflow-x-scroll no-scrollbar">
      <div className="p-4">
        <div
          className="relative"
          style={{
            width: boxCoords(sizes.width),
            height: boxCoords(sizes.height),
          }}
        >
          {ShelfConfigs.map((config, configIdx) => {
            const boxes: ReactNode[] = [];

            for (let i = 0; i < config.rect.width; i += 1) {
              for (let j = 0; j < config.rect.height; j += 1) {
                boxes.push(<ShelfBox key={`${i}_${j}`} left={config.rect.left + i} top={config.rect.top + j} />);
              }
            }

            return (
              <React.Fragment key={configIdx}>
                <Shelf config={config} />
                {boxes}
              </React.Fragment>
            );
          })}
          {SensorConfigs.map((config, configIdx) => (
            <Sensor key={configIdx} config={config} selectedTime={selectedTime} />
          ))}
          {/* - Wrapper which contains a draggable map where we render our grundriss and where you can click on certain things */}
          {/* e.g. storage boxes */}
        </div>
      </div>
    </div>
  );
};
