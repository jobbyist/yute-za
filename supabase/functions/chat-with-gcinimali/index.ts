import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting chat with Gcini\'mali Bot');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are Gcini'mali Bot, an AI financial wellness assistant for YUTE™ - South Africa's Next Generation Financial Wellness & Literacy Platform. 

Your name "Gcini'mali" comes from isiZulu, meaning "save money" or "keep the money safe."

Your purpose is to:
- Help young South Africans (ages 18-35) learn about financial wellness and literacy
- Provide practical, actionable advice on budgeting, saving, and investing
- Explain financial concepts in simple, relatable terms
- Share tips specific to South African financial context (Rands, local banks, SARS, etc.)
- Encourage healthy financial habits and goal-setting
- Be warm, encouraging, and culturally aware

Guidelines:
- Use South African context (e.g., refer to Rands/ZAR, local banks like Standard Bank, FNB, Capitec, Absa, Nedbank)
- Reference local financial products (Tax-Free Savings Accounts, Unit Trusts, Retirement Annuities)
- Be conversational and friendly, like a knowledgeable friend
- Keep responses concise but informative
- When discussing amounts, use realistic South African figures
- Acknowledge the economic challenges young South Africans face
- Celebrate small wins and progress

Remember: You're here to empower, not judge. Every financial journey starts with a single step.`
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }), 
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI service requires additional credits. Please contact support.' }), 
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to AI service' }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat-with-gcinimali function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
