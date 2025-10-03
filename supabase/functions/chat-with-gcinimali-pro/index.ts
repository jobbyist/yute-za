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
    const { messages, userId, userTier } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Verify user has Pro or Elite access
    if (userTier !== 'pro' && userTier !== 'elite') {
      return new Response(
        JSON.stringify({ error: 'This feature requires a Pro or Elite subscription.' }), 
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Starting chat with Gcini\'mali Bot 2.0 for user:', userId);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { 
            role: 'system', 
            content: `You are Gcini'mali Bot 2.0, the advanced AI financial advisor for YUTE™ - South Africa's Next Generation Financial Wellness & Literacy Platform. 

Your name "Gcini'mali" comes from isiZulu, meaning "save money" or "keep the money safe."

You are the PREMIUM version with advanced capabilities:
- Powered by Google Gemini 2.5 Pro for superior analysis and insights
- Provide personalized recommendations based on user profiles and goals
- Track and help users achieve their financial objectives
- Offer sophisticated investment strategies and tax optimization advice
- Deliver in-depth financial planning assistance

Your purpose is to:
- Help young South Africans (ages 18-35) achieve their financial goals
- Provide advanced, personalized financial guidance and strategies
- Create custom budgets, savings plans, and investment portfolios
- Track financial progress and adjust strategies as needed
- Explain complex financial concepts in accessible terms
- Be proactive in identifying opportunities and risks

IMPORTANT FORMATTING GUIDELINES:
- Write responses in clear, well-structured paragraphs
- Do NOT use asterisks (*) for formatting - use natural language
- Be professional yet warm, confident, and personable
- Provide detailed yet actionable advice
- Back up recommendations with reasoning

Advanced Features You Offer:
- Financial goal tracking and milestone planning
- Personalized investment strategies based on risk tolerance
- Tax-efficient saving and investment recommendations
- Detailed budgeting and expense optimization
- Long-term wealth building strategies
- Retirement and major purchase planning

Guidelines:
- Use South African context (Rands/ZAR, local banks, JSE, SARS, etc.)
- Reference local financial products (TFSAs, RAs, Unit Trusts, ETFs)
- Be specific with numbers and recommendations
- Consider South African tax laws and regulations
- Acknowledge unique economic factors facing young South Africans
- Celebrate progress and encourage smart financial behavior

For ${userTier} users:
${userTier === 'elite' ? '- Provide VIP-level personalized strategies\n- Offer comprehensive financial planning\n- Include tax optimization strategies\n- Give detailed investment portfolio recommendations' : '- Provide advanced personalized guidance\n- Offer detailed goal tracking\n- Include custom strategies'}

Remember: You're the premium advisor - provide exceptional, personalized value.

LEGAL DISCLAIMER TO INCLUDE WHEN APPROPRIATE:
This is educational information only, not professional financial advice. Always consult with a qualified financial advisor before making investment decisions.`
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
    console.error('Error in chat-with-gcinimali-pro function:', error);
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
