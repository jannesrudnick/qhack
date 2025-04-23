import { ISensorConfig } from "@/components/locations";
import { SupabaseClient } from "@supabase/supabase-js";


export const getLiveMeasurements = (supabase: SupabaseClient, config: ISensorConfig, selectedTime?: string) => {
  let q = supabase
    .from('measurements_simulation')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .match({ 
      location_shelf_idx: config.shelfIdx,
      location_floor: config.floor,
      location_sensor_idx: config.inShelfIdx,
    })

  if (selectedTime) {
    q = q.gte('time', selectedTime);
  }

  return q
  .maybeSingle()
  .throwOnError();
};