import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Wallet, 
  Shield, 
  TrendingUp, 
  MessageCircle,
  Plus,
  Clock,
  CheckCircle2,
  Lock,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { CreateCircleDialog } from "@/components/stokie-circles/CreateCircleDialog";

type Circle = Tables<"stokie_circles"> & {
  member_count?: number;
};

const CircleCard = ({ circle }: { circle: Circle }) => {
  const navigate = useNavigate();
  const progress = (circle.current_amount / circle.target_amount) * 100;
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{circle.name}</h3>
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
            </div>
            <p className="text-sm text-muted-foreground">{circle.goal_description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              R{circle.current_amount.toLocaleString()} / R{circle.target_amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% Complete</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-sm font-semibold">{circle.member_count || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Monthly</p>
              <p className="text-sm font-semibold">R{circle.monthly_contribution}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate(`/circles/${circle.id}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

const StokieCircles = () => {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCircles();
  }, []);

  const fetchCircles = async () => {
    try {
      // Fetch public circles with member count
      const { data, error } = await supabase
        .from("stokie_circles")
        .select(`
          *,
          circle_members(count)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      // Transform the data to include member count
      const transformedData = data?.map(circle => ({
        ...circle,
        member_count: circle.circle_members?.[0]?.count || 0,
      })) || [];

      setCircles(transformedData);
    } catch (error) {
      console.error("Error fetching circles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCircleCreated = () => {
    fetchCircles();
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <CreateCircleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCircleCreated={handleCircleCreated}
      />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              🏦 Stokie Circles
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Digital Stokvel - Save Money Together, Achieve Goals Faster
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create or join virtual stokvel groups with transparent tracking, secure payments, 
              and built-in accountability. No more spreadsheets, just smart saving.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-5 h-5" />
                Create a Circle
              </Button>
              <Button size="lg" variant="outline">
                Browse Public Circles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How Stokie Circles Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create/Join Circles */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Create or Join Circles</h3>
                <p className="text-muted-foreground">
                  Start your own private circle with friends or join public circles to save with like-minded individuals.
                </p>
              </div>
            </Card>

            {/* Goal Setting */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Set Clear Goals</h3>
                <p className="text-muted-foreground">
                  Define your circle's purpose - whether it's a December payout, startup capital, or group investment.
                </p>
              </div>
            </Card>

            {/* Digital Wallet */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Digital Wallet Integration</h3>
                <p className="text-muted-foreground">
                  Powered by Stitch Money API - create wallets, top up, and withdraw directly to your bank account.
                </p>
              </div>
            </Card>

            {/* Transparent Ledger */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Transparent Ledger</h3>
                <p className="text-muted-foreground">
                  Real-time, immutable ledger shows all contributions and total pot. Full transparency, no trust issues.
                </p>
              </div>
            </Card>

            {/* Payout Schedule */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Payout Scheduling & Voting</h3>
                <p className="text-muted-foreground">
                  Set rotating or lump sum payouts. Built-in voting mechanism for group decisions.
                </p>
              </div>
            </Card>

            {/* Social Integration */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Circle Chat</h3>
                <p className="text-muted-foreground">
                  Each circle has its own discussion thread to stay connected and keep each other accountable.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Circles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Circles
            </h2>
            <p className="text-lg text-muted-foreground">
              Join these active circles or create your own
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading circles...</p>
            </div>
          ) : circles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No circles yet. Be the first to create one!
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create a Circle
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circles.map((circle) => (
                <CircleCard key={circle.id} circle={circle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Payment Integration Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary">
                <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold">Secure & Seamless Payments</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powered by <strong>Stitch Money</strong> payment gateway, our platform provides:
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Digital Wallet Creation</h4>
                    <p className="text-sm text-muted-foreground">
                      Create your own digital wallet linked to your circle
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Easy Top-Ups</h4>
                    <p className="text-sm text-muted-foreground">
                      Add money to your wallet from any South African bank
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Direct Bank Withdrawals</h4>
                    <p className="text-sm text-muted-foreground">
                      Withdraw funds directly to your bank account anytime
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Bank-Level Security</h4>
                    <p className="text-sm text-muted-foreground">
                      All transactions are encrypted and fully secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Stokie Circles?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Achieve Goals Faster</h3>
              <p className="text-muted-foreground">
                Collective saving helps you reach financial goals quicker than saving alone
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Full Transparency</h3>
              <p className="text-muted-foreground">
                No more "trust me" spreadsheets - see every transaction in real-time
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Built-In Accountability</h3>
              <p className="text-muted-foreground">
                Stay motivated with your circle's support and regular check-ins
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Start Your Savings Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of South Africans saving smarter with Stokie Circles
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                variant="hero"
                className="gap-2"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-5 h-5" />
                Create Your Circle
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-muted-foreground">
            <div className="flex justify-center mb-2">
              <img 
                src="/yuteblack.svg" 
                alt="YUTE Logo" 
                style={{ width: '100px', height: 'auto' }}
              />
            </div>
            <p className="text-sm">
              SA's Next-Generation Financial Wellness & Literacy Platform
            </p>
            <p className="text-xs mt-4">
              © 2025 YUTE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StokieCircles;
