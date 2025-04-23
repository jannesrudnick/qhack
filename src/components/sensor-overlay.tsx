import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent } from './ui/card';
import { ChartContainer } from './ui/chart';
function SensorOverlay({ id }: { id: string }) {
  //onmount daten von sensor streamen

  const chartData = [
    { month: '08', desktop: 103 },
    { month: '09', desktop: 105 },
    { month: '10', desktop: 111 },
    { month: '11', desktop: 121 },
    { month: '12', desktop: 160 },
    { month: '13', desktop: 190 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'red',
    },
  } as any;

  return (
    <Card className="relative z-90">
      <CardContent className="p-4">
        <p className=" font-bold">Sensor #1</p>

        <ChartContainer config={chartConfig} className="w-48 aspect-square">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex justify-between">
          <span className="text-sm">Current VOC:</span>
          <span className="font-bold text-sm text-red-700">1503ppm</span>
        </div>
        <div className="border-b my-2"></div>
        <div className="flex justify-between">
          <span className="text-sm">Current Temp:</span>
          <span className="font-bold text-sm">7°C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Current Humidity:</span>
          <span className="font-bold text-sm">67%</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm">Current Humidity:</span>
          <span className="font-bold text-sm">67%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default SensorOverlay;
