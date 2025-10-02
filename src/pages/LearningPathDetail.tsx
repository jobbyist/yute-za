import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  Award,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type LearningPath = Tables<"learning_paths">;
type Course = Tables<"courses"> & {
  user_progress?: {
    progress_percentage: number;
    is_completed: boolean;
  }[];
};

const LearningPathDetail = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathId) {
      fetchPathData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathId, user]);

  const fetchPathData = async () => {
    if (!pathId) return;

    try {
      // Fetch learning path
      const { data: pathData, error: pathError } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("id", pathId)
        .single();

      if (pathError) throw pathError;
      setPath(pathData);

      // Fetch courses
      const coursesQuery = supabase
        .from("courses")
        .select("*")
        .eq("learning_path_id", pathId)
        .eq("is_published", true)
        .order("sort_order");

      const { data: coursesData, error: coursesError } = await coursesQuery;

      if (coursesError) throw coursesError;

      // If user is logged in, fetch their progress
      if (user && coursesData) {
        const courseIds = coursesData.map((c) => c.id);
        const { data: progressData } = await supabase
          .from("user_course_progress")
          .select("course_id, progress_percentage, is_completed")
          .eq("user_id", user.id)
          .in("course_id", courseIds);

        // Merge progress data with courses
        const coursesWithProgress = coursesData.map((course) => {
          const progress = progressData?.find(
            (p) => p.course_id === course.id
          );
          return {
            ...course,
            user_progress: progress
              ? [
                  {
                    progress_percentage: progress.progress_percentage,
                    is_completed: progress.is_completed,
                  },
                ]
              : [],
          };
        });

        setCourses(coursesWithProgress);
      } else {
        setCourses(coursesData || []);
      }
    } catch (error) {
      console.error("Error fetching path data:", error);
      toast({
        title: "Error",
        description: "Failed to load learning path.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = (courseId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to start learning.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate(`/academy/course/${courseId}`);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎥";
      case "audio":
        return "🎧";
      case "text":
        return "📖";
      case "quiz":
        return "📝";
      case "interactive":
        return "🎮";
      default:
        return "📚";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Loading learning path...</div>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="text-lg">Learning path not found</div>
          <Button onClick={() => navigate("/academy")}>
            Back to Academy
          </Button>
        </div>
      </div>
    );
  }

  const completedCourses = courses.filter(
    (c) => c.user_progress?.[0]?.is_completed
  ).length;
  const overallProgress = courses.length > 0 
    ? (completedCourses / courses.length) * 100 
    : 0;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/academy")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Academy
            </Button>

            <div className="flex items-start gap-6">
              <div className="text-6xl">{path.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{path.name}</h1>
                  <Badge
                    className={
                      path.tier === "free"
                        ? "bg-green-500"
                        : path.tier === "pro"
                        ? "bg-amber-500"
                        : "bg-purple-500"
                    }
                  >
                    {path.tier.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  {path.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge>{path.difficulty_level}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.estimated_duration_hours} hours
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {courses.length} courses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          {user && (
            <Card className="p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your Progress</h3>
                  <span className="text-sm text-muted-foreground">
                    {completedCourses} / {courses.length} courses completed
                  </span>
                </div>
                <Progress value={overallProgress} />
              </div>
            </Card>
          )}

          {/* Courses List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            {courses.map((course, index) => {
              const isCompleted = course.user_progress?.[0]?.is_completed;
              const progress =
                course.user_progress?.[0]?.progress_percentage || 0;

              return (
                <Card
                  key={course.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Course Number */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">
                              {getContentTypeIcon(course.content_type)}
                            </span>
                            <h3 className="text-lg font-semibold">
                              {course.title}
                            </h3>
                            {isCompleted && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration_minutes} min</span>
                        </div>
                      </div>

                      {/* Progress bar for started courses */}
                      {user && progress > 0 && !isCompleted && (
                        <div className="mb-3">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {progress}% complete
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleStartCourse(course.id)}
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Review
                            </>
                          ) : progress > 0 ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                        <Badge variant="outline">
                          +{course.xp_reward} XP
                        </Badge>
                        <Badge variant="secondary">
                          {course.content_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetail;
