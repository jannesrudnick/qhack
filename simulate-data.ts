
// Typ: Sensorwert-Funktion
import { format, parse } from 'date-fns';
import { createClient } from '@supabase/supabase-js';
import { Database, Tables } from '@/types_db';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

type SensorFunction = (time: number) => number;

// Hilfsfunktion für exponentielles Wachstum nach einer Startzeit
const createGrowthFunction = (
  startHour: number,
  growthRate: number,
  factor: number
): SensorFunction => {
  return (time: number) => {
    if (time < startHour * 60 * 60 * 1000) return 0;
    return factor * Math.exp(growthRate * (time - startHour * 60 * 60 * 1000) / (60 * 60 * 1000));
  };
};

// VOC-Sensor (startet bei 12h)
export const getVOCValue: SensorFunction = createGrowthFunction(12, 0.1, 0.05);

// CO₂-Sensor (startet bei 16h)
export const getCO2Value: SensorFunction = createGrowthFunction(16, 0.08, 0.03);

// Ethanol-Sensor (startet bei 10h)
export const getEthanolValue: SensorFunction = createGrowthFunction(10, 0.12, 0.07);
const MAX_VALUE_ETHANOL = Infinity;

// E-Nose (startet bei 8h, reagiert früh & stark)
export const getENoseValue: SensorFunction = createGrowthFunction(8, 0.15, 0.06);

// -------------------------------------------------------------------------------------------------
// defineOutbreak

const SIM_START = parse('2025-04-22 00:00', 'yyyy-MM-dd HH:mm', new Date());
const SIM_END = parse('2025-04-27 00:00', 'yyyy-MM-dd HH:mm', new Date());
const INTERVAL = 5 * 60 * 1000;

function defineOutbreak(startTime: string, fn: SensorFunction, maxValue: number, location: [shelfIdx: number, floor: number, sensorIdx: number]) {
  return {
    startTime: parse(startTime, 'yyyy-MM-dd HH:mm', new Date()),
    maxValue,
    fn,
    location,
  };
}

const outbreaks = [
  defineOutbreak('2025-04-22 07:00', getEthanolValue, MAX_VALUE_ETHANOL, [4, 0, 1]),
  defineOutbreak('2025-04-22 15:00', getEthanolValue, MAX_VALUE_ETHANOL, [2, 0, 3]),
  defineOutbreak('2025-04-23 01:00', getEthanolValue, MAX_VALUE_ETHANOL, [4, 0, 4]),
  defineOutbreak('2025-04-23 03:00', getEthanolValue, MAX_VALUE_ETHANOL, [5, 0, 2]),
];

interface ISimValue {
  time: number;
  location: ReturnType<typeof defineOutbreak>['location'];
  value: number;
}

const simData: Tables<'measurements_simulation'>[] = [];

let count = 0;

console.log(SIM_START, SIM_END, SIM_END.getTime() - SIM_START.getTime(), INTERVAL)

for (let time = SIM_START.getTime(); time < SIM_END.getTime(); time += INTERVAL) {
  count += 1;
  for (const outbreak of outbreaks) {
    if (time < outbreak.startTime.getTime()) continue;
    const value = outbreak.fn(time-outbreak.startTime.getTime());
    if (value > outbreak.maxValue) continue;
    simData.push({
      id: crypto.randomUUID(),
      time: new Date(time).toISOString(),
      location_shelf_idx: outbreak.location[0],
      location_floor: outbreak.location[1],
      location_sensor_idx: outbreak.location[2],
      value
    });
  }
}

console.log('sim data', simData.length, count);

(async () => {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  await supabase.from('measurements_simulation')
    .delete({})
    .filter('value', 'gt', -100000)
    .throwOnError();

  console.log('all deleted');

  await supabase.from('measurements_simulation')
    .insert(simData)
    .throwOnError();

  console.log('all inserted');
})();
