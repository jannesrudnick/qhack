'use client';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useState } from 'react';

export const SimulateAlert = () => {
  const supabase = useSupabaseBrowser();
  const [locationShelfIdx, setLocationShelfIdx] = useState('');
  const [locationSensorIdx, setLocationSensorIdx] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('alerts').insert([
      {
        location_sensor_idx: Number(locationSensorIdx),
        location_shelf_idx: Number(locationShelfIdx),
      },
    ]);

    if (error) {
      console.error('Error inserting alert:', error.message);
    } else {
      console.log('Alert inserted successfully');
      setLocationShelfIdx('');
      setLocationSensorIdx('');
    }
  };

  return (
    <div>
      <h1>Simulate Alert</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Location Shelf Index:
            <input
              type="text"
              value={locationShelfIdx}
              onChange={(e) => setLocationShelfIdx(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location Sensor Index:
            <input
              type="text"
              value={locationSensorIdx}
              onChange={(e) => setLocationSensorIdx(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
