import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Award,
  Lock,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type BadgeType = Tables<"badges">;
type UserBadge = Tables<"user_badges"> & {
  badges?: BadgeType;
};
type UserXp = Tables<"user_xp">;

const BadgesPage = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userXp, setUserXp] = useState<UserXp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadgesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBadgesData = async () => {
    try {
      // Fetch all badges
      const { data: badges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .order("criteria_value");

      if (badgesError) throw badgesError;
      setAllBadges(badges || []);

      // Fetch user badges if logged in
      if (user) {
        const { data: earnedBadges, error: earnedError } = await supabase
          .from("user_badges")
          .select("*, badges(*)")
          .eq("user_id", user.id);

        if (earnedError) throw earnedError;
        setUserBadges(earnedBadges || []);

        // Fetch user XP
        const { data: xpData } = await supabase
          .from("user_xp")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setUserXp(xpData);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasBadge = (badgeId: string) => {
    return userBadges.some((ub) => ub.badge_id === badgeId);
  };

  const getBadgeProgress = (badge: BadgeType) => {
    if (!userXp) return 0;

    switch (badge.criteria_type) {
      case "courses_completed":
        // Would need to fetch actual course count
        return 0;
      case "xp_earned":
        return Math.min((userXp.total_xp / badge.criteria_value) * 100, 100);
      case "streak_days":
        return Math.min(
          (userXp.current_streak_days / badge.criteria_value) * 100,
          100
        );
      default:
        return 0;
    }
  };

  const getBadgeTypeIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Award className="w-6 h-6" />;
      case "milestone":
        return <Trophy className="w-6 h-6" />;
      case "special":
        return <Trophy className="w-6 h-6 text-purple-500" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">🏆 Badges & Achievements</h1>
            <p className="text-xl text-muted-foreground">
              Earn badges by completing courses, gaining XP, and staying consistent
            </p>
            {user && userXp && (
              <div className="mt-6 max-w-md mx-auto">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      Level {userXp.level}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {userXp.total_xp} XP
                    </span>
                  </div>
                  <Progress value={userXp.total_xp % 100} />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{userBadges.length} badges earned</span>
                    <span>{userXp.current_streak_days} day streak</span>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading badges...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBadges.map((badge) => {
                const earned = hasBadge(badge.id);
                const progress = getBadgeProgress(badge);

                return (
                  <Card
                    key={badge.id}
                    className={`p-6 transition-all ${
                      earned
                        ? "border-yellow-500 bg-yellow-500/5"
                        : "opacity-60"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Badge Icon */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${
                            earned
                              ? "bg-yellow-500/20"
                              : "bg-muted"
                          }`}
                        >
                          {earned ? badge.icon : <Lock className="w-8 h-8 text-muted-foreground" />}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={earned ? "default" : "secondary"}
                          >
                            {badge.badge_type}
                          </Badge>
                          {badge.tier && (
                            <Badge
                              className={
                                badge.tier === "free"
                                  ? "bg-green-500"
                                  : badge.tier === "pro"
                                  ? "bg-amber-500"
                                  : "bg-purple-500"
                              }
                            >
                              {badge.tier}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Badge Info */}
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {badge.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>

                      {/* Progress or Completion */}
                      {earned ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <Trophy className="w-5 h-5" />
                          <span className="font-semibold">Earned!</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            +{badge.xp_bonus} XP
                          </span>
                        </div>
                      ) : user ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-semibold">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} />
                          <p className="text-xs text-muted-foreground">
                            {badge.criteria_type === "courses_completed" &&
                              `Complete ${badge.criteria_value} courses`}
                            {badge.criteria_type === "xp_earned" &&
                              `Earn ${badge.criteria_value} XP`}
                            {badge.criteria_type === "streak_days" &&
                              `Maintain a ${badge.criteria_value}-day streak`}
                            {badge.criteria_type === "perfect_quiz" &&
                              `Get ${badge.criteria_value}% on a quiz`}
                          </p>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Log in to track your progress
                        </div>
                      )}

                      {/* XP Bonus */}
                      {!earned && (
                        <div className="pt-2 border-t border-border flex items-center gap-2">
                          {getBadgeTypeIcon(badge.badge_type)}
                          <span className="text-sm text-muted-foreground">
                            Reward: {badge.xp_bonus} XP
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgesPage;
