import { subHours } from 'date-fns';
import { Point } from './page';

export const Header = ({ points }: { points: Point[] }) => {
  return (
    <>
      <div className="flex gap-4">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold">
            {((points || [])?.reduce((acc, point) => acc + point.value, 0) / (points?.length || 1)).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              },
            )}{' '}
          </h2>
          <p className="text-gray-500">avg. TVOC</p>
          <div className="flex items-center gap-2 mt-4">
            {points && points.length > 0 && (
              <>
                {(() => {
                  const now = new Date();
                  const recentPoints = points
                    .filter((p) => p.createdAt > subHours(now, 12))
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .filter((p) => p.value !== 0);
                  if (recentPoints.length < 2) return null;
                  const change =
                    ((recentPoints[0].value - recentPoints.at(-1)!.value) / recentPoints.at(-1)!.value) * 100;
                  const isPositive = change > 0;

                  return (
                    <>
                      <span
                        className={`text-xs ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full`}
                      >
                        {isPositive ? '+' : ''}
                        {change.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                        %
                      </span>
                      <span className="text-xs text-gray-500">in the last 12h</span>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold">
            {(
              (points || [])?.reduce((acc, point) => acc + point.value_temperature, 0) / (points?.length || 1)
            ).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}{' '}
            °C
          </h2>
          <p className="text-gray-500">avg. temperature</p>
          <div className="flex items-center gap-2 mt-4">
            {points && points.length > 0 && (
              <>
                {(() => {
                  const now = new Date();
                  const recentPoints = points
                    .filter((p) => p.createdAt > subHours(now, 12))
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .filter((p) => p.value_temperature !== 0);
                  if (recentPoints.length < 2) return null;
                  const change =
                    ((recentPoints[0].value_temperature - recentPoints.at(-1)!.value_temperature) /
                      recentPoints.at(-1)!.value_temperature) *
                    100;
                  const isPositive = change > 0;

                  return (
                    <>
                      <span
                        className={`text-xs ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full`}
                      >
                        {isPositive ? '+' : ''}
                        {change.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                        %
                      </span>
                      <span className="text-xs text-gray-500">in the last 12h</span>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold">
            {(
              (points || [])?.reduce((acc, point) => acc + point.value_humidity, 0) / (points?.length || 1)
            ).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}{' '}
            %
          </h2>
          <p className="text-gray-500">avg. humidity</p>
          <div className="flex items-center gap-2 mt-4">
            {points && points.length > 0 && (
              <>
                {(() => {
                  const now = new Date();
                  const recentPoints = points
                    .filter((p) => p.createdAt > subHours(now, 12))
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .filter((p) => p.value_humidity !== 0);
                  if (recentPoints.length < 2) return null;
                  const change =
                    ((recentPoints[0].value_humidity - recentPoints.at(-1)!.value_humidity) /
                      recentPoints.at(-1)!.value_humidity) *
                    100;
                  const isPositive = change > 0;

                  return (
                    <>
                      <span
                        className={`text-xs ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full`}
                      >
                        {isPositive ? '+' : ''}
                        {change.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                        %
                      </span>
                      <span className="text-xs text-gray-500">in the last 12h</span>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
