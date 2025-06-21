import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface SurfSession {
  id: string;
  user_id: string;
  created_at: string;
  session_date: string;
  spot_id: string;
  spot_name?: string | null;
  rating?: number | null;
  duration_minutes?: number | null;
  wave_count?: number | null;
  notes?: string | null;
  conditions_snapshot?: ConditionSnapshotData | null;
}

interface ConditionSnapshotData {
  waveHeight_ft?: number | null;
  wavePeriod_s?: number | null;
  waveDirection_deg?: number | null;
  waveDirection_cardinal?: string | null;
  windSpeed_mph?: number | null;
  windDirection_deg?: number | null;
  windDirection_cardinal?: string | null;
  temperature_F?: number | null;
  summary?: string | null;
  source?: string;
  error?: string | null;
}

interface PerformanceSnapshot {
  total_sessions: number;
  average_rating: number | null;
  most_frequented_spot_id?: string | null;
  most_frequented_spot_name?: string | null;
  total_duration_minutes: number;
  total_wave_count: number;
  // Could add more: e.g., best rated spot, etc.
}

interface PreferredCondition {
  spot_id: string;
  spot_name?: string | null;
  session_count: number; // Number of highly-rated sessions used for this insight
  avg_waveHeight_ft?: number | null;
  mode_waveDirection_cardinal?: string | null;
  mode_windSpeed_mph_range?: string | null; // e.g., "5-10 mph"
  mode_windDirection_cardinal?: string | null;
}

// Helper to calculate mode of an array of strings or numbers
function calculateMode<T extends string | number>(arr: T[]): T | null {
  if (!arr.length) return null;
  const modeMap: Record<string, number> = {};
  let maxCount = 0;
  let modes: T[] = [];

  arr.forEach((val) => {
    const key = String(val);
    modeMap[key] = (modeMap[key] || 0) + 1;
    if (modeMap[key] > maxCount) {
      maxCount = modeMap[key];
      modes = [val];
    } else if (modeMap[key] === maxCount && !modes.includes(val)) {
      modes.push(val);
    }
  });
  // If multiple modes, return the first one or handle as needed (e.g., join)
  return modes.length ? modes[0] : null;
}

// Helper to bin wind speed
function binWindSpeed(speedMph: number | undefined | null): string | null {
    if (speedMph == null) return null;
    if (speedMph < 5) return "0-5 mph (Light)";
    if (speedMph < 10) return "5-10 mph (Light)";
    if (speedMph < 15) return "10-15 mph (Moderate)";
    if (speedMph < 20) return "15-20 mph (Moderate)";
    if (speedMph < 25) return "20-25 mph (Strong)";
    return ">25 mph (Strong)";
}


serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

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

    const { data: sessions, error: fetchError } = await supabaseClient
      .from("surf_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("session_date", { ascending: false });

    if (fetchError) {
      console.error("Error fetching surf sessions:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch surf sessions" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!sessions || sessions.length === 0) {
      return new Response(JSON.stringify({ performance_snapshot: { total_sessions: 0 }, preferred_conditions_by_spot: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate Performance Snapshot
    let totalRatingSum = 0;
    let ratedSessionsCount = 0;
    let totalDuration = 0;
    let totalWaves = 0;
    const spotFrequency: Record<string, { name?: string | null, count: number }> = {};

    sessions.forEach((s: SurfSession) => {
      if (s.rating != null) {
        totalRatingSum += s.rating;
        ratedSessionsCount++;
      }
      totalDuration += s.duration_minutes || 0;
      totalWaves += s.wave_count || 0;
      if(s.spot_id) {
        spotFrequency[s.spot_id] = spotFrequency[s.spot_id] || { name: s.spot_name, count: 0};
        spotFrequency[s.spot_id].count++;
      }
    });

    const performanceSnapshot: PerformanceSnapshot = {
      total_sessions: sessions.length,
      average_rating: ratedSessionsCount > 0 ? parseFloat((totalRatingSum / ratedSessionsCount).toFixed(1)) : null,
      most_frequented_spot_id: null,
      most_frequented_spot_name: null,
      total_duration_minutes: totalDuration,
      total_wave_count: totalWaves,
    };

    let maxFreq = 0;
    for(const spotId in spotFrequency){
        if(spotFrequency[spotId].count > maxFreq){
            maxFreq = spotFrequency[spotId].count;
            performanceSnapshot.most_frequented_spot_id = spotId;
            performanceSnapshot.most_frequented_spot_name = spotFrequency[spotId].name || spotId;
        }
    }


    // Calculate Preferred Conditions by Spot
    const preferredConditionsBySpot: PreferredCondition[] = [];
    const sessionsBySpot: Record<string, SurfSession[]> = {};
    sessions.forEach(s => {
      if (!sessionsBySpot[s.spot_id]) sessionsBySpot[s.spot_id] = [];
      sessionsBySpot[s.spot_id].push(s);
    });

    const MIN_SESSIONS_FOR_INSIGHT = 3; // Min highly-rated sessions to generate insight for a spot

    for (const spotId in sessionsBySpot) {
      const spotSessions = sessionsBySpot[spotId];
      const highlyRatedSessions = spotSessions.filter(s => s.rating != null && s.rating >= 4 && s.conditions_snapshot && !s.conditions_snapshot.error);

      if (highlyRatedSessions.length >= MIN_SESSIONS_FOR_INSIGHT) {
        const spotName = highlyRatedSessions[0].spot_name || spotId;
        const waveHeights: number[] = [];
        const waveDirections: string[] = [];
        const windSpeedsBinned: string[] = [];
        const windDirections: string[] = [];

        highlyRatedSessions.forEach(s => {
          const conditions = s.conditions_snapshot;
          if (conditions) {
            if (conditions.waveHeight_ft != null) waveHeights.push(conditions.waveHeight_ft);
            if (conditions.waveDirection_cardinal != null) waveDirections.push(conditions.waveDirection_cardinal);
            const binnedSpeed = binWindSpeed(conditions.windSpeed_mph);
            if (binnedSpeed != null) windSpeedsBinned.push(binnedSpeed);
            if (conditions.windDirection_cardinal != null) windDirections.push(conditions.windDirection_cardinal);
          }
        });

        preferredConditionsBySpot.push({
          spot_id: spotId,
          spot_name: spotName,
          session_count: highlyRatedSessions.length,
          avg_waveHeight_ft: waveHeights.length ? parseFloat((waveHeights.reduce((a,b) => a+b,0) / waveHeights.length).toFixed(1)) : null,
          mode_waveDirection_cardinal: calculateMode(waveDirections),
          mode_windSpeed_mph_range: calculateMode(windSpeedsBinned),
          mode_windDirection_cardinal: calculateMode(windDirections),
        });
      }
    }

    return new Response(JSON.stringify({
      performance_snapshot: performanceSnapshot,
      preferred_conditions_by_spot: preferredConditionsBySpot,
      raw_sessions_for_debug: sessions, // Optionally remove for production
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("General error in get-surf-log-insights:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred", details: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
