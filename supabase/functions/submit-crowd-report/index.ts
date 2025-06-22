import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface CrowdReportPayload {
  spot_id: string;
  reported_level: "Low" | "Medium" | "High";
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase client
    // Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your function's environment
    // For operations requiring user context (like inserting with user_id based on RLS),
    // the client needs to be initialized with the user's auth token.
    // The service role key should be used only for admin-level operations.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // The ANON key is sufficient here if RLS is correctly set up for inserts.
    // The user's JWT will be passed to PostgREST and RLS policies will use auth.uid().
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // 2. Get user ID from JWT
    // The JWT is passed via the Authorization header and Supabase client handles it.
    // We need to fetch the user server-side to confirm and get the ID for the table.
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("User fetch error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed", details: userError?.message }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    // 3. Parse request body
    const payload: CrowdReportPayload = await req.json();
    const { spot_id, reported_level } = payload;

    // 4. Validate input
    if (!spot_id || !reported_level) {
      return new Response(JSON.stringify({ error: "Missing spot_id or reported_level" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["Low", "Medium", "High"].includes(reported_level)) {
      return new Response(JSON.stringify({ error: "Invalid reported_level" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Insert data into crowd_reports
    const { data, error: insertError } = await supabaseClient
      .from("crowd_reports")
      .insert({
        spot_id,
        reported_level,
        user_id: userId, // RLS policy will check this against auth.uid()
        source: "user_report",
      })
      .select() // Optionally return the inserted row
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to submit report", details: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Report submitted successfully", data }), {
      status: 201, // Created
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("General error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
