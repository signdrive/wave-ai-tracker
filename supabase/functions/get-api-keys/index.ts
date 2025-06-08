
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface SecurityContext {
  user_id: string;
  session_id: string;
  ip_address?: string;
  user_agent?: string;
}

async function logSecurityEvent(
  supabaseClient: any, 
  context: SecurityContext, 
  event: string, 
  severity: string, 
  details: any
) {
  try {
    console.log(`Security Event [${severity}]: ${event}`, { context, details });
    // In production, send to security monitoring service
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

async function validateAdminAccess(supabaseClient: any, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    return !error && data?.role === 'admin';
  } catch {
    return false;
  }
}

async function decryptApiKey(encryptedKey: string): Promise<string> {
  // In production, implement proper decryption
  // This is a simplified version for demonstration
  return encryptedKey;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Security context for logging
    const securityContext: SecurityContext = {
      user_id: user.id,
      session_id: token.substring(0, 10) + "...",
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
      user_agent: req.headers.get("user-agent") || "unknown"
    };

    // Validate admin access
    const isAdmin = await validateAdminAccess(supabaseClient, user.id);
    if (!isAdmin) {
      await logSecurityEvent(
        supabaseClient, 
        securityContext, 
        "unauthorized_api_key_access", 
        "high",
        { attempted_action: "get_api_keys" }
      );
      
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Rate limiting check (simplified)
    const rateLimitKey = `api_keys_access:${user.id}:${Math.floor(Date.now() / 60000)}`;
    // In production, implement proper rate limiting with Redis

    // Get API keys from secure storage
    const { data: apiKeys, error: keysError } = await supabaseClient
      .from('api_keys')
      .select('service_name, key_value')
      .eq('is_active', true);

    if (keysError) {
      console.error("Error fetching API keys:", keysError);
      await logSecurityEvent(
        supabaseClient, 
        securityContext, 
        "api_key_fetch_error", 
        "medium",
        { error: keysError.message }
      );
      
      return new Response(JSON.stringify({ error: "Failed to fetch API keys" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Transform to object format and decrypt
    const keys: Record<string, string> = {};
    for (const key of apiKeys || []) {
      try {
        keys[key.service_name] = await decryptApiKey(key.key_value);
      } catch (error) {
        console.error(`Failed to decrypt key for ${key.service_name}:`, error);
        await logSecurityEvent(
          supabaseClient, 
          securityContext, 
          "api_key_decryption_error", 
          "high",
          { service: key.service_name }
        );
      }
    }

    // Log successful access
    await logSecurityEvent(
      supabaseClient, 
      securityContext, 
      "api_keys_accessed", 
      "low",
      { key_count: Object.keys(keys).length }
    );

    return new Response(JSON.stringify(keys), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: "An unexpected error occurred while processing your request"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
