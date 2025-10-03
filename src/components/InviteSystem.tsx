import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CircleInvite {
  id: string;
  invited_email: string;
  invite_code: string;
  status: string;
  expires_at: string;
  created_at: string;
}

interface InviteSystemProps {
  circleId: string;
  circleName: string;
  isAdmin?: boolean;
}

export const InviteSystem = ({ circleId, circleName, isAdmin = false }: InviteSystemProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invites, setInvites] = useState<CircleInvite[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (circleId && user && isAdmin) {
      fetchInvites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId, user, isAdmin]);

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from("circle_invites")
        .select("*")
        .eq("circle_id", circleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const generateInviteCode = async () => {
    const { data, error } = await supabase.rpc("generate_invite_code");
    if (error) throw error;
    return data;
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !user) return;

    setLoading(true);
    try {
      // Generate invite code
      const inviteCode = await generateInviteCode();

      // Create invite
      const { error } = await supabase.from("circle_invites").insert({
        circle_id: circleId,
        invited_by_id: user.id,
        invited_email: email,
        invite_code: inviteCode,
      });

      if (error) throw error;

      toast({
        title: "Invite Sent!",
        description: `An invitation has been sent to ${email}`,
      });

      setEmail("");
      setDialogOpen(false);
      fetchInvites();
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = async (inviteCode: string) => {
    const inviteLink = `${window.location.origin}/circles/join/${inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Link Copied!",
        description: "Invite link copied to clipboard.",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const cancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from("circle_invites")
        .update({ status: "cancelled" })
        .eq("id", inviteId);

      if (error) throw error;

      toast({
        title: "Invite Cancelled",
        description: "The invitation has been cancelled.",
      });

      fetchInvites();
    } catch (error) {
      console.error("Error cancelling invite:", error);
      toast({
        title: "Error",
        description: "Failed to cancel invite.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Invite Members</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Send Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite to {circleName}</DialogTitle>
                <DialogDescription>
                  Enter the email address of the person you want to invite to this circle.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Invitation"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Sent Invitations
            </h4>
            {invites.map((invite) => {
              const isExpired = new Date(invite.expires_at) < new Date();

              return (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{invite.invited_email}</span>
                      <Badge
                        variant={
                          invite.status === "accepted"
                            ? "default"
                            : invite.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {invite.status}
                      </Badge>
                      {isExpired && invite.status === "pending" && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Expired
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Code: {invite.invite_code}</span>
                      <span>•</span>
                      <span>
                        Expires: {new Date(invite.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {invite.status === "pending" && !isExpired && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyInviteLink(invite.invite_code)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelInvite(invite.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {invite.status === "accepted" && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {invites.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No invitations sent yet. Click "Send Invite" to invite members.
          </p>
        )}
      </div>
    </Card>
  );
};
