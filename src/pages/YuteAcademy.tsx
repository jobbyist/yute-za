import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  BookOpen,
  Trophy,
  Zap,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type LearningPath = Tables<"learning_paths"> & {
  courses?: { count: number }[];
  user_progress?: number;
};

const YuteAcademy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [userXp, setUserXp] = useState<Tables<"user_xp"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAcademyData = async () => {
    try {
      // Fetch learning paths
      const { data: paths, error: pathsError } = await supabase
        .from("learning_paths")
        .select(`
          *,
          courses(count)
        `)
        .eq("is_published", true)
        .order("sort_order");

      if (pathsError) throw pathsError;
      setLearningPaths(paths || []);

      // Fetch user XP if logged in
      if (user) {
        const { data: xpData } = await supabase
          .from("user_xp")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setUserXp(xpData);
      }
    } catch (error) {
      console.error("Error fetching academy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pro":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "elite":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "";
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-blue-500/10 text-blue-500";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500";
      case "advanced":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              VAULT SCHOOL
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Level Up Your Financial Knowledge
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn at your own pace with bite-sized courses, earn XP, unlock
              badges, and build real financial skills.
            </p>

            {user && userXp && (
              <Card className="p-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold">Level {userXp.level}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {userXp.total_xp} XP
                    </span>
                  </div>
                  <Progress value={(userXp.total_xp % 100)} />
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>Streak: {userXp.current_streak_days} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Best: {userXp.longest_streak_days} days</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/badges")}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Badges
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learning Paths
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your journey and start learning today
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading learning paths...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => (
                <Card
                  key={path.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/academy/path/${path.id}`)}
                  style={{
                    borderColor: path.color || undefined,
                    borderWidth: "2px",
                  }}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">{path.icon}</div>
                      <Badge className={getTierColor(path.tier)}>
                        {path.tier.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">{path.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {path.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>
                          {path.courses?.[0]?.count || 0} courses
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{path.estimated_duration_hours}h</span>
                      </div>
                    </div>

                    <Badge className={getDifficultyColor(path.difficulty_level)}>
                      {path.difficulty_level}
                    </Badge>

                    <Button className="w-full" variant="outline">
                      Start Learning
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why VAULT SCHOOL?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Bite-Sized Learning</h3>
                <p className="text-muted-foreground">
                  Short, focused courses designed for busy South Africans.
                  Learn in 10-15 minute sessions.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Gamified Experience</h3>
                <p className="text-muted-foreground">
                  Earn XP, unlock badges, and compete on leaderboards while
                  building real skills.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">SA-Focused Content</h3>
                <p className="text-muted-foreground">
                  All content tailored for the South African market, economy,
                  and financial landscape.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of South Africans building their financial future
            </p>
            {!user && (
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default YuteAcademy;
