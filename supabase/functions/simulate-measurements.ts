// supabase/functions/insert_measurement/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
Deno.serve(async (req)=>{
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization') ?? ''
        }
      }
    });
    const now = new Date().toISOString();
    const entries = [];
    for(let sensor = 0; sensor <= 4; sensor++){
      for(let shelf = 0; shelf <= 5; shelf++){
        const { data: latest, error: fetchError } = await supabase.from("measurements_simulation").select("value, value_temperature, value_humidity").eq("location_sensor_idx", sensor).eq("location_shelf_idx", shelf).order("created_at", {
          ascending: false
        }).limit(1).single();
        if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
        const baseValue = latest?.value ?? 100;
        const baseTemp = latest?.value_temperature ?? 40;
        const baseHumidity = latest?.value_humidity ?? 40;
        const factor = 1 + (Math.random() < 0.5 ? 0.04 : -0.04);
        entries.push({
          time: now,
          location_floor: 0,
          location_sensor_idx: sensor,
          location_shelf_idx: shelf,
          value: Math.round(baseValue * factor),
          value_temperature: baseTemp * factor,
          value_humidity: Math.round(baseHumidity * factor)
        });
      }
    }
    const { error } = await supabase.from("measurements_simulation").insert(entries);
    if (error) throw error;
    return new Response(JSON.stringify({
      success: true
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
