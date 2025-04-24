// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
Deno.serve(async (req)=>{
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
    const payload = await req.json();
    const record = payload.record;
    const { value, shelf_index, sensor_index } = record;
    const { data: measurements, error: fetchError } = await supabase.from('measurements_simulation').select('created_at, value').eq('shelf_index', shelf_index).eq('sensor_index', sensor_index).order('created_at', {
      ascending: false
    }).limit(12);
    if (fetchError) throw fetchError;
    const recent = measurements.reverse();
    function linearRegression(points) {
      const n = points.length;
      const sumX = points.reduce((acc, _, i)=>acc + i, 0);
      const sumY = points.reduce((acc, p)=>acc + p.y, 0);
      const sumXY = points.reduce((acc, p, i)=>acc + i * p.y, 0);
      const sumX2 = points.reduce((acc, _, i)=>acc + i * i, 0);
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      return {
        slope,
        intercept
      };
    }
    const points = recent.map((d, i)=>({
        x: i,
        y: d.value
      }));
    const { slope, intercept } = linearRegression(points);
    console.log('Slope:', slope);
    const SLOPE_THRESHOLD = 1.5;
    const VALUE_TOLERANCE = 3;
    const followsTrend = points.every((point)=>{
      const expectedY = slope * point.x + intercept;
      return point.y >= expectedY - VALUE_TOLERANCE;
    });
    const { data: existingAlerts, error: alertError } = await supabase.from('alerts').select('id').eq('location_shelf_idx', shelf_index).eq('location_sensor_idx', sensor_index).eq('status', 'open').limit(1);
    if (alertError) throw alertError;
    const alertExists = existingAlerts.length > 0;
    if (slope > SLOPE_THRESHOLD && followsTrend && !alertExists) {
      console.log("ALERT! ALERT! ALERT!");
      await supabase.from('alerts').insert([
        {
          shelf_index,
          sensor_index,
          status: 'open',
          triggered_at: new Date().toISOString(),
          slope,
          current_value: value
        }
      ]);
    }
    return new Response(JSON.stringify({
      trend_slope: slope,
      rising: slope > SLOPE_THRESHOLD,
      trend_followed: followsTrend,
      alert_exists: alertExists
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({
      message: err?.message ?? err
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
