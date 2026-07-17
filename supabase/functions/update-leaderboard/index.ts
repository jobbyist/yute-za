// Supabase Edge Function: Update Leaderboard
// Runs every 1-2 days to dynamically update leaderboard rankings

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeaderboardUpdateResult {
  success: boolean;
  message: string;
  timestamp: string;
  stats?: {
    usersUpdated: number;
    badgesAwarded: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting leaderboard update...");

    // Call the database function to update leaderboard
    const { error: updateError } = await supabase.rpc(
      "update_leaderboard_rankings"
    );

    if (updateError) {
      console.error("Error updating leaderboard:", updateError);
      throw updateError;
    }

    // Get statistics about the update
    const { data: userCount } = await supabase
      .from("user_xp")
      .select("*", { count: "exact", head: true });

    const { data: badgeCount } = await supabase
      .from("user_badges")
      .select("*", { count: "exact", head: true })
      .gte("earned_at", new Date(Date.now() - 172800000).toISOString()); // Last 2 days

    const result: LeaderboardUpdateResult = {
      success: true,
      message: "Leaderboard updated successfully",
      timestamp: new Date().toISOString(),
      stats: {
        usersUpdated: userCount?.count ?? 0,
        badgesAwarded: badgeCount?.count ?? 0,
      },
    };

    console.log("Leaderboard update completed:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in update-leaderboard function:", error);

    const errorResult: LeaderboardUpdateResult = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(errorResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// To set up the cron job:
// 1. Deploy this function: supabase functions deploy update-leaderboard
// 2. Set up a cron trigger in Supabase Dashboard or use pg_cron:
//    SELECT cron.schedule('update-leaderboard', '0 */36 * * *', 'SELECT net.http_post(''https://your-project.supabase.co/functions/v1/update-leaderboard'', ''{}''::jsonb);');
//    This runs every 36 hours (1.5 days)

