// @ts-ignore
import h337 from 'heatmap.js';
import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; value?: number };
type Props = {
  width: number;
  height: number;
  points: Point[];
};

export const HeatmapOverlay = ({ width, height, points }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<ReturnType<typeof h337.create> | null>(null);

  useEffect(() => {
    if (!heatmapRef.current) {
      heatmapRef.current = h337.create({
        container: containerRef.current!,
        radius: 180,
      });
    }

    const heatmap = heatmapRef.current;

    // Reset heatmap data
    heatmap.setData({ max: 1, data: [] });

    console.log('points', points);

    // Set new data
    heatmap.setData({
      max: Math.max(1, ...points.map((p) => p.value ?? 1)),
      data: points.map((p) => ({
        x: p.x * width,
        y: p.y * height,
        value: p.value ?? 1,
      })),
    });
  }, [points, width, height]);

  return <div className="" ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width, height }} />;
}
