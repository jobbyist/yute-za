import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  Zap, 
  Crown,
  Copy,
  Clock,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BotPromo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    // Generate a unique promo code
    const code = `GCINI50-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setPromoCode(code);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    toast({
      title: "Promo code copied!",
      description: "Paste it at checkout to get 50% off your first month.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                LIMITED TIME OFFER
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Upgrade to GCINI'MALI BOT 2.0
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Get 50% off your first month with advanced AI-powered financial guidance
            </p>

            {/* Promo Code Card */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Offer expires in:</span>
                </div>
                <div className="text-4xl font-bold text-primary">
                  {formatTime(timeRemaining)}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your exclusive promo code:</p>
                  <div className="flex items-center gap-2 justify-center">
                    <code className="px-4 py-2 bg-background rounded-lg border border-border text-lg font-mono font-bold">
                      {promoCode}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyPromoCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ This promo code is valid for 24 hours from generation
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-muted-foreground">
              All plans include access to GCINI'MALI BOT 2.0 and premium features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-4">
                    FREE
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <div className="text-4xl font-bold mb-2">R0</div>
                  <p className="text-muted-foreground text-sm">
                    Forever free
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Basic AI assistant (V1)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Basic budgeting tools</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Community access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Educational content</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline" onClick={() => navigate("/auth")}>
                  Get Started Free
                </Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-1 text-xs font-bold">
                POPULAR
              </div>
              
              <div className="space-y-6 mt-4">
                <div>
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-4">
                    PRO
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold line-through text-muted-foreground">R99</span>
                    <div className="text-4xl font-bold">R49.50</div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    First month, then R99/month
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Everything in Free, plus:</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">GCINI'MALI BOT 2.0</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Financial goal tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Exclusive content</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Upgrade to Pro - 50% OFF
                </Button>
              </div>
            </Card>

            {/* Elite Plan */}
            <Card className="p-8 border-2 border-purple-500 bg-gradient-to-br from-purple-500/5 to-primary/5">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 mb-4">
                    <Crown className="w-3 h-3 mr-1 inline" />
                    ELITE
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Elite</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold line-through text-muted-foreground">R249</span>
                    <div className="text-4xl font-bold">R124.50</div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    First month, then R249/month
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Everything in Pro, plus:</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Personal financial advisor</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Custom investment strategies</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Tax optimization guidance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Monthly financial reviews</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">VIP support</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-primary">
                  Upgrade to Elite - 50% OFF
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Upgrade to GCINI'MALI BOT 2.0?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Advanced AI Model</h3>
                <p className="text-muted-foreground">
                  Powered by Google Gemini 2.5 Pro for more accurate and nuanced financial advice.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Personalized Insights</h3>
                <p className="text-muted-foreground">
                  Tailored recommendations based on your financial profile, goals, and preferences.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Goal Tracking</h3>
                <p className="text-muted-foreground">
                  Set, monitor, and achieve your financial goals with AI-powered progress tracking.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-6 bg-background/50">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Legal Disclaimer:</strong> YUTE is a financial wellness and literacy platform. 
              We do not offer financial advice or any services that require legal registration, 
              licensing, or authorization. The information provided through our platform, including 
              AI-generated responses, is for educational purposes only. Always consult with a 
              qualified financial advisor before making investment decisions.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BotPromo;
