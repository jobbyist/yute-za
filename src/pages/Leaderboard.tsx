import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialShare } from "@/components/SocialShare";
import {
  Trophy,
  Medal,
  TrendingUp,
  Crown,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type LeaderboardEntry = Tables<"user_xp"> & {
  profiles?: { full_name: string | null; email: string | null };
  rank?: number;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      // Fetch top 100 users by XP
      const { data: leaderboardData, error } = await supabase
        .from("user_xp")
        .select("*, profiles(full_name, email)")
        .order("total_xp", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Add rank to each entry
      const rankedData = (leaderboardData || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      setLeaderboard(rankedData);

      // Find current user's rank
      if (user) {
        const userEntry = rankedData.find((entry) => entry.user_id === user.id);
        if (userEntry) {
          setUserRank(userEntry);
        } else {
          // User not in top 100, fetch their rank
          const { data: userData } = await supabase
            .from("user_xp")
            .select("*, profiles(full_name, email)")
            .eq("user_id", user.id)
            .single();

          if (userData) {
            // Count how many users have more XP
            const { count } = await supabase
              .from("user_xp")
              .select("*", { count: "exact", head: true })
              .gt("total_xp", userData.total_xp);

            setUserRank({
              ...userData,
              rank: (count || 0) + 1,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-amber-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-amber-600 to-amber-700";
    return "";
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h1 className="text-5xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Top learners by XP earned. Keep learning to climb the ranks!
            </p>
          </div>

          {/* User's Current Rank */}
          {user && userRank && (
            <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Your Rank</h3>
                    <p className="text-sm text-muted-foreground">
                      {userRank.profiles?.full_name || "You"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">#{userRank.rank}</div>
                  <div className="text-sm text-muted-foreground">
                    {userRank.total_xp.toLocaleString()} XP • Level {userRank.level}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Leaderboard */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <Card
                  key={entry.user_id}
                  className={`p-4 transition-all ${
                    entry.user_id === user?.id
                      ? "border-primary bg-primary/5"
                      : ""
                  } ${getRankBadge(entry.rank!)}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 text-center">
                      {getRankIcon(entry.rank!) || (
                        <span className="text-2xl font-bold text-muted-foreground">
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">
                          {entry.profiles?.full_name || "Anonymous"}
                        </h3>
                        {entry.user_id === user?.id && (
                          <Badge variant="default">You</Badge>
                        )}
                        {entry.rank === 1 && (
                          <Badge className="bg-yellow-500">1st Place</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Level {entry.level}</span>
                        <span>•</span>
                        <span>{entry.current_streak_days} day streak</span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {entry.total_xp.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">XP</div>
                    </div>
                  </div>
                </Card>
              ))}

              {leaderboard.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No leaderboard data yet. Complete courses to earn XP!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Social Share */}
          {user && userRank && (
            <div className="mt-8">
              <SocialShare
                title={`I'm ranked #${userRank.rank} on the YUTE Academy Leaderboard!`}
                description={`I've earned ${userRank.total_xp} XP and reached Level ${userRank.level}. Join me on YUTE Academy!`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
