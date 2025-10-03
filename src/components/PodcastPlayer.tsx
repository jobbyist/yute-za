import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface PodcastPlayerProps {
  episodeId: string;
  episodeNumber: number;
  title: string;
  audioUrl?: string;
  playCount?: number;
  likeCount?: number;
  dislikeCount?: number;
}

interface Comment {
  id: string;
  user_id: string;
  comment_text: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export const PodcastPlayer = ({
  episodeId,
  episodeNumber,
  title,
  audioUrl,
  playCount = 0,
  likeCount = 0,
  dislikeCount = 0,
}: PodcastPlayerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [userInteraction, setUserInteraction] = useState<"like" | "dislike" | null>(null);
  const [plays, setPlays] = useState(playCount);
  const [likes, setLikes] = useState(likeCount);
  const [dislikes, setDislikes] = useState(dislikeCount);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserInteraction();
    }
  }, [user, episodeId]);

  const fetchUserInteraction = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("podcast_interactions")
        .select("interaction_type")
        .eq("episode_id", episodeId)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setUserInteraction(data.interaction_type as "like" | "dislike");
      }
    } catch (error) {
      console.error("Error fetching interaction:", error);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from("podcast_comments")
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq("episode_id", episodeId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePlayPause = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to listen to episodes",
        variant: "destructive",
      });
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      // Increment play count on first play
      if (currentTime === 0) {
        await incrementPlayCount();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const incrementPlayCount = async () => {
    try {
      const { error } = await supabase
        .from("podcast_episodes")
        .update({ play_count: plays + 1 })
        .eq("id", episodeId);

      if (error) throw error;
      setPlays(plays + 1);
    } catch (error) {
      console.error("Error incrementing play count:", error);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleInteraction = async (type: "like" | "dislike") => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to interact with episodes",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userInteraction === type) {
        // Remove interaction
        await supabase
          .from("podcast_interactions")
          .delete()
          .eq("episode_id", episodeId)
          .eq("user_id", user.id);

        setUserInteraction(null);
        if (type === "like") {
          setLikes(likes - 1);
          await supabase
            .from("podcast_episodes")
            .update({ like_count: likes - 1 })
            .eq("id", episodeId);
        } else {
          setDislikes(dislikes - 1);
          await supabase
            .from("podcast_episodes")
            .update({ dislike_count: dislikes - 1 })
            .eq("id", episodeId);
        }
      } else {
        // Add or update interaction
        const { error } = await supabase.from("podcast_interactions").upsert(
          {
            episode_id: episodeId,
            user_id: user.id,
            interaction_type: type,
          },
          {
            onConflict: "episode_id,user_id",
          }
        );

        if (error) throw error;

        // Update counts
        if (userInteraction === "like") {
          setLikes(likes - 1);
          setDislikes(dislikes + 1);
          await supabase
            .from("podcast_episodes")
            .update({ like_count: likes - 1, dislike_count: dislikes + 1 })
            .eq("id", episodeId);
        } else if (userInteraction === "dislike") {
          setLikes(likes + 1);
          setDislikes(dislikes - 1);
          await supabase
            .from("podcast_episodes")
            .update({ like_count: likes + 1, dislike_count: dislikes - 1 })
            .eq("id", episodeId);
        } else {
          if (type === "like") {
            setLikes(likes + 1);
            await supabase
              .from("podcast_episodes")
              .update({ like_count: likes + 1 })
              .eq("id", episodeId);
          } else {
            setDislikes(dislikes + 1);
            await supabase
              .from("podcast_episodes")
              .update({ dislike_count: dislikes + 1 })
              .eq("id", episodeId);
          }
        }

        setUserInteraction(type);
      }
    } catch (error) {
      console.error("Error updating interaction:", error);
      toast({
        title: "Error",
        description: "Failed to update interaction",
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase.from("podcast_comments").insert({
        episode_id: episodeId,
        user_id: user.id,
        comment_text: newComment.trim(),
      });

      if (error) throw error;

      toast({
        title: "Comment Posted",
        description: "Your comment has been added",
      });

      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <audio ref={audioRef} src={audioUrl} />

      <div className="space-y-4">
        {/* Episode Title */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge className="mb-2">Episode {episodeNumber}</Badge>
            <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{plays} plays</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <Button size="icon" onClick={handlePlayPause} className="h-12 w-12">
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className="h-8 w-8"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={userInteraction === "like" ? "default" : "outline"}
              onClick={() => handleInteraction("like")}
              className="gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs">{likes}</span>
            </Button>

            <Button
              size="sm"
              variant={userInteraction === "dislike" ? "default" : "outline"}
              onClick={() => handleInteraction("dislike")}
              className="gap-1"
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="text-xs">{dislikes}</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchComments}
                  className="gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Comments</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Episode Discussion</DialogTitle>
                  <DialogDescription>{title}</DialogDescription>
                </DialogHeader>

                {user && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Share your thoughts on this episode..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      Post Comment
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {loadingComments ? (
                    <p className="text-center text-muted-foreground">
                      Loading comments...
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {comment.profiles?.full_name || "Anonymous"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {comment.comment_text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>👍 {comment.upvotes}</span>
                            <span>👎 {comment.downvotes}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Card>
  );
};
