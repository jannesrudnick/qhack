
const FLOORS = 10;
const BOX_SIZE = 1;
const SHELF_LENGTH = 8; // shelf is 8 boxes in size
const CORRIDOR_WIDTH = 1;

export interface IShelfConfig {
  left: number;
  top: number;
  width: number;
  height: number;
}

const ShelfConfigs: IShelfConfig[] = [];

let left = 0;

for (let i = 0; i < 8; i += 1) {
  ShelfConfigs.push({
    left,
    top: 0,
    width: BOX_SIZE * 2, // two boxes depth
    height: BOX_SIZE * SHELF_LENGTH,
  });

  left += BOX_SIZE * 2; // shelf width
  left += CORRIDOR_WIDTH;
}

export {
  ShelfConfigs,
};
