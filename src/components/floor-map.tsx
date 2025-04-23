'use client';
import { ISensorConfig, IShelfConfig, SensorConfigs, ShelfConfigs } from '@/components/locations';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import React, { ReactNode, useMemo } from 'react';
import SensorOverlay from './sensor-overlay';

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
      <div className="bg-white border rounded-lg flex items-center justify-center aspect-square">A1</div>
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
// SensorProps

export interface SensorProps {
  config: ISensorConfig;
}

// -------------------------------------------------------------------------------------------------
// Sensor

const Sensor = (props: SensorProps) => {
  const { config } = props;

  return (
    <div
      className="absolute aspect-square border-2 rounded-full bg-slate-600 text-white p-1 group group"
      style={{
        left: boxCoords(config.position.left) - 2 * 10,
        top: boxCoords(config.position.top) - 2 * 10,
      }}
    >
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer">
          <p>123</p>
        </HoverCardTrigger>
        <HoverCardContent side="right">
          <SensorOverlay id={JSON.stringify(props.config.position)} />
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

export default function FloorMap() {
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
    <div id="flor-map" className="overflow-x-scroll no-scrollbar">
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
            <Sensor key={configIdx} config={config} />
          ))}
          {/* - Wrapper which contains a draggable map where we render our grundriss and where you can click on certain things */}
          {/* e.g. storage boxes */}
        </div>
      </div>
    </div>
  );
}
