import IconButton from '@/components/icon-button';
import { EllipsisVertical, LucideMap, User2 } from 'lucide-react';
import { Point } from './page';


function Header({ points }: { points: Point[] }) {
  return (
    <>
      <div className="flex justify-between">
        <div className="h-14 bg-white rounded-full px-4 flex items-center justify-center">
          Unser<b>Logo</b>
        </div>
        <div className="flex gap-4 items-center">
          <IconButton icon={<LucideMap />} />
          <IconButton icon={<User2 />} />
          <IconButton icon={<EllipsisVertical />} />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center my-6">
          <div className="flex flex-col">
            <p className="text-gray-500">Comprehensive Insights</p>
            <p className="font-bold">Executive Overview</p>
          </div>
          <div className="ml-auto"></div>
        </div>
        <div className="ml-auto"></div>
      </div>
      <div className="flex gap-4">
        <div className="glass-card">
          <h2 className="text-2xl font-bold">{((points || [])?.reduce((acc, point) => acc + point.value, 0) / (points?.length || 1)).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
          </h2>
          <p className="text-gray-500">Durchschnittlicher VOC</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+12.40%</span>
            <span className="text-xs text-gray-500">vs. letzte Woche</span>
          </div>
        </div>
        <div className="glass-card">
          <h2 className="text-2xl font-bold">{((points || [])?.reduce((acc, point) => acc + point.value_temperature, 0) / (points?.length || 1)).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
          </h2>
          <p className="text-gray-500">Durchschnittliche Temperatur</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">-2.3%</span>
            <span className="text-xs text-gray-500">vs. letzte Woche</span>
          </div>
        </div>
        <div className="glass-card">
          <h2 className="text-2xl font-bold">{((points || [])?.reduce((acc, point) => acc + point.value_humidity, 0) / (points?.length || 1)).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
          </h2>
          <p className="text-gray-500">Durchschnittliche Luftfeuchtigkeit</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+5.25%</span>
            <span className="text-xs text-gray-500">vs. letzte Woche</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
