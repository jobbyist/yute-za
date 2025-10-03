import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PodcastPlayer } from "@/components/PodcastPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

interface Episode {
  id: string;
  episode_number: number;
  title: string;
  description: string;
  audio_file_path: string;
  ebook_price: number;
  play_count: number;
  like_count: number;
  dislike_count: number;
}

interface UserSubscription {
  tier: string;
  status: string;
}

export const MzansiMoneyManual = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisodes();
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from("podcast_episodes")
        .select("*")
        .eq("is_published", true)
        .order("episode_number", { ascending: true });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleDownloadEbook = async (episodeId: string, episodeTitle: string, price: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to download e-books",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has Elite subscription
      if (subscription?.tier === "elite" && subscription?.status === "active") {
        // Free download for Elite subscribers
        toast({
          title: "Download Started",
          description: "Your e-book download will begin shortly (Elite Member)",
        });
        // In production, trigger actual download
        return;
      }

      // Check if already purchased
      const { data: purchase, error: purchaseError } = await supabase
        .from("ebook_purchases")
        .select("*")
        .eq("episode_id", episodeId)
        .eq("user_id", user.id)
        .single();

      if (purchaseError && purchaseError.code !== "PGRST116") throw purchaseError;

      if (purchase) {
        // Already purchased, allow download
        toast({
          title: "Download Started",
          description: "Your e-book download will begin shortly",
        });
        // In production, trigger actual download
        return;
      }

      // Redirect to payment page
      toast({
        title: "Payment Required",
        description: `Please pay R${price.toFixed(2)} to download this e-book`,
      });
      // In production, redirect to payment gateway with Stitch Money
      // For now, simulate purchase
      const { error: insertError } = await supabase.from("ebook_purchases").insert({
        episode_id: episodeId,
        user_id: user.id,
        purchase_price: price,
        payment_status: "completed",
      });

      if (insertError) throw insertError;

      toast({
        title: "Purchase Successful",
        description: "Your e-book download will begin shortly",
      });
    } catch (error) {
      console.error("Error downloading e-book:", error);
      toast({
        title: "Error",
        description: "Failed to download e-book",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">Loading episodes...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            THE MZANSI MONEY MANUAL
          </h2>
          <p className="text-lg text-muted-foreground">
            New episodes will be published every Monday and Wednesday plus a bonus
            episode every second Friday.
          </p>
        </div>

        <div className="space-y-8">
          {episodes.map((episode) => (
            <div key={episode.id} className="space-y-4">
              <PodcastPlayer
                episodeId={episode.id}
                episodeNumber={episode.episode_number}
                title={episode.title}
                audioUrl={episode.audio_file_path}
                playCount={episode.play_count}
                likeCount={episode.like_count}
                dislikeCount={episode.dislike_count}
              />

              {/* Episode Description and E-book */}
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">
                  {episode.description}
                </p>

                <div className="border-t pt-4 space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Download an extended version of each episode as an e-book for just
                    R{episode.ebook_price.toFixed(2)} (please note that e-books are
                    available upon request for all active Elite subscribers free of
                    charge).
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {subscription?.tier === "elite" && (
                        <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary">
                          Elite - Free Download
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() =>
                        handleDownloadEbook(
                          episode.id,
                          episode.title,
                          episode.ebook_price
                        )
                      }
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      GET THE E-BOOK
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
