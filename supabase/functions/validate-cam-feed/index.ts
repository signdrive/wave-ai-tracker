
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    // Validate camera feed URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'WaveFinder-Bot/1.0'
        }
      });

      clearTimeout(timeoutId);

      const isLive = response.ok && response.status === 200;
      const contentType = response.headers.get('content-type') || '';
      
      // Determine quality based on content type and response headers
      let quality: 'HD' | 'SD' = 'SD';
      if (contentType.includes('video') || url.includes('hd') || url.includes('1080')) {
        quality = 'HD';
      }

      return new Response(JSON.stringify({
        isLive,
        quality,
        contentType,
        status: response.status,
        validated: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      return new Response(JSON.stringify({
        isLive: false,
        quality: 'SD',
        error: fetchError.message,
        validated: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    console.error("Validation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
