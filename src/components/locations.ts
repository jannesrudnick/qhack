import { ICommonPosition, ICommonRect } from '@/lib/types';

const FLOORS = 1; // 10;
const BOX_SIZE = 1;
const SHELF_LENGTH = 8; // shelf is 8 boxes in size
const CORRIDOR_WIDTH = 1;
const SENSOR_DISTANCE_FROM_BORDER = 1;
const SENSOR_DISTANCE_BETWEEN = 2;
const NUMBER_OF_SHELVES = 5;

// -------------------------------------------------------------------------------------------------
// IShelfConfig

export interface IShelfConfig {
  idx: number;
  floor: number;
  rect: ICommonRect;
}

export interface ISensorConfig {
  shelfIdx: number;
  floor: number;
  inShelfIdx: number;
  position: ICommonPosition;
}

// -------------------------------------------------------------------------------------------------
// Compute

const ShelfConfigs: IShelfConfig[] = [];
const SensorConfigs: ISensorConfig[] = [];

let left = 0;
let top = 0;

for (let k = 0; k < FLOORS; k += 1) {
  for (let i = 0; i < NUMBER_OF_SHELVES; i += 1) {
    ShelfConfigs.push({
      idx: i,
      floor: k,
      rect: {
        left,
        top,
        width: BOX_SIZE * 2, // two boxes depth
        height: BOX_SIZE * SHELF_LENGTH,
      },
    });

    let inShelfIdx = 0;
    for (let j = SENSOR_DISTANCE_FROM_BORDER; j < SHELF_LENGTH; j += SENSOR_DISTANCE_BETWEEN) {
      SensorConfigs.push({
        shelfIdx: i,
        floor: k,
        inShelfIdx,
        position: {
          left: left + BOX_SIZE, // middle of shelf,
          top: top + j,
        },
      });
      inShelfIdx += 1;
    }

    left += BOX_SIZE * 2; // shelf width
    left += CORRIDOR_WIDTH;
  }
}

export {
  SensorConfigs, ShelfConfigs
};

