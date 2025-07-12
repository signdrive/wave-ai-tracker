import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userProfile, currentConditions, location, equipment } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === 'spot_discovery') {
      return await handleSpotDiscovery(userProfile, currentConditions, location, supabase);
    } else if (type === 'equipment_recommendations') {
      return await handleEquipmentRecommendations(currentConditions, userProfile, equipment);
    } else if (type === 'safety_check') {
      return await handleSafetyCheck(currentConditions, location);
    }

    throw new Error('Invalid request type');
  } catch (error) {
    console.error('Error in ai-surf-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleSpotDiscovery(userProfile: any, currentConditions: any, location: any, supabase: any) {
  // Get nearby surf spots from database
  const { data: surfSpots } = await supabase
    .from('surf_spots')
    .select('*')
    .limit(20);

  const prompt = `As a professional surf coach, recommend the best surf spots for this surfer:

User Profile:
- Skill Level: ${userProfile.skillLevel}/10
- Experience: ${userProfile.experience} years
- Preferred Wave Types: ${userProfile.preferredWaveTypes?.join(', ') || 'All types'}
- Board Type: ${userProfile.boardType || 'Not specified'}
- Sport: ${userProfile.sport || 'surfing'}

Current Location: ${location.name || 'Unknown'}

Current Conditions:
- Wave Height: ${currentConditions.waveHeight || 'Unknown'}
- Wind Speed: ${currentConditions.windSpeed || 'Unknown'} km/h
- Wind Direction: ${currentConditions.windDirection || 'Unknown'}
- Tide: ${currentConditions.tide || 'Unknown'}

Available Spots: ${JSON.stringify(surfSpots?.slice(0, 10) || [])}

Please provide:
1. Top 3 recommended spots with reasons
2. Best times to surf today
3. Skill-appropriate tips for each spot
4. Any safety considerations

Format as JSON with this structure:
{
  "recommendations": [
    {
      "spotName": "name",
      "spotId": "id",
      "rating": 1-10,
      "reason": "detailed explanation",
      "bestTime": "time recommendation",
      "tips": "specific tips",
      "safetyNotes": "safety considerations"
    }
  ],
  "generalAdvice": "overall guidance"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert surf coach providing personalized spot recommendations. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const recommendations = JSON.parse(data.choices[0].message.content);

  return new Response(
    JSON.stringify(recommendations),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleEquipmentRecommendations(currentConditions: any, userProfile: any, equipment: any) {
  const prompt = `As a surf equipment expert, recommend the optimal board and wetsuit for these conditions:

Current Conditions:
- Wave Height: ${currentConditions.waveHeight || 'Unknown'}
- Water Temperature: ${currentConditions.waterTemp || 'Unknown'}°C
- Wind Speed: ${currentConditions.windSpeed || 'Unknown'} km/h
- Wave Type: ${currentConditions.waveType || 'Unknown'}
- Sport: ${userProfile.sport || 'surfing'}

User Profile:
- Skill Level: ${userProfile.skillLevel}/10
- Height: ${userProfile.height || 'Unknown'}
- Weight: ${userProfile.weight || 'Unknown'}
- Experience: ${userProfile.experience} years

Current Equipment: ${JSON.stringify(equipment || {})}

Provide specific recommendations for:
1. Board type, size, and volume
2. Wetsuit thickness and type
3. Additional gear (fins, leash, etc.)
4. Alternative options for different skill levels

Format as JSON:
{
  "board": {
    "type": "board type",
    "length": "length in feet",
    "width": "width in inches",
    "thickness": "thickness in inches",
    "volume": "volume in liters",
    "reason": "explanation"
  },
  "wetsuit": {
    "thickness": "thickness in mm",
    "type": "full/spring/shorty",
    "features": ["feature1", "feature2"],
    "reason": "explanation"
  },
  "accessories": [
    {
      "item": "item name",
      "recommendation": "specific recommendation",
      "reason": "why needed"
    }
  ],
  "alternatives": "alternative suggestions for different conditions"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional surf equipment specialist. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const recommendations = JSON.parse(data.choices[0].message.content);

  return new Response(
    JSON.stringify(recommendations),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSafetyCheck(currentConditions: any, location: any) {
  const prompt = `As a water safety expert, analyze these surf conditions and provide safety recommendations:

Current Conditions:
- Wave Height: ${currentConditions.waveHeight || 'Unknown'}
- Wind Speed: ${currentConditions.windSpeed || 'Unknown'} km/h
- Wind Direction: ${currentConditions.windDirection || 'Unknown'}
- Tide: ${currentConditions.tide || 'Unknown'}
- Water Temperature: ${currentConditions.waterTemp || 'Unknown'}°C
- Location: ${location.name || 'Unknown'}

Analyze for:
1. Rip current risk
2. Weather hazards
3. Recommended safety equipment
4. Emergency contacts needed
5. Check-in recommendations

Format as JSON:
{
  "riskLevel": "low/medium/high",
  "ripCurrentRisk": {
    "level": "low/medium/high",
    "indicators": ["indicator1", "indicator2"],
    "avoidanceAdvice": "how to avoid or escape"
  },
  "weatherHazards": [
    {
      "type": "hazard type",
      "description": "detailed description",
      "precautions": "safety measures"
    }
  ],
  "recommendedEquipment": ["item1", "item2"],
  "emergencyContacts": {
    "primary": "112 (Emergency Services)",
    "coastGuard": "Local Coast Guard",
    "localLifeguards": "Beach Lifeguard Station"
  },
  "checkInAdvice": "recommended check-in schedule and contacts",
  "overallAdvice": "general safety guidance"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a certified water safety instructor. Always respond with valid JSON and prioritize safety.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const safetyCheck = JSON.parse(data.choices[0].message.content);

  return new Response(
    JSON.stringify(safetyCheck),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}