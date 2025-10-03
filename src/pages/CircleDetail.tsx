import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { VotingInterface } from "@/components/VotingInterface";
import { InviteSystem } from "@/components/InviteSystem";
import {
  Users,
  Wallet,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Globe,
  Calendar,
  Send,
  Vote,
  UserPlus,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Circle = Tables<"stokie_circles">;
type CircleMember = Tables<"circle_members"> & {
  profiles?: { full_name: string | null; email: string | null };
};
type Contribution = Tables<"contributions"> & {
  profiles?: { full_name: string | null };
};
type Message = Tables<"circle_messages"> & {
  profiles?: { full_name: string | null };
};

const CircleDetail = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (circleId && user) {
      fetchCircleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId, user]);

  const fetchCircleData = async () => {
    if (!circleId || !user) return;

    try {
      // Fetch circle details
      const { data: circleData, error: circleError } = await supabase
        .from("stokie_circles")
        .select("*")
        .eq("id", circleId)
        .single();

      if (circleError) throw circleError;
      setCircle(circleData);

      // Check if user is a member
      const { data: memberCheck } = await supabase
        .from("circle_members")
        .select("*")
        .eq("circle_id", circleId)
        .eq("user_id", user.id)
        .single();

      setIsMember(!!memberCheck);
      setIsAdmin(memberCheck?.role === 'creator' || memberCheck?.role === 'admin');

      if (memberCheck) {
        // Fetch members
        const { data: membersData } = await supabase
          .from("circle_members")
          .select("*, profiles(full_name, email)")
          .eq("circle_id", circleId)
          .eq("is_active", true);

        setMembers(membersData || []);

        // Fetch contributions
        const { data: contributionsData } = await supabase
          .from("contributions")
          .select("*, profiles(full_name)")
          .eq("circle_id", circleId)
          .order("contribution_date", { ascending: false });

        setContributions(contributionsData || []);

        // Fetch messages
        const { data: messagesData } = await supabase
          .from("circle_messages")
          .select("*, profiles(full_name)")
          .eq("circle_id", circleId)
          .order("created_at", { ascending: true });

        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error("Error fetching circle data:", error);
      toast({
        title: "Error",
        description: "Failed to load circle details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!circleId || !isMember) return;

    // Subscribe to real-time message updates
    const channel = supabase
      .channel(`circle_messages:${circleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'circle_messages',
          filter: `circle_id=eq.${circleId}`
        },
        async (payload) => {
          // Fetch the full message with profile data
          const { data } = await supabase
            .from('circle_messages')
            .select('*, profiles(full_name)')
            .eq('id', payload.new.id)
            .single();
          
          if (data) {
            setMessages((prev) => [...prev, data as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circleId, isMember]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !circleId || sendingMessage) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase.from("circle_messages").insert({
        circle_id: circleId,
        user_id: user.id,
        message: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to the circle.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleJoinCircle = async () => {
    if (!user || !circleId) return;

    try {
      const { error } = await supabase.from("circle_members").insert({
        circle_id: circleId,
        user_id: user.id,
        role: "member",
      });

      if (error) throw error;

      toast({
        title: "Joined Circle!",
        description: "You are now a member of this circle.",
      });

      fetchCircleData();
    } catch (error) {
      console.error("Error joining circle:", error);
      toast({
        title: "Error",
        description: "Failed to join circle. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Loading circle details...</div>
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="text-lg">Circle not found</div>
          <Button onClick={() => navigate("/stokie-circles")}>
            Back to Circles
          </Button>
        </div>
      </div>
    );
  }

  if (!isMember && circle.is_private) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Private Circle</h2>
              <p className="text-muted-foreground mb-4">
                This is a private circle. You need an invitation to join.
              </p>
              <Button onClick={() => navigate("/stokie-circles")}>
                Back to Circles
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const progress = (circle.current_amount / circle.target_amount) * 100;

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/stokie-circles")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Circles
            </Button>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{circle.name}</h1>
                  {circle.is_private ? (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Private
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Globe className="w-3 h-3" />
                      Public
                    </Badge>
                  )}
                  <Badge>{circle.status}</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {circle.goal_description}
                </p>
                {circle.description && (
                  <p className="text-muted-foreground mt-2">
                    {circle.description}
                  </p>
                )}
              </div>
              {!isMember && !circle.is_private && (
                <Button onClick={handleJoinCircle}>Join Circle</Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Target Amount</p>
                  <p className="text-lg font-bold">
                    R{circle.target_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Amount
                  </p>
                  <p className="text-lg font-bold">
                    R{circle.current_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-lg font-bold">{members.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Payout</p>
                  <p className="text-lg font-bold">
                    {circle.next_payout_date
                      ? new Date(circle.next_payout_date).toLocaleDateString()
                      : "TBD"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="p-6 mb-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Circle Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {progress.toFixed(1)}% Complete
                </span>
              </div>
              <Progress value={Math.min(progress, 100)} />
            </div>
          </Card>

          {/* Tabs */}
          {isMember && (
            <Tabs defaultValue="members" className="space-y-4">
              <TabsList>
                <TabsTrigger value="members">
                  <Users className="w-4 h-4 mr-2" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="contributions">
                  <Wallet className="w-4 h-4 mr-2" />
                  Contributions
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="voting">
                  <Vote className="w-4 h-4 mr-2" />
                  Voting
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="invites">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invites
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="members" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Circle Members</h3>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {member.profiles?.full_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.profiles?.email}
                          </p>
                        </div>
                        <Badge variant={member.role === "creator" ? "default" : "outline"}>
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="contributions" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Contribution Ledger
                  </h3>
                  <div className="space-y-3">
                    {contributions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No contributions yet
                      </p>
                    ) : (
                      contributions.map((contribution) => (
                        <div
                          key={contribution.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {contribution.profiles?.full_name || "Anonymous"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                contribution.contribution_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              R{contribution.amount.toLocaleString()}
                            </p>
                            <Badge
                              variant={
                                contribution.payment_status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {contribution.payment_status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Circle Chat</h3>
                  <div className="space-y-3 min-h-[400px] max-h-[500px] overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">
                              {message.profiles?.full_name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sendingMessage}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={sendingMessage || !newMessage.trim()}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="voting" className="space-y-4">
                <VotingInterface circleId={circleId} />
              </TabsContent>

              {isAdmin && (
                <TabsContent value="invites" className="space-y-4">
                  <InviteSystem 
                    circleId={circleId} 
                    circleName={circle.name}
                    isAdmin={isAdmin}
                  />
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;
