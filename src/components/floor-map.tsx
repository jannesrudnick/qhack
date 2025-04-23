import { Map } from 'lucide-react';

export default function FloorMap() {
  return (
    <div className="bg-gray-500">
      - Wrapper which contains a draggable map where we render our grundriss and where you can click on certain things
      (e.g. storage boxes)
      <Map />
    </div>
  );
}
