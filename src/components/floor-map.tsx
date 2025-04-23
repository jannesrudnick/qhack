'use client';
import { IShelfConfig, ShelfConfigs } from '@/components/locations';
import React, { ReactNode, useMemo } from 'react';

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
        left: boxCoords(config.left),
        top: boxCoords(config.top),
        width: boxCoords(config.width),
        height: boxCoords(config.height),
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
      r.width = Math.max(shelf.left + shelf.width);
      r.height = Math.max(shelf.top + shelf.height);
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

            for (let i = 0; i < config.width; i += 1) {
              for (let j = 0; j < config.height; j += 1) {
                boxes.push(<ShelfBox key={`${i}_${j}`} left={config.left + i} top={config.top + j} />);
              }
            }

            return (
              <React.Fragment key={configIdx}>
                <Shelf config={config} />
                {boxes}
              </React.Fragment>
            );
          })}
          {/* - Wrapper which contains a draggable map where we render our grundriss and where you can click on certain things */}
          {/* e.g. storage boxes */}
        </div>
      </div>
    </div>
  );
}
