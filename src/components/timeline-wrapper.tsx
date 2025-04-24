'use client';

import { Timeline } from '@/components/timeline';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { add, setMinutes, sub } from 'date-fns';

const INTERVAL_5_MIN = 5 * 60 * 1000;
export function roundDate5Min(date: string): string {
  return new Date(Math.round(new Date(date).getTime() / INTERVAL_5_MIN) * INTERVAL_5_MIN).toISOString();
}

export interface ITimelineMarker {
  time: string;
  value: string;
}

export const TimeLineWrapper =({
  selectedTime,
  setSelectedTime,
  markers,
}: {
  markers: ITimelineMarker[];
  setSelectedTime: (v?: string) => void;
  selectedTime?: string;
}) => {
  const supabase = useSupabaseBrowser();
  const { data: alerts } = useQuery(supabase.from('alerts').select());

  const handleTimeClick = (time: string) => {
    setSelectedTime(roundDate5Min(time));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className=" text-left w-full font-semibold mb-2">choose a time to view historical data</p>
      <Timeline
        startTime={setMinutes(sub(new Date(), { hours: 12 }), 0).toISOString()}
        endTime={new Date().toISOString()}
        markers={(alerts ?? []).map((alert) => ({ time: alert.created_at.toString(), value: 'Incident' }))}
        selectedTime={selectedTime}
        onTimeClick={handleTimeClick}
      />
    </div>
  );
}
