import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-card border-2 border-border rounded-3xl p-12 md:p-16 text-center shadow-[var(--shadow-medium)]">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
               Join 10K+ young South Africans
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Start your money journey today
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get AI guidance, practical learning, and a supportive crew to help you make smarter money moves, kasi to city.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth">
            <Button variant="hero" size="lg" className="min-w-[200px] group">
               Start free
               <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="min-w-[200px]">
               Talk to support
            </Button>
          </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
          No credit card required • Setup takes under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
};
