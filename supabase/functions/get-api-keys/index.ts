
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    // Get API keys from secure storage
    const { data: apiKeys, error: keysError } = await supabaseClient
      .from('api_keys')
      .select('service_name, key_value')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (keysError) {
      console.error("Error fetching API keys:", keysError);
      return new Response(JSON.stringify({ error: "Failed to fetch API keys" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Transform to object format
    const keys: Record<string, string> = {};
    apiKeys?.forEach(key => {
      keys[key.service_name] = key.key_value;
    });

    return new Response(JSON.stringify(keys), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
