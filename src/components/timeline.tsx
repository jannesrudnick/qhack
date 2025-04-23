'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { addMinutes, differenceInMinutes, format, parseISO } from 'date-fns';

interface TimelineMarker {
  time: string;
  value?: string;
  highlighted?: boolean;
}

interface TimelineProps {
  startTime: string;
  endTime: string;
  markers: TimelineMarker[];
  hourInterval?: number;
  className?: string;
  selectedTime?: string;
  onTimeClick?: (time: string) => void;
}

export function Timeline({
  startTime,
  endTime,
  markers,
  hourInterval = 1,
  className,
  selectedTime,
  onTimeClick,
}: TimelineProps) {
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  console.log('tt', startTime, endTime);

  const start = parseISO(startTime);
  const end = parseISO(endTime);
  const totalMinutes = differenceInMinutes(end, start);
  const totalHours = totalMinutes / 60;

  // Generate hour markers
  const hourMarkers = [];
  for (let i = 0; i <= totalHours; i += hourInterval) {
    const time = addMinutes(start, i * 60);
    hourMarkers.push(time);
  }

  // Calculate position for a specific time
  const getTimePosition = (isoTime: string) => {
    const time = parseISO(isoTime);
    const minutesFromStart = differenceInMinutes(time, start);
    const position = (minutesFromStart / totalMinutes) * 100;
    return `${position}%`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onTimeClick) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentPosition = (clickPosition / rect.width) * 100;

    const clickedMinutes = (percentPosition / 100) * totalMinutes;
    const clickedTime = addMinutes(start, clickedMinutes);
    console.log('clickedTime', clickedTime, start, clickedMinutes);
    onTimeClick(clickedTime.toISOString());
  };

  return (
    <div className={cn('w-full px-4 py-6', className)}>
      <div className='relative w-full h-20 cursor-pointer' onClick={handleTimelineClick}>
        <div className='absolute top-8 left-0 right-0 h-0.5 bg-gray-900'></div>

        {hourMarkers.map((time) => (
          <div
            key={time.toISOString()}
            className='absolute top-7 flex flex-col items-center -translate-x-1/2'
            style={{ left: getTimePosition(time.toISOString()) }}
          >
            <div className='h-2 w-0.5 bg-gray-900 mb-1'></div>
            <div className='text-xs text-gray-900'>{format(time, 'HH:mm')}</div>
          </div>
        ))}

        {selectedTime && (
          <div
            className='absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10'
            style={{ left: getTimePosition(selectedTime) }}
          >
            <div
              className='absolute -top-6 -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs'>
              {format(parseISO(selectedTime), 'HH:mm')}
            </div>
            <div
              className='absolute -translate-x-1/2 top-8 h-3 w-3 rounded-full bg-blue-500 border-2 border-white'></div>
          </div>
        )}

        {markers.map((marker, index) => (
          <div
            key={index}
            className='absolute -translate-x-1/2'
            style={{ left: getTimePosition(marker.time) }}
            onMouseEnter={() => setHoveredTime(marker.time)}
            onMouseLeave={() => setHoveredTime(null)}
          >
            {marker.value && (
              <div className='absolute bottom-4 mb-1 -translate-x-1/2 left-1/2'>
                <div
                  className='bg-gray-100 px-2 py-1 rounded text-xs font-medium'>{marker.value}</div>
              </div>
            )}
            <div className='h-3 w-3 rounded-full bg-gray-400 mt-[26px]'></div>
          </div>
        ))}

        {hoveredTime && !markers.find((m) => m.time === hoveredTime)?.highlighted && (
          <div
            className='absolute top-4 -translate-x-1/2 text-xs bg-gray-100 px-1 rounded'
            style={{ left: getTimePosition(hoveredTime) }}
          >
            {format(parseISO(hoveredTime), 'HH:mm')}
          </div>
        )}
      </div>
    </div>
  );
}
