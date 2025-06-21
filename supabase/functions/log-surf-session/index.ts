import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface SurfSessionPayload {
  session_date: string; // ISO 8601 string
  spot_id: string;
  spot_name?: string;
  rating?: number;
  duration_minutes?: number;
  wave_count?: number;
  notes?: string;
}

interface ConditionSnapshot {
  waveHeight_ft?: number | null;
  wavePeriod_s?: number | null;
  waveDirection_deg?: number | null;
  waveDirection_cardinal?: string | null;
  windSpeed_mph?: number | null;
  windDirection_deg?: number |null;
  windDirection_cardinal?: string | null;
  temperature_F?: number | null; // NWS provides temp in C usually
  summary?: string | null; // Short weather summary
  source?: string;
  error?: string | null;
}

// Helper to convert degrees to cardinal directions
function degreesToCardinal(deg: number | undefined | null): string | null {
  if (deg == null) return null;
  const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return cardinals[Math.round(deg / 22.5) % 16];
}

async function getNoaaConditions(latitude: number, longitude: number, sessionDate: Date, supabaseClient: SupabaseClient): Promise<ConditionSnapshot | null> {
  const userAgent = "WaveMentorApp/1.0 (contact@wavementor.app)"; // NOAA requires a User-Agent
  let snapshot: ConditionSnapshot = { source: "NOAA NWS API" };

  try {
    // 1. Get gridpoint URL
    const pointsUrl = `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsResponse = await fetch(pointsUrl, { headers: { "User-Agent": userAgent, "Accept": "application/geo+json" } });
    if (!pointsResponse.ok) {
      snapshot.error = `Failed to get gridpoint: ${pointsResponse.status} ${await pointsResponse.text()}`;
      console.error('log-surf-session: NOAA points API error:', snapshot.error); // Specific log
      return snapshot;
    }
    const pointsData = await pointsResponse.json();
    const gridDataUrl = pointsData.properties?.forecastGridData;

    if (!gridDataUrl) {
      snapshot.error = "Forecast grid data URL not found in NWS points response.";
      console.error('log-surf-session: NOAA grid data URL not found:', snapshot.error); // Specific log
      return snapshot;
    }

    // 2. Fetch grid data
    const gridResponse = await fetch(gridDataUrl, { headers: { "User-Agent": userAgent, "Accept": "application/geo+json" } });
    if (!gridResponse.ok) {
      snapshot.error = `Failed to get grid data: ${gridResponse.status} ${await gridResponse.text()}`;
      console.error('log-surf-session: NOAA grid data fetch error:', snapshot.error); // Specific log
      return snapshot;
    }
    const gridData = await gridResponse.json();
    console.log('log-surf-session: Raw NOAA Grid Data Response:', gridData); // LOG ADDED
    const props = gridData.properties;

    // --- Helper to find closest value to sessionDate ---
    const findClosestValue = (param: any, targetDate: Date) => {
      if (!param || !param.values || !Array.isArray(param.values)) return null;
      let closest = null;
      let minDiff = Infinity;

      for (const entry of param.values) {
        // Valid time is like "2024-06-17T10:00:00+00:00/PT1H"
        const timeStr = entry.validTime.split("/")[0];
        const entryDate = new Date(timeStr);
        const diff = Math.abs(entryDate.getTime() - targetDate.getTime());

        if (diff < minDiff) {
          minDiff = diff;
          closest = entry.value;
        }
      }
      // If closest is still too far (e.g. > 3 hours), maybe discard it
      if (minDiff > 3 * 60 * 60 * 1000) return null;
      return closest;
    };

    // --- Extract data ---
    // Wave Height (often in meters)
    const wh = findClosestValue(props.waveHeight, sessionDate);
    if (wh !== null) snapshot.waveHeight_ft = Math.round(wh * 3.28084 * 10) / 10; // Meters to feet

    // Wave Period (seconds)
    const wp = findClosestValue(props.wavePeriod, sessionDate);
    if (wp !== null) snapshot.wavePeriod_s = wp;

    // Wave Direction (degrees)
    const wd = findClosestValue(props.waveDirection, sessionDate);
    if (wd !== null) {
      snapshot.waveDirection_deg = wd;
      snapshot.waveDirection_cardinal = degreesToCardinal(wd);
    }

    // Wind Speed (often m/s)
    const ws = findClosestValue(props.windSpeed, sessionDate);
    if (ws !== null) snapshot.windSpeed_mph = Math.round(ws * 2.23694 * 10) / 10; // m/s to mph

    // Wind Direction (degrees)
    const windDir = findClosestValue(props.windDirection, sessionDate);
    if (windDir !== null) {
      snapshot.windDirection_deg = windDir;
      snapshot.windDirection_cardinal = degreesToCardinal(windDir);
    }

    // Temperature (often Celsius) - NWS provides temperature in 'temperature' property
    const temp = findClosestValue(props.temperature, sessionDate);
    if (temp !== null) snapshot.temperature_F = Math.round((temp * 9/5) + 32); // C to F

    // Short Summary (less reliable, often not available in grid data directly, might be in 'weather')
    // For MVP, this might be too complex to reliably extract.
    // snapshot.summary = "N/A";

    if (Object.keys(snapshot).length === 1 && snapshot.source) { // Only source field, no data
        snapshot.error = "Relevant conditions data not found at specified time/location in NWS response.";
    }

  } catch (e) {
    console.error('log-surf-session: NOAA API call exception:', e.message, e.stack); // Specific log with stack
    snapshot.error = `Exception during NOAA API call: ${e.message}`;
  }
  console.log('log-surf-session: Parsed snapshotData:', snapshot); // LOG ADDED
  return snapshot;
}


serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Clone request to log body, then use original request for processing
  const reqClone = req.clone();
  let bodyForLogging = {};
  try {
    bodyForLogging = await reqClone.json();
  } catch (e) {
    // Could be empty body, or not JSON. Log that it's not typical JSON payload.
    bodyForLogging = { warning: "Could not parse request body as JSON or body is empty.", firstBytes: await reqClone.text().then(t => t.slice(0,100)) };
  }
  console.log('log-surf-session: Input payload:', bodyForLogging); // LOG ADDED

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const payload: SurfSessionPayload = await req.json();
    const { session_date, spot_id, spot_name, rating, duration_minutes, wave_count, notes } = payload;

    if (!session_date || !spot_id) {
      return new Response(JSON.stringify({ error: "Missing session_date or spot_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sessionDateObj = new Date(session_date);

    // Fetch spot location (assuming public.surf_spot_locations table)
    let conditionsData: ConditionSnapshot | null = null;
    const { data: spotLocation, error: spotError } = await supabaseClient
      .from("surf_spot_locations") // This table is assumed to exist
      .select("latitude, longitude")
      .eq("spot_id", spot_id)
      .maybeSingle();

    if (spotError) {
      console.error('log-surf-session: Error fetching spot location:', spotError.message, spotError.stack); // Specific log with stack
      // Proceed without conditions if spot location lookup fails, or return error?
      // For MVP, proceeding with null conditions_snapshot.
      conditionsData = { error: "Failed to fetch spot location: " + spotError.message, source: "Internal System" };
    } else if (spotLocation) {
      console.log('log-surf-session: Fetched coordinates:', { spot_id, latitude: spotLocation.latitude, longitude: spotLocation.longitude }); // LOG ADDED
      conditionsData = await getNoaaConditions(spotLocation.latitude, spotLocation.longitude, sessionDateObj, supabaseClient);
    } else {
      console.log('log-surf-session: Spot ID not found in locations table:', spot_id); // LOG ADDED
      // Spot not found in surf_spot_locations
      conditionsData = { error: `Spot ID ${spot_id} not found in locations table.`, source: "Internal System" };
    }

    const sessionToInsert = {
      user_id: userId,
      session_date: sessionDateObj.toISOString(),
      spot_id,
      spot_name: spot_name || null, // Use provided spot_name or null
      rating: rating || null,
      duration_minutes: duration_minutes || null,
      wave_count: wave_count || null,
      notes: notes || null,
      conditions_snapshot: conditionsData,
    };

    const { data: insertedSession, error: insertError } = await supabaseClient
      .from("surf_sessions")
      .insert(sessionToInsert)
      .select()
      .single();

    if (insertError) {
      console.error('log-surf-session: Supabase insert error:', insertError.message, insertError.stack); // Specific log with stack
      return new Response(JSON.stringify({ error: "Failed to log session", details: insertError.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(insertedSession), {
      status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error('log-surf-session: Error:', e.message, e.stack); // Standardized main catch
    return new Response(JSON.stringify({ error: "An unexpected error occurred", details: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
