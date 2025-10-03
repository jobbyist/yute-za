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
import { VideoPlayer } from "@/components/VideoPlayer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { QuizPlayer } from "@/components/QuizPlayer";
import { SocialShare } from "@/components/SocialShare";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;
type UserProgress = Tables<"user_course_progress">;

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (courseId && user) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const fetchCourseData = async () => {
    if (!courseId || !user) return;

    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch or create progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_course_progress")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .single();

      if (progressError && progressError.code !== "PGRST116") {
        throw progressError;
      }

      if (!progressData) {
        // Create initial progress
        const { data: newProgress, error: createError } = await supabase
          .from("user_course_progress")
          .insert({
            user_id: user.id,
            course_id: courseId,
            learning_path_id: courseData.learning_path_id,
            progress_percentage: 0,
          })
          .select()
          .single();

        if (createError) throw createError;
        setProgress(newProgress);
      } else {
        setProgress(progressData);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Failed to load course.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progressPercentage: number) => {
    if (!user || !courseId || !progress) return;

    try {
      await supabase
        .from("user_course_progress")
        .update({
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
        })
        .eq("id", progress.id);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleCompleteCourse = async () => {
    if (!user || !courseId || !course || !progress) return;

    setCompleting(true);
    try {
      // Update progress
      const { error: progressError } = await supabase
        .from("user_course_progress")
        .update({
          progress_percentage: 100,
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", progress.id);

      if (progressError) throw progressError;

      // Award XP
      const { data: xpData } = await supabase
        .from("user_xp")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (xpData) {
        const newXp = xpData.total_xp + course.xp_reward;
        const newLevel = Math.floor(newXp / 100) + 1;

        await supabase
          .from("user_xp")
          .update({
            total_xp: newXp,
            level: newLevel,
            last_activity_date: new Date().toISOString().split("T")[0],
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("user_xp").insert({
          user_id: user.id,
          total_xp: course.xp_reward,
          level: 1,
          last_activity_date: new Date().toISOString().split("T")[0],
        });
      }

      toast({
        title: "Course Completed! 🎉",
        description: `You earned ${course.xp_reward} XP!`,
      });

      // Navigate back to learning path
      navigate(`/academy/path/${course.learning_path_id}`);
    } catch (error) {
      console.error("Error completing course:", error);
      toast({
        title: "Error",
        description: "Failed to complete course.",
        variant: "destructive",
      });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!course || !user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="text-lg">Course not found</div>
          <Button onClick={() => navigate("/academy")}>Back to Academy</Button>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.is_completed || false;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/academy/path/${course.learning_path_id}`)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Path
            </Button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>
              </div>
              {isCompleted && (
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              )}
            </div>

            <div className="flex items-center gap-4">
              <Badge>{course.content_type}</Badge>
              <span className="text-sm text-muted-foreground">
                {course.duration_minutes} minutes
              </span>
              <Badge variant="outline" className="gap-1">
                <Award className="w-3 h-3" />
                +{course.xp_reward} XP
              </Badge>
            </div>
          </div>

          {/* Progress */}
          {progress && !isCompleted && (
            <Card className="p-4 mb-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Your Progress</span>
                  <span className="text-muted-foreground">
                    {progress.progress_percentage}%
                  </span>
                </div>
                <Progress value={progress.progress_percentage} />
              </div>
            </Card>
          )}

          {/* Course Content */}
          <div className="mb-8">
            {course.content_type === "video" && (
              <VideoPlayer
                url={course.content_url || undefined}
                title={course.title}
                onProgress={(progress) => {
                  // Update progress in real-time
                  if (progress > (progress?.progress_percentage || 0)) {
                    updateProgress(Math.floor(progress));
                  }
                }}
                onComplete={() => {
                  if (!isCompleted) {
                    handleCompleteCourse();
                  }
                }}
              />
            )}

            {course.content_type === "audio" && (
              <AudioPlayer
                url={course.content_url || undefined}
                title={course.title}
                onProgress={(progress) => {
                  if (progress > (progress?.progress_percentage || 0)) {
                    updateProgress(Math.floor(progress));
                  }
                }}
                onComplete={() => {
                  if (!isCompleted) {
                    handleCompleteCourse();
                  }
                }}
              />
            )}

            {course.content_type === "text" && (
              <Card className="p-8">
                <div className="prose max-w-none">
                  <p className="text-lg font-semibold mb-4">📖 Course Content</p>
                  <p className="text-muted-foreground">
                    Text content would be displayed here. This would include
                    formatted text, images, and interactive elements to help
                    you learn effectively.
                  </p>
                </div>
              </Card>
            )}

            {course.content_type === "quiz" && (
              <QuizPlayer
                title={course.title}
                onComplete={(score) => {
                  if (score >= 70 && !isCompleted) {
                    handleCompleteCourse();
                  }
                }}
              />
            )}

            {course.content_type === "interactive" && (
              <Card className="p-8">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">
                    🎮 Interactive Exercise
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interactive content would be displayed here
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate(`/academy/path/${course.learning_path_id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Path
            </Button>

            {!isCompleted && (
              <Button
                onClick={handleCompleteCourse}
                disabled={completing}
                className="gap-2"
              >
                {completing ? (
                  "Completing..."
                ) : (
                  <>
                    Complete Course
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}

            {isCompleted && (
              <Button
                onClick={() => navigate(`/academy/path/${course.learning_path_id}`)}
                className="gap-2"
              >
                Next Course
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Social Share */}
          {isCompleted && (
            <div className="mt-8">
              <SocialShare
                title={`I just completed ${course.title}!`}
                description={`Check out this course on YUTE Academy: ${course.description}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
