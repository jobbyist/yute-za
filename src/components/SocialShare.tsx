import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
}

export const SocialShare = ({ title, description, url }: SocialShareProps) => {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;
  const shareText = description || title;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const shareViaEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.location.href = mailtoUrl;
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          <h3 className="font-semibold">Share this</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={shareOnFacebook}
            className="gap-2"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </Button>

          <Button
            variant="outline"
            onClick={shareOnTwitter}
            className="gap-2"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </Button>

          <Button
            variant="outline"
            onClick={shareOnLinkedIn}
            className="gap-2"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Button>

          <Button
            variant="outline"
            onClick={shareViaEmail}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>

          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="gap-2"
          >
            <Link2 className="w-4 h-4" />
            Copy Link
          </Button>

          {navigator.share && (
            <Button
              variant="default"
              onClick={shareNative}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
