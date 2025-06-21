
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
  'Access-Control-Max-Age': '86400',
};

const getSimpleHeuristicPrediction = (spotId: string): { predicted_level: "Low" | "Medium" | "High", source: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
  const hour = now.getHours(); // 0 - 23

  let predicted_level: "Low" | "Medium" | "High";

  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays (Mon-Fri)
    if (hour >= 9 && hour < 17) { // 9 AM - 5 PM
      predicted_level = "Low";
    } else if (hour >= 17 && hour < 20) { // 5 PM - 8 PM
      predicted_level = "Medium";
    } else {
      predicted_level = "Low";
    }
  } else { // Weekends (Sat-Sun)
    if (hour >= 9 && hour < 18) { // 9 AM - 6 PM
      predicted_level = "High";
    } else {
      predicted_level = "Medium";
    }
  }
  return { predicted_level, source: "heuristic_prediction_v1" };
};

const getLatestUserReport = async (supabaseClient: SupabaseClient, spotId: string): Promise<{ predicted_level: "Low" | "Medium" | "High", source: string } | null> => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseClient
    .from("crowd_reports")
    .select("reported_level, created_at")
    .eq("spot_id", spotId)
    .eq("source", "user_report") // Only consider user reports for this logic
    .gte("created_at", twoHoursAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching latest user report:", error);
    return null; // Fallback to heuristic if error
  }

  if (data) {
    return { predicted_level: data.reported_level as "Low" | "Medium" | "High", source: "user_report_recent" };
  }
  return null;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let spot_id: string | null = null;

    // Handle both GET and POST requests
    if (req.method === "GET") {
      const url = new URL(req.url);
      spot_id = url.searchParams.get("spot_id");
    } else if (req.method === "POST") {
      try {
        const body = await req.json();
        spot_id = body.spot_id;
      } catch (error) {
        console.error("Error parsing POST body:", error);
      }
    }

    if (!spot_id) {
      return new Response(JSON.stringify({ error: "Missing spot_id parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    let prediction;
    try {
      const latestReport = await getLatestUserReport(supabaseClient, spot_id);
      prediction = latestReport || getSimpleHeuristicPrediction(spot_id);
    } catch (error) {
      console.error("Error getting crowd prediction:", error);
      prediction = getSimpleHeuristicPrediction(spot_id);
    }

    return new Response(JSON.stringify({ spot_id, ...prediction }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("General error:", error);
    return new Response(JSON.stringify({ 
      error: "An unexpected error occurred", 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
