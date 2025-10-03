import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Bot, 
  Check, 
  Zap, 
  TrendingUp,
  Target,
  Shield,
  MessageCircle
} from "lucide-react";

const AIAssistant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToChat = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Financial Guidance
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Meet Gcini'mali Bot
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your 24/7 AI Financial Wellness Companion
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant answers to your money questions, personalized advice, and support on your journey to financial wellness—all powered by advanced AI.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="hero" onClick={scrollToChat}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting Now
              </Button>
              {!user && (
                <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                  Sign Up Free
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Gcini'mali Bot Can Do
            </h2>
            <p className="text-lg text-muted-foreground">
              Your AI assistant is here to help with all your financial questions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Budgeting & Saving</h3>
                <p className="text-muted-foreground">
                  Get personalized budgeting tips and strategies to save more effectively with practical South African advice.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Investment Guidance</h3>
                <p className="text-muted-foreground">
                  Learn about different investment options, from tax-free savings accounts to unit trusts and more.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Financial Planning</h3>
                <p className="text-muted-foreground">
                  Set and track financial goals, understand debt management, and plan for your future.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your AI Assistant
            </h2>
            <p className="text-lg text-muted-foreground">
              Upgrade to unlock advanced features and personalized guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Bot */}
            <Card className="p-8 border-2">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 mb-4">
                    FREE
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">GCINI'MALI BOT [V1]</h3>
                  <p className="text-muted-foreground">
                    Perfect for getting started with AI-powered financial guidance
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">24/7 availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Basic budgeting advice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">South African financial context</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">General savings tips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Educational resources</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline" onClick={scrollToChat}>
                  Start Chatting Free
                </Button>
              </div>
            </Card>

            {/* Pro Bot */}
            <Card className="p-8 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  PREMIUM
                </Badge>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 mb-4">
                    PRO & ELITE
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">GCINI'MALI BOT 2.0</h3>
                  <p className="text-muted-foreground">
                    Advanced AI with personalized insights and goal tracking
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold">Everything in V1, plus:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">Advanced AI model (Gemini 2.5 Pro)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">Personalized based on your profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">Financial goal tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">Priority response speed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">Custom investment strategies</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-secondary" onClick={() => navigate("/bot-promo")}>
                  Upgrade to Premium
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <Bot className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground">
              Your AI financial companion is waiting to help you achieve your money goals
            </p>
            <Button size="lg" variant="hero" onClick={scrollToChat}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with Gcini'mali Bot Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAssistant;
