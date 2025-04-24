'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export const AlertList = () => {
  const supabase = useSupabaseBrowser();
  const { data: alerts } = useQuery(supabase.from('alerts').select('*').order('created_at', { ascending: false }));

  return (
    <div className="glass-card p-4">
      <p className="font-bold">Incidents</p>
      <p className="text-sm text-gray-500 mb-4">The following incidents have been detected in the last 30 days</p>

      {alerts?.map((item, index) => (
        <div key={index} className="border p-2 rounded-lg mb-4">
          <p>{new Date(item.created_at).toLocaleString()}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                item.status === 'closed' ? 'bg-green-500' : 
                item.status === 'investigating' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">Shelf {item.location_shelf_idx}, Floor {0}</p>
                <p className="text-sm text-gray-500">Sensor {item.location_sensor_idx}</p>
              </div>
            </div>
            <div className="text-right">
              {item.status === 'open' && (
                <Button onClick={() => alert('currently not implemented')} variant="outline" className="mb-auto" size="sm">
                  <CheckCircle2 className="w-4 h-4" /> Mark as closed
                </Button>
              )}
              <p className={`text-sm font-medium ${
                item.status === 'closed' ? 'text-green-600' : 
                item.status === 'investigating' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </p>
              {/** TODO: add real value */}
              <p className="text-sm text-gray-500">TVOC: {(Math.random() * 100).toLocaleString()} ppm</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
