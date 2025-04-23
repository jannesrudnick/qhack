'use client';

import { Timeline } from '@/components/timeline';
import { useState } from 'react';

export default function TimeLineWrapper() {
  // Beispieldaten für die Timeline
  const timelineMarkers = [
    { time: '9:00', value: 'Incident' },
    { time: '9:00', value: 'Incident' },
    { time: '11:15', value: 'Incident' },
  ];

  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    console.log(`Springe zu Zeitpunkt: ${time}`);
    // Hier können Sie weitere Aktionen ausführen, z.B. Daten für diesen Zeitpunkt laden
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between items-center mb-6">
        {/*

        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
              12
            </div>
            <span className="text-sm text-gray-600">Mold-Detections</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
              25
            </div>
            <span className="text-sm text-gray-600">Other Detections</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
              3
            </div>
            <span className="text-sm text-gray-600">Mold-Incidents</span>
          </div>
        </div>

        <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Live</button>
       */}
      </div>

      <Timeline
        startTime="8:00"
        endTime="12:00"
        markers={timelineMarkers}
        selectedTime={selectedTime}
        onTimeClick={handleTimeClick}
      />

      {selectedTime && false && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">Ausgewählter Zeitpunkt: {selectedTime}</h3>
          <p className="text-sm text-gray-600 mt-1">Hier könnten Details zu diesem Zeitpunkt angezeigt werden.</p>
        </div>
      )}
    </div>
  );
}
