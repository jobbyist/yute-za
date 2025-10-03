import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface PayoutProposal {
  id: string;
  circle_id: string;
  recipient_id: string;
  proposed_by_id: string;
  amount: number;
  reason: string;
  proposal_type: string;
  status: string;
  votes_required: number;
  votes_approve: number;
  votes_reject: number;
  votes_abstain: number;
  voting_deadline: string;
  created_at: string;
  recipient_profile?: { full_name: string | null };
  proposer_profile?: { full_name: string | null };
}

interface Vote {
  vote_type: string;
}

interface VotingInterfaceProps {
  circleId: string;
}

export const VotingInterface = ({ circleId }: VotingInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<PayoutProposal[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, Vote>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (circleId && user) {
      fetchProposals();
      subscribeToProposals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId, user]);

  const fetchProposals = async () => {
    try {
      // Fetch proposals
      const { data: proposalsData, error } = await supabase
        .from("payout_proposals")
        .select(`
          *,
          recipient_profile:profiles!payout_proposals_recipient_id_fkey(full_name),
          proposer_profile:profiles!payout_proposals_proposed_by_id_fkey(full_name)
        `)
        .eq("circle_id", circleId)
        .in("status", ["pending", "approved", "rejected"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProposals(proposalsData || []);

      // Fetch user's votes
      if (user) {
        const { data: votesData } = await supabase
          .from("payout_votes")
          .select("payout_proposal_id, vote_type")
          .eq("user_id", user.id)
          .eq("circle_id", circleId);

        const votesMap: Record<string, Vote> = {};
        votesData?.forEach((vote) => {
          votesMap[vote.payout_proposal_id] = { vote_type: vote.vote_type };
        });
        setUserVotes(votesMap);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToProposals = () => {
    const channel = supabase
      .channel(`payout_proposals:${circleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payout_proposals',
          filter: `circle_id=eq.${circleId}`
        },
        () => {
          fetchProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleVote = async (proposalId: string, voteType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("payout_votes").insert({
        circle_id: circleId,
        user_id: user.id,
        payout_proposal_id: proposalId,
        vote_type: voteType,
      });

      if (error) throw error;

      toast({
        title: "Vote Recorded",
        description: `You voted to ${voteType} this proposal.`,
      });

      // Refresh proposals
      fetchProposals();
    } catch (error: any) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to record vote.",
        variant: "destructive",
      });
    }
  };

  const getVoteProgress = (proposal: PayoutProposal) => {
    const totalVotes = proposal.votes_approve + proposal.votes_reject + proposal.votes_abstain;
    const approvePercentage = totalVotes > 0 
      ? (proposal.votes_approve / proposal.votes_required) * 100 
      : 0;
    return Math.min(approvePercentage, 100);
  };

  const hasVoted = (proposalId: string) => {
    return !!userVotes[proposalId];
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading proposals...</p>
      </Card>
    );
  }

  if (proposals.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No payout proposals at this time.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => {
        const voted = hasVoted(proposal.id);
        const userVote = userVotes[proposal.id];
        const isExpired = new Date(proposal.voting_deadline) < new Date();
        const progress = getVoteProgress(proposal);

        return (
          <Card key={proposal.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">
                      Payout Proposal - R{proposal.amount.toLocaleString()}
                    </h3>
                    <Badge
                      variant={
                        proposal.status === "approved"
                          ? "default"
                          : proposal.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {proposal.status}
                    </Badge>
                    {isExpired && proposal.status === "pending" && (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Expired
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Recipient: {proposal.recipient_profile?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Proposed by: {proposal.proposer_profile?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm">{proposal.reason}</p>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Voting Progress</span>
                  <span className="font-semibold">
                    {proposal.votes_approve}/{proposal.votes_required} approvals
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                    {proposal.votes_approve} Approve
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3 text-red-600" />
                    {proposal.votes_reject} Reject
                  </span>
                  <span className="flex items-center gap-1">
                    <MinusCircle className="w-3 h-3 text-gray-500" />
                    {proposal.votes_abstain} Abstain
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="text-sm text-muted-foreground">
                Voting deadline:{" "}
                {new Date(proposal.voting_deadline).toLocaleDateString()}
              </div>

              {/* Voting Buttons */}
              {!voted && proposal.status === "pending" && !isExpired ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleVote(proposal.id, "approve")}
                    className="flex-1 gap-2"
                    variant="default"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleVote(proposal.id, "reject")}
                    className="flex-1 gap-2"
                    variant="destructive"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleVote(proposal.id, "abstain")}
                    className="flex-1 gap-2"
                    variant="outline"
                  >
                    <MinusCircle className="w-4 h-4" />
                    Abstain
                  </Button>
                </div>
              ) : voted ? (
                <div className="flex items-center gap-2 text-sm">
                  {userVote.vote_type === "approve" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      You voted to approve
                    </div>
                  )}
                  {userVote.vote_type === "reject" && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      You voted to reject
                    </div>
                  )}
                  {userVote.vote_type === "abstain" && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MinusCircle className="w-4 h-4" />
                      You abstained from voting
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
