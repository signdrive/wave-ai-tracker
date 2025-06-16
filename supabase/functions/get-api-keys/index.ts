
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-API-KEYS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logStep("ERROR: Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: "Missing or invalid authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user");
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      logStep("ERROR: Authentication failed", { error: authError?.message });
      return new Response(JSON.stringify({ error: "Invalid authentication token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    logStep("User authenticated", { userId: user.id });

    // Simple admin check - in production, implement proper role checking
    const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      logStep("ERROR: Insufficient permissions", { userId: user.id, email: user.email });
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    logStep("Fetching API keys from database");

    // Get API keys from secure storage with error handling
    const { data: apiKeys, error: keysError } = await supabaseClient
      .from('api_keys')
      .select('service_name, key_value')
      .eq('is_active', true);

    if (keysError) {
      logStep("ERROR: Database error fetching API keys", { error: keysError.message });
      
      // Return empty object instead of error to prevent frontend crashes
      return new Response(JSON.stringify({}), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Transform to object format safely
    const keys: Record<string, string> = {};
    if (apiKeys && Array.isArray(apiKeys)) {
      for (const key of apiKeys) {
        if (key.service_name && key.key_value) {
          keys[key.service_name] = key.key_value;
        }
      }
    }

    logStep("Successfully retrieved API keys", { keyCount: Object.keys(keys).length });

    return new Response(JSON.stringify(keys), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("ERROR: Unexpected error", { error: error instanceof Error ? error.message : String(error) });
    
    // Return empty object to prevent frontend crashes
    return new Response(JSON.stringify({}), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
