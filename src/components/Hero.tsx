import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-[var(--shadow-soft)] animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              SA's Next-Generation Financial Wellness & Literacy Platform
            </span>
          </div>

          {/* Main heading */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              SA's Next-Generation Financial Wellness & Literacy Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered companion for financial growth, learning, and community connection
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-medium)]">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">10k+</h3>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-medium)]">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-4 mx-auto">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">500+</h3>
              <p className="text-sm text-muted-foreground">Learning Resources</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-medium)]">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Personalized Learning</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in pb-8">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="min-w-[200px]">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
