import { useEffect } from 'react';
import { Card } from './ui/card';

function SensorOverlay({ id }: { id: string }) {
  useEffect(() => {
    console.log('####### render Overlay');
  }, []);

  return <Card>Sensor-ID: {id}</Card>;
}

export default SensorOverlay;
