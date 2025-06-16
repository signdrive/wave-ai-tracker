
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5; // 5 requests per minute per user
  
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: Missing STRIPE_SECRET_KEY");
      return new Response(JSON.stringify({ 
        subscribed: false,
        error: "Service configuration error"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 with error in body for graceful handling
      });
    }
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      return new Response(JSON.stringify({ 
        subscribed: false,
        error: "No authorization provided"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("ERROR: Authentication failed", { error: userError.message });
      return new Response(JSON.stringify({ 
        subscribed: false,
        error: "Authentication failed"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    const user = userData.user;
    if (!user?.email) {
      logStep("ERROR: No user or email");
      return new Response(JSON.stringify({ 
        subscribed: false,
        error: "User not found"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      logStep("Rate limit exceeded for user", { userId: user.id });
      return new Response(JSON.stringify({ 
        subscribed: false,
        error: "Too many requests"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check database first for cached subscription info
    const { data: existingSub } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // If we have recent data (less than 5 minutes old), return it
    if (existingSub && existingSub.updated_at) {
      const lastUpdate = new Date(existingSub.updated_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (lastUpdate > fiveMinutesAgo) {
        logStep("Using cached subscription data", { 
          status: existingSub.status,
          planName: existingSub.plan_name
        });
        
        return new Response(JSON.stringify({
          subscribed: existingSub.status === 'active',
          subscription_tier: existingSub.plan_name || 'Wave Tracker',
          subscription_end: existingSub.expires_at,
          cached: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    try {
      const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
      
      // Add a small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const customers = await stripe.customers.list({ 
        email: user.email, 
        limit: 1 
      });
      
      if (customers.data.length === 0) {
        logStep("No customer found, updating unsubscribed state");
        await supabaseClient.from("subscriptions").upsert({
          user_id: user.id,
          plan_name: 'Wave Tracker',
          status: 'inactive',
          expires_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
        
        return new Response(JSON.stringify({ 
          subscribed: false,
          subscription_tier: 'Wave Tracker'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

      // Add another small delay
      await new Promise(resolve => setTimeout(resolve, 100));

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      
      const hasActiveSub = subscriptions.data.length > 0;
      let subscriptionTier = 'Wave Tracker';
      let subscriptionEnd = null;

      if (hasActiveSub) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
        
        // Determine subscription tier from price
        const priceId = subscription.items.data[0].price.id;
        
        // Add delay before price retrieval
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount >= 2400) { // €24.99 or equivalent
          subscriptionTier = "WaveMentor Elite";
        } else if (amount >= 900) { // $9.99 or equivalent
          subscriptionTier = "WaveMentor Pro";
        } else {
          subscriptionTier = "Wave Tracker";
        }
        logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
      } else {
        logStep("No active subscription found");
      }

      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        plan_name: subscriptionTier,
        status: hasActiveSub ? 'active' : 'inactive',
        expires_at: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
      
      return new Response(JSON.stringify({
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
      
    } catch (stripeError: any) {
      logStep("Stripe API error", { error: stripeError.message });
      
      // If it's a rate limit error, return cached data if available
      if (stripeError.message?.includes("rate limit")) {
        if (existingSub) {
          logStep("Rate limited, returning cached data");
          return new Response(JSON.stringify({
            subscribed: existingSub.status === 'active',
            subscription_tier: existingSub.plan_name || 'Wave Tracker',
            subscription_end: existingSub.expires_at,
            cached: true
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }
      
      // For other Stripe errors, return unsubscribed state
      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription_tier: 'Wave Tracker',
        error: "Subscription check temporarily unavailable"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      subscribed: false,
      subscription_tier: 'Wave Tracker',
      error: "Service temporarily unavailable"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
