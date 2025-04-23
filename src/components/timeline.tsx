'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { useState } from 'react';

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

  // Parse start and end times
  const startHour = Number.parseInt(startTime.split(':')[0]);
  const endHour = Number.parseInt(endTime.split(':')[0]);
  const totalHours = endHour - startHour;

  // Generate hour markers
  const hourMarkers = [];
  for (let i = 0; i <= totalHours; i += hourInterval) {
    const hour = startHour + i;
    hourMarkers.push(`${hour}:00`);
  }

  // Calculate position for a specific time
  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const position = ((hours - startHour + minutes / 60) / totalHours) * 100;
    return `${position}%`;
  };

  // Handle timeline click to determine the time at click position
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onTimeClick) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentPosition = (clickPosition / rect.width) * 100;

    // Convert percent position to time
    const totalMinutes = totalHours * 60;
    const clickedMinutes = (percentPosition / 100) * totalMinutes;

    const hours = Math.floor(clickedMinutes / 60) + startHour;
    const minutes = Math.floor(clickedMinutes % 60);

    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    onTimeClick(formattedTime);
  };

  return (
    <div className={cn('w-full px-4 py-6', className)}>
      <div className="relative w-full h-20 cursor-pointer" onClick={handleTimelineClick}>
        {/* Timeline base line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-900"></div>

        {/* Hour markers */}
        {hourMarkers.map((time) => (
          <div
            key={time}
            className="absolute top-7 flex flex-col items-center -translate-x-1/2"
            style={{ left: getTimePosition(time) }}
          >
            <div className="h-2 w-0.5 bg-gray-900 mb-1"></div>
            <div className="text-xs text-gray-900">{time}</div>
          </div>
        ))}

        {/* Selected time indicator */}
        {selectedTime && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
            style={{ left: getTimePosition(selectedTime) }}
          >
            <div className="absolute -top-6 -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {selectedTime}
            </div>
            <div className="absolute -translate-x-1/2 top-8 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
          </div>
        )}

        {/* Data markers */}
        {markers.map((marker, index) => (
          <div
            key={index}
            className="absolute -translate-x-1/2"
            style={{ left: getTimePosition(marker.time) }}
            onMouseEnter={() => setHoveredTime(marker.time)}
            onMouseLeave={() => setHoveredTime(null)}
          >
            {marker.value && (
              <div className="absolute bottom-4 mb-1 -translate-x-1/2 left-1/2">
                <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{marker.value}</div>
              </div>
            )}

            <div className="h-3 w-3 rounded-full bg-gray-400 mt-[26px]"></div>
          </div>
        ))}

        {/* Hover indicator */}
        {hoveredTime && !markers.find((m) => m.time === hoveredTime)?.highlighted && (
          <div
            className="absolute top-4 -translate-x-1/2 text-xs bg-gray-100 px-1 rounded"
            style={{ left: getTimePosition(hoveredTime) }}
          >
            {hoveredTime}
          </div>
        )}
      </div>
    </div>
  );
}
