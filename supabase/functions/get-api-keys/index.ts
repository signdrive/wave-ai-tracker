
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

    // Verify user is authenticated
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logStep("ERROR: Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      logStep("ERROR: Invalid token", { error: userError });
      return new Response(
        JSON.stringify({ error: "Invalid token" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    logStep("User authenticated", { userId: user.id });

    // Check if user has admin role
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError) {
      logStep("ERROR: Failed to check user roles", { error: roleError });
      return new Response(
        JSON.stringify({ error: "Failed to check permissions" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    const isAdmin = roles?.some(r => r.role === 'admin');
    
    if (!isAdmin) {
      logStep("ERROR: User is not admin", { userId: user.id });
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403 
        }
      );
    }

    // Fetch API keys for admin users
    const { data: apiKeys, error: keysError } = await supabase
      .from('api_keys')
      .select('service_name, key_name, is_active, created_at, updated_at')
      .eq('is_active', true);

    if (keysError) {
      logStep("ERROR: Failed to fetch API keys", { error: keysError });
      return new Response(
        JSON.stringify({ error: "Failed to fetch API keys" }), 
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    logStep("Successfully fetched API keys", { count: apiKeys?.length || 0 });

    return new Response(JSON.stringify({ apiKeys: apiKeys || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("ERROR: Unexpected error", { error: error instanceof Error ? error.message : String(error) });
    
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
