import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ISensorConfig } from './locations';
import { Card, CardContent } from './ui/card';
import { ChartContainer } from './ui/chart';

function SensorOverlay({ sensorConfig, displayId }: { sensorConfig: ISensorConfig; displayId: string }) {
  const supabase = useSupabaseBrowser();
  const { data: sensorData } = useQuery(
    supabase
      .from('measurements_simulation')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .match({
        location_shelf_idx: sensorConfig.shelfIdx,
        location_floor: sensorConfig.floor,
        location_sensor_idx: sensorConfig.inShelfIdx,
      })
      .single()
      .throwOnError(),
  );

  const { data: hourlyData } = useQuery(
    supabase
      .rpc('get_hourly_measurements', {
        _location_sensor_idx: sensorConfig.inShelfIdx,
        _location_shelf_idx: sensorConfig.shelfIdx,
        _location_floor: sensorConfig.floor,
      })
      .throwOnError(),
  );

  const chartData = hourlyData?.map((data) => ({
    month: new Date(data.hour).getHours(),
    desktop: data.total_value,
  }));

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'red',
    },
  } as any;

  return (
    <Card className="relative z-90">
      <CardContent className="p-4">
        <p className=" font-bold">Sensor #{displayId}</p>

        <ChartContainer config={chartConfig} className="w-48 aspect-square">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(value) => value} />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
        {sensorData ? (
          <>
            <div className="flex justify-between">
              <span className="text-sm">Current VOC:</span>
              <span className="font-bold text-sm text-red-700">{sensorData?.value}ppm</span>
            </div>
            <div className="border-b my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm">Current Temp:</span>
              <span>{sensorData?.value_temperature?.toFixed(2)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Current Humidity:</span>
              <span className="font-bold text-sm">{sensorData?.value_humidity}%</span>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-sm">No data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SensorOverlay;
