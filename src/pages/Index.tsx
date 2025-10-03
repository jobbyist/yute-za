import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AIDemo } from "@/components/AIDemo";
import { Community } from "@/components/Community";
import { CTA } from "@/components/CTA";
import { ChatBot } from "@/components/ChatBot";
import { MzansiMoneyManual } from "@/components/MzansiMoneyManual";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <AIDemo />
        <MzansiMoneyManual />
        <Community />
        <CTA />
      </main>
      <ChatBot />
      <footer className="bg-muted/50 border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">YUTE</h3>
              <p className="text-sm text-muted-foreground">
                SA's Next-Generation Financial Wellness & Literacy Platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/academy" className="hover:text-primary">VAULT SCHOOL</Link></li>
                <li><Link to="/ai-assistant" className="hover:text-primary">AI Assistant</Link></li>
                <li><Link to="/stokie-circles" className="hover:text-primary">Stokie Circles</Link></li>
                <li><Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link to="/bot-promo" className="hover:text-primary">Upgrade Plans</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/refunds" className="hover:text-primary">Refund Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-muted-foreground border-t border-border pt-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/yuteblack.svg" 
                alt="YUTE Logo" 
                style={{ width: '100px', height: 'auto' }}
              />
            </div>
            <p className="text-xs mb-2">
              © 2025 YUTE. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              ⚠️ Educational content only. Not financial advice. Consult a professional advisor for investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
